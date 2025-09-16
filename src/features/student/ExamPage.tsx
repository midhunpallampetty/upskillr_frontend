import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { Question } from './types/exam';
import { useExamTimer } from './hooks/useTimer';
import { ExamHeader } from './components/UI/ExamHeader';
import { ExamTimer } from './components/UI/ExamTimer';
import { QuestionCard } from './components/UI/QuestionCard';
import { QuestionNavigation } from './components/UI/QuestionNavigation';
import { ExamSubmission } from './components/UI/ExamSubmission';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { fetchQuestions, saveExamResult, initiatePayment } from './api/exam.api';
import { submitExamStatus } from './api/examattempt.api';

const EXAM_DURATION = 60 * 60; // 1 hour

export function ExamPage() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading
  const [error, setError] = useState<string | null>(null);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleTimeUp = useCallback(() => {
    if (!isSubmitted) handleSubmitExam();
  }, [isSubmitted]);

  const { timeRemaining, formatTime, stop } = useExamTimer(EXAM_DURATION, handleTimeUp);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const schoolName = Cookies.get('dbname');
        if (!courseId || !schoolName) {
          throw new Error('Missing courseId or schoolName');
        }

        const fetchedQuestions = await fetchQuestions(courseId, schoolName);
        setQuestions(fetchedQuestions);
      } catch (err) {
        // If it's a 500 error indicating no exam, redirect immediately
        if (err.response && err.response.status === 500) {
          try {
            const schoolName = Cookies.get('dbname');
            if (!schoolName) {
              throw new Error('Missing schoolName for payment initiation');
            }
            const paymentUrl = await initiatePayment(schoolName, courseId);
            if (paymentUrl) {
              window.location.href = paymentUrl;
            } else {
              setError('Payment initiation failed. Please try again later.');
            }
          } catch (error) {
            console.error('Payment redirect error:', error);
            setError('Payment setup failed. Please try again later.');
          }
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch questions');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [courseId]);

  // Check for pending submissions on mount
  useEffect(() => {
    const pending = localStorage.getItem(`pending-exam-status-${courseId}`);
    if (pending) {
      const { studentId, courseId, status, isPassed } = JSON.parse(pending);
      retrySubmitExamStatus(studentId, courseId, status, isPassed).then(success => {
        if (success) {
          localStorage.removeItem(`pending-exam-status-${courseId}`);
          console.log('Pending exam status submitted successfully');
        }
      });
    }
  }, [courseId]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleQuestionNavigation = (index: number) => setCurrentQuestionIndex(index);
  const handlePrevious = () => currentQuestionIndex > 0 && setCurrentQuestionIndex(prev => prev - 1);
  const handleNext = () => currentQuestionIndex < questions.length - 1 && setCurrentQuestionIndex(prev => prev + 1);

  const calculateScore = () => {
    let correctAnswers = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    questions.forEach((q) => {
      totalMarks += q.marks;
      const selected = answers[q._id];
      if (selected === q.correctAnswer) {
        correctAnswers++;
        obtainedMarks += q.marks;
      }
    });

    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    return {
      totalQuestions: questions.length,
      totalMarks,
      obtainedMarks,
      correctAnswers,
      wrongAnswers: questions.length - correctAnswers,
      percentage: percentage.toFixed(2),
    };
  };

  const retrySubmitExamStatus = async (studentId: string, courseId: string, status: string, isPassed: boolean, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        await submitExamStatus(studentId, courseId, status, isPassed);
        console.log('Exam status submitted successfully:', { studentId, courseId, status, isPassed });
        return true;
      } catch (err) {
        console.warn(`Retry ${i + 1} failed:`, err.message);
        if (i === retries - 1) {
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    return false;
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    stop();
    setIsSubmitted(true);
    setShowSubmissionDialog(false);
    setError(null); // Reset error state

    const score = calculateScore();
    setResult(score);

    const student = localStorage.getItem('student');
    const studentObj = student ? JSON.parse(student) : null;
    const studentId = studentObj?._id;
    const isPassed = Number(score.percentage) >= 40;

    // Log for debugging
    console.log('Submitting exam:', { studentId, courseId, isPassed, score });

    // Submit exam status (for both pass and fail)
    try {
      if (!studentId || !courseId) {
        throw new Error('Missing studentId or courseId');
      }
      const success = await retrySubmitExamStatus(studentId, courseId, 'final', isPassed);
      if (!success) {
        throw new Error('All retries failed for submitExamStatus');
      }
    } catch (err) {
      console.error('Failed to submit exam status:', err.message, err.stack);
      setError('Failed to save exam results. Please try again.');
      // Save to localStorage for later retry
      localStorage.setItem(
        `pending-exam-status-${courseId}`,
        JSON.stringify({ studentId, courseId, status: 'final', isPassed })
      );
      setIsSubmitting(false);
      return; // Stop further processing if status submission fails
    }

    // Handle pass/fail logic with SweetAlert2
    if (isPassed) {
      // Success Alert with celebration
      await Swal.fire({
        title: '🎉 Congratulations!',
        html: `<div style="text-align: center;">
          <h3 style="color: #28a745; margin: 10px 0;">You Passed the Exam!</h3>
          <p style="font-size: 18px; margin: 15px 0;">Score: <strong style="color: #28a745;">${score.percentage}%</strong></p>
          <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 15px; border-radius: 10px; margin: 10px 0;">
            <p style="color: white; margin: 5px 0;">✅ Correct Answers: ${score.correctAnswers}/${score.totalQuestions}</p>
            <p style="color: white; margin: 5px 0;">📊 Marks Obtained: ${score.obtainedMarks}/${score.totalMarks}</p>
          </div>
        </div>`,
        icon: 'success',
        confirmButtonText: 'Proceed to Payment',
        confirmButtonColor: '#28a745',
        allowOutsideClick: false,
        customClass: {
          popup: 'swal2-show',
          title: 'swal2-title',
          content: 'swal2-content'
        }
      });

      if (studentId) {
        localStorage.setItem(`examPassed-${courseId}-${studentId}`, 'true');
      }

      try {
        const schoolName = Cookies.get('dbname');
        if (!schoolName) {
          throw new Error('Missing schoolName for payment initiation');
        }
        const paymentUrl = await initiatePayment(schoolName, courseId);
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          setError('Payment initiation failed. Please try again later.');
        }
      } catch (error) {
        console.error('Payment redirect error:', error);
        setError('Payment setup failed. Please try again later.');
      }
    } else {
      // Failure Alert with detailed breakdown
      await Swal.fire({
        title: '❌ Exam Not Passed',
        html: `<div style="text-align: center;">
          <h3 style="color: #dc3545; margin: 10px 0;">Better luck next time!</h3>
          <p style="font-size: 18px; margin: 15px 0;">Score: <strong style="color: #dc3545;">${score.percentage}%</strong></p>
          <p style="color: #6c757d; margin: 10px 0;">Minimum required: <strong>40%</strong></p>
          <div style="background: linear-gradient(135deg, #dc3545, #e74c3c); padding: 15px; border-radius: 10px; margin: 10px 0;">
            <p style="color: white; margin: 5px 0;">✅ Correct Answers: ${score.correctAnswers}/${score.totalQuestions}</p>
            <p style="color: white; margin: 5px 0;">❌ Wrong Answers: ${score.wrongAnswers}/${score.totalQuestions}</p>
            <p style="color: white; margin: 5px 0;">📊 Marks: ${score.obtainedMarks}/${score.totalMarks}</p>
          </div>
          <p style="color: #6c757d; font-size: 14px; margin-top: 15px;">💡 Review the course material and try again!</p>
        </div>`,
        icon: 'error',
        confirmButtonText: 'Try Again Later',
        confirmButtonColor: '#dc3545',
        allowOutsideClick: false,
        customClass: {
          popup: 'swal2-show',
          title: 'swal2-title',
          content: 'swal2-content'
        }
      });
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="ml-3 text-gray-600">Loading exam questions...</p>
      </div>
    );
  }

  if (error && !isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Failed to Load Exam</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn bg-blue-500 text-white px-4 py-2 rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">No Questions Available</h2>
      </div>
    );
  }

  if (isSubmitted && result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-4">
            {result.percentage >= 40 ? (
              <span className="text-green-500">✅ Exam Passed</span>
            ) : (
              <span className="text-red-500">❌ Exam Failed</span>
            )}
          </div>
          <p className="text-gray-700">Correct: {result.correctAnswers} / {result.totalQuestions}</p>
          <p className="text-gray-700">Marks: {result.obtainedMarks} / {result.totalMarks}</p>
          <p className="text-gray-700">Percentage: {result.percentage}%</p>
          {error && (
            <div className="text-red-500 text-center mt-4">
              {error}
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="ml-4 btn bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                ) : (
                  'Retry Submission'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const answeredCount = Object.keys(answers).length;
  const isLowTime = timeRemaining < 300;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <ExamHeader
          courseName="Course Exam"
          examType="Final"
          studentName={Cookies.get('studentName') || 'Student'}
          totalQuestions={questions.length}
          totalMarks={totalMarks}
        />

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <ExamTimer timeRemaining={formatTime} isLowTime={isLowTime} />
            </div>

            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={answers[currentQuestion._id]}
              onAnswerSelect={(answer) => handleAnswerSelect(currentQuestion._id, answer)}
            />

            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="btn px-6 py-3 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-3">
                {currentQuestionIndex === questions.length - 1 && (
                  <button
                    onClick={() => setShowSubmissionDialog(true)}
                    disabled={isSubmitting}
                    className="btn px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Submit Exam
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="btn px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <QuestionNavigation
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              answers={answers}
              questionIds={questions.map(q => q._id)}
              onQuestionSelect={handleQuestionNavigation}
              onPrevious={handlePrevious}
              onNext={handleNext}
              canGoPrevious={currentQuestionIndex > 0}
              canGoNext={currentQuestionIndex < questions.length - 1}
            />

            <div className="mt-6 bg-white p-4 shadow rounded">
              <h4 className="font-semibold text-gray-800 mb-2">Exam Progress</h4>
              <p className="text-sm">Answered: {answeredCount} / {questions.length}</p>
              <p className="text-sm">Remaining: {questions.length - answeredCount}</p>
              <div className="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSubmissionDialog && (
        <ExamSubmission
          totalQuestions={questions.length}
          answeredQuestions={answeredCount}
          onSubmit={handleSubmitExam}
          onCancel={() => setShowSubmissionDialog(false)}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Question } from './types/exam';
import { useExamTimer } from './hooks/useTimer';
import { ExamHeader } from './components/UI/ExamHeader';
import { ExamTimer } from './components/UI/ExamTimer';
import { QuestionCard } from './components/UI/QuestionCard';
import { QuestionNavigation } from './components/UI/QuestionNavigation';
import { ExamSubmission } from './components/UI/ExamSubmission';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { fetchQuestions, saveExamResult, initiatePayment } from './api/exam.api';

const EXAM_DURATION = 60 * 60; // 1 hour

export function ExamPage() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
        if (!courseId || !schoolName) throw new Error('Missing required parameters');

        const fetchedQuestions = await fetchQuestions(courseId, schoolName);
        setQuestions(fetchedQuestions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
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

    const percentage = (obtainedMarks / totalMarks) * 100;

    return {
      totalQuestions: questions.length,
      totalMarks,
      obtainedMarks,
      correctAnswers,
      wrongAnswers: questions.length - correctAnswers,
      percentage: percentage.toFixed(2),
    };
  };

  const handleSubmitExam = async () => {
    stop();
    setIsSubmitted(true);
    setShowSubmissionDialog(false);

    const score = calculateScore();
    setResult(score);

    const schoolName = Cookies.get('dbname');
    const studentId = Cookies.get('studentId');
    const studentName = Cookies.get('studentName');

    try {
      await saveExamResult(courseId, schoolName, studentId, studentName, score);
    } catch (err) {
      console.error('Failed to save exam result:', err);
    }

    if (score.percentage >= 40) {
      alert(`🎉 Congratulations! You passed with ${score.percentage}%`);

      const studentStr = localStorage.getItem('student');
      const studentObj = studentStr ? JSON.parse(studentStr) : null;
      const studentId = studentObj?._id;

      if (studentId) {
        localStorage.setItem(`examPassed-${courseId}-${studentId}`, 'true');
      } else {
        console.warn('Student ID not found in localStorage. Exam pass flag not saved.');
      }

      try {
        const paymentUrl = await initiatePayment(schoolName, courseId);
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          alert('Something went wrong with payment. Please try again later.');
        }
      } catch (error) {
        console.error('Payment redirect error:', error);
        alert('Payment setup failed. Please try again later.');
      }
    } else {
      alert(`❌ Sorry, you failed with ${score.percentage}%\nCorrect: ${score.correctAnswers}/${score.totalQuestions}, Marks: ${score.obtainedMarks}/${score.totalMarks}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="ml-3 text-gray-600">Loading exam questions...</p>
      </div>
    );
  }

  if (error) {
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
          <div className="text-green-500 text-3xl mb-4">
            {result.percentage >= 40 ? '✅ Exam Passed' : '❌ Exam Failed'}
          </div>
          <p className="text-gray-700">Correct: {result.correctAnswers} / {result.totalQuestions}</p>
          <p className="text-gray-700">Marks: {result.obtainedMarks} / {result.totalMarks}</p>
          <p className="text-gray-700">Percentage: {result.percentage}%</p>
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
                    className="btn px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
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
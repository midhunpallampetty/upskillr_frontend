import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ExamSubmissionProps {
  totalQuestions: number;
  answeredQuestions: number;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ExamSubmission({ 
  totalQuestions, 
  answeredQuestions, 
  onSubmit, 
  onCancel 
}: ExamSubmissionProps) {
  const unansweredCount = totalQuestions - answeredQuestions;
  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Submit Exam?
          </h3>
          <p className="text-gray-600">
            Are you sure you want to submit your exam? This action cannot be undone.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Answered:</span>
              <span className="text-green-600 font-medium">{answeredQuestions}</span>
            </div>
            {unansweredCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Unanswered:</span>
                <span className="text-red-600 font-medium">{unansweredCount}</span>
              </div>
            )}
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-800 font-medium">Incomplete Exam</p>
                <p className="text-yellow-700">
                  You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}. 
                  You can still submit, but consider reviewing them first.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Review Answers
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
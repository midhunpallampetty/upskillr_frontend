import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  answers: { [key: string]: string };
  questionIds: string[];
  onQuestionSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function QuestionNavigation({
  currentIndex,
  totalQuestions,
  answers,
  questionIds,
  onQuestionSelect,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}: QuestionNavigationProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Overview</h3>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const questionId = questionIds[index];
          const isAnswered = answers[questionId];
          const isCurrent = index === currentIndex;

          return (
            <button
              key={index}
              onClick={() => onQuestionSelect(index)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                isCurrent
                  ? 'bg-blue-500 text-white shadow-lg'
                  : isAnswered
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            canGoPrevious
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-sm text-gray-600">
          {currentIndex + 1} of {totalQuestions}
        </span>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            canGoNext
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
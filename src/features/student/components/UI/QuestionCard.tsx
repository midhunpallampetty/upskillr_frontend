import React from 'react';
import { Question } from '../../types/exam';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: string | undefined;
  onAnswerSelect: (answer: string) => void;
}

export function QuestionCard({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onAnswerSelect 
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Question {questionNumber}
          </span>
          <span className="text-sm text-gray-500">
            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
          </span>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question.questionText}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {optionLabel}
                </span>
                <span className="text-gray-700 leading-relaxed">{option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
import React from 'react';
import { BookOpen, User, Calendar } from 'lucide-react';

interface ExamHeaderProps {
  courseName: string;
  examType: string;
  studentName: string;
  totalQuestions: number;
  totalMarks: number;
}

export function ExamHeader({ 
  courseName, 
  examType, 
  studentName, 
  totalQuestions, 
  totalMarks 
}: ExamHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{courseName} - {examType} Exam</h1>
          <div className="flex items-center gap-4 text-blue-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{totalQuestions} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{totalMarks} Total Marks</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
          <User className="w-4 h-4" />
          <span>{studentName}</span>
        </div>
      </div>
    </div>
  );
}
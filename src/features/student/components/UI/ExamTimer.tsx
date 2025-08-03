import React from 'react';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  timeRemaining: string;
  isLowTime: boolean;
}

export function ExamTimer({ timeRemaining, isLowTime }: ExamTimerProps) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold ${
      isLowTime 
        ? 'bg-red-50 text-red-700 border border-red-200' 
        : 'bg-blue-50 text-blue-700 border border-blue-200'
    }`}>
      <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-500' : 'text-blue-500'}`} />
      <span>{timeRemaining}</span>
    </div>
  );
}
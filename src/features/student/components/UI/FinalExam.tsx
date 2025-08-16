import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';

const FinalExamComponent = ({ exam, onSubmit, onCancel }: { exam: any; onSubmit: (passed: boolean, score: number, total: number) => void; onCancel: () => void }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const calculateScore = () => {
    let score = 0;
    let totalMarks = 0;
    exam.questions.forEach((q: any) => {
      const mark = q.marks || 1;
      totalMarks += mark;
      if (selectedAnswers[q._id] === q.correctAnswer) {
        score += mark;
      }
    });
    return { score, totalMarks, percentage: (score / totalMarks) * 100 };
  };
  
  const handleSubmit = () => {
    const { score, totalMarks, percentage } = calculateScore();
    onSubmit(percentage >= 50, score, totalMarks);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Award className="text-indigo-600" />
        Final Exam: {exam.title}
      </h2>
      {exam.questions.map((q: any, index: number) => (
        <div key={q._id} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3">{index + 1}. {q.questionText}</h3>
          <div className="grid gap-2">
            {q.options.map((opt: string, optIndex: number) => (
              <button 
                key={optIndex}
                onClick={() => handleAnswerSelect(q._id, opt)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedAnswers[q._id] === opt 
                    ? 'bg-indigo-100 border-indigo-500' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-4 mt-6">
        <button 
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          disabled={Object.keys(selectedAnswers).length < exam.questions.length}
        >
          <CheckCircle size={18} /> Submit Final Exam
        </button>
        <button 
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default FinalExamComponent;

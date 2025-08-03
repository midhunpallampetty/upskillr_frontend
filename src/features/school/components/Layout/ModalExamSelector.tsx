import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Exam {
  _id: string;
  title: string;
  createdAt: string;
}

interface Props {
  schoolName: string;
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ModalExamSelector: React.FC<Props> = ({ schoolName, courseId, isOpen, onClose }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [examType, setExamType] = useState<'preliminary' | 'final'>('preliminary');
  const [loading, setLoading] = useState(false);
console.log(exams,'exam')
  const fetchExams = async () => {
    try {
      const { data } = await axios.get('http://exam.localhost:5000/api/exam/all-exams',{params:{schoolName}});
      
      setExams(data);
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedExam || !examType) return;

    try {
      setLoading(true);
      await axios.put(`http://course.localhost:5000/api/${schoolName}/courses/${courseId}/exams`, {
        examId: selectedExam,
        examType,
      });
      alert(`Successfully updated ${examType} exam`);
      onClose();
    } catch (err) {
      console.error('Error updating course exam:', err);
      alert('Failed to update exam');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExams();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Select Exam</h2>

        <label className="block mb-2 font-medium">Exam Type</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={examType}
          onChange={(e) => setExamType(e.target.value as 'preliminary' | 'final')}
        >
          <option value="preliminary">Preliminary</option>
          <option value="final">Final</option>
        </select>

        <label className="block mb-2 font-medium">Exam</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
        >
          <option value="">-- Select an Exam --</option>
          {exams.map((exam) => (
            <option className='text-black' key={exam._id} value={exam._id}>
              {exam.title}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalExamSelector;

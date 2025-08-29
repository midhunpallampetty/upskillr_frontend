// Updated ModalExamSelector component using the separated API functions

import React, { useEffect, useState } from 'react';
import { Props, Exam } from '../../types/Props';
import { fetchAllExams, updateCourseExam } from '../../api/exam.controll'; // Adjust path to your API file

const ModalExamSelector: React.FC<Props> = ({ 
  schoolName, 
  courseId, 
  isOpen, 
  onClose,
  onSuccess,
  currentPreliminaryExam,
  currentFinalExam 
}) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [examType, setExamType] = useState<'preliminary' | 'final'>('preliminary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllExams(schoolName);
      setExams(data);
    } catch (err: any) {
      console.error('Error fetching exams:', err);
      setError(err.message || 'Failed to load exams. Check network or server CORS settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedExam || !examType) return;
    const existingExam = examType === 'preliminary' ? currentPreliminaryExam : currentFinalExam;
    if (existingExam) {
      const confirm = window.confirm(`This will replace the existing ${examType} exam ("${existingExam.title}"). Continue?`);
      if (!confirm) return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateCourseExam(schoolName, courseId, selectedExam, examType);
      alert(`Successfully updated ${examType} exam`);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error updating course exam:', err);
      setError(err.message || 'Failed to update exam. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && schoolName) {
      loadExams();
    }
  }, [isOpen, schoolName]);

  useEffect(() => {
    const current = examType === 'preliminary' ? currentPreliminaryExam : currentFinalExam;
    setSelectedExam(current?._id || '');
  }, [examType, currentPreliminaryExam, currentFinalExam]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Select Exam</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <p className="text-sm font-medium">Current Preliminary Exam: {currentPreliminaryExam ? currentPreliminaryExam.title : 'None'}</p>
          <p className="text-sm font-medium">Current Final Exam: {currentFinalExam ? currentFinalExam.title : 'None'}</p>
        </div>

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
          disabled={loading || exams.length === 0}
        >
          <option value="">-- Select an Exam --</option>
          {exams.map((exam) => (
            <option className="text-black" key={exam._id} value={exam._id}>
              {exam.title}
            </option>
          ))}
        </select>

        {loading && <p className="text-blue-500 mb-4">Loading...</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedExam}
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

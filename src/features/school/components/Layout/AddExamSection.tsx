import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Exam } from '../../types/Exam'; // Adjust path; define Exam type if needed (e.g., { _id: string, examName: string })
import { AddExamToSectionModalProps } from '../../types/AddExamToSectionModalProps';

const AddExamToSectionModal: React.FC<AddExamToSectionModalProps> = ({
  isOpen,
  onClose,
  schoolName,
  sectionId,
  onSuccess,
}) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchExams = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`https://exam.upskillr.online/api/exam/all-exams?schoolName=${schoolName}`);
          setExams(data); // Assume API returns array of exams
        } catch (err) {
          console.error('❌ Failed to fetch exams:', err);
          Swal.fire({ title: 'Error!', text: 'Failed to load exams.', icon: 'error' });
        } finally {
          setLoading(false);
        }
      };
      fetchExams();
    }
  }, [isOpen, schoolName]);

  const handleAddExam = async () => {
    if (!selectedExamId) {
      Swal.fire({ title: 'Error!', text: 'Please select an exam.', icon: 'warning' });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will add the exam to the section!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post(`https://course.upskillr.online/api/${schoolName}/sections/${sectionId}/exam`, {
        examId: selectedExamId,
      });
      await Swal.fire({ title: 'Success!', text: 'Exam added to section.', icon: 'success' });
      onSuccess(); // Refresh sections
      onClose();
    } catch (err) {
      console.error('❌ Failed to add exam:', err);
      Swal.fire({ title: 'Error!', text: 'Failed to add exam.', icon: 'error' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Select Exam to Add</h3>
        {loading ? (
          <p className="text-gray-700 text-base">Loading exams...</p> // Improved text size and color
        ) : exams.length === 0 ? (
          <p className="text-gray-700 text-base">No exams available.</p> // Improved text size and color
        ) : (
          <select
            className="w-full p-3 border border-gray-300 rounded mb-4 text-gray-800 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" // Enhanced padding, font size, contrast, and focus state
            value={selectedExamId || ''}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            <option value="">-- Select Exam --</option>
            {exams.map((exam) => (
              <option
                key={exam._id}
                value={exam._id}
                className="truncate" // Truncate long text with ellipsis to prevent overflow
              >
                {exam.title || 'Unnamed Exam'} {/* Fallback if examName is missing; adjust field as needed */}
              </option>
            ))}
          </select>
        )}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded text-gray-800 text-base hover:bg-gray-400">Cancel</button> // Added text color for readability
          <button onClick={handleAddExam} className="px-4 py-2 bg-blue-600 text-white rounded text-base hover:bg-blue-700">Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddExamToSectionModal;

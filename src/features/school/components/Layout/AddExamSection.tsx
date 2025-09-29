import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Exam } from '../../types/Exam';
import { AddExamToSectionModalProps } from '../../types/AddExamToSectionModalProps';
import { getAllExams, getSectionExam, addExamToSection } from '../../api/exam.api';

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
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const examsList = await getAllExams(schoolName);
          setExams(examsList);

          const sectionExam = await getSectionExam(schoolName, sectionId);
          setCurrentExam(sectionExam);
        } catch (err) {
          console.error('❌ Failed to fetch exams or section exam:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to load exams.',
            icon: 'error',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, schoolName, sectionId]);

  const handleAddExam = async () => {
    if (!selectedExamId) {
      Swal.fire({ title: 'Error!', text: 'Please select an exam.', icon: 'warning' });
      return;
    }

    if (currentExam) {
      const confirmReplace = await Swal.fire({
        title: 'Exam already assigned',
        text: `This section already has an exam (${currentExam.title}). Do you want to replace it?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, replace it!',
      });
      if (!confirmReplace.isConfirmed) return;
    }

    try {
      await addExamToSection(schoolName, sectionId, selectedExamId);
      await Swal.fire({
        title: 'Success!',
        text: currentExam ? 'Exam replaced successfully.' : 'Exam added successfully.',
        icon: 'success',
      });
      onSuccess();
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
        <h3 className="text-lg font-bold mb-4">Assign Exam to Section</h3>

        {loading ? (
          <p className="text-gray-700 text-base">Loading exams...</p>
        ) : (
          <>
            {currentExam ? (
              <div className="mb-4 p-3 border border-yellow-400 bg-yellow-50 rounded">
                <p className="text-gray-800 text-base">
                  <strong>Current Exam:</strong> {currentExam.title || 'Unnamed Exam'}
                </p>
                <p className="text-sm text-gray-600">
                  Selecting another exam will replace this one.
                </p>
              </div>
            ) : (
              <p className="text-gray-700 text-base mb-2">No exam currently assigned.</p>
            )}

            {exams.length === 0 ? (
              <p className="text-gray-700 text-base">No exams available.</p>
            ) : (
              <select
                className="w-full p-3 border border-gray-300 rounded mb-4 text-gray-800 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedExamId || ''}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                <option value="">-- Select Exam --</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id} className="truncate">
                    {exam.title || 'Unnamed Exam'}
                  </option>
                ))}
              </select>
            )}
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded text-gray-800 text-base hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAddExam}
            disabled={loading || exams.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded text-base hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentExam ? 'Replace Exam' : 'Add Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExamToSectionModal;

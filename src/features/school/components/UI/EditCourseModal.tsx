import React, { useState } from 'react';
import { Course } from '../../types/Course';

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
  onSave: (data: Partial<Course>) => void;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  course,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    courseName: course.courseName,
    fee: course.fee,
    noOfLessons: course.noOfLessons,
    courseThumbnail: course.courseThumbnail,
    isPreliminaryRequired: course.isPreliminaryRequired,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? target.checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
        <div className="space-y-3">
          <input
            name="courseName"
            value={form.courseName}
            onChange={handleChange}
            placeholder="Course Name"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="fee"
            value={form.fee}
            onChange={handleChange}
            placeholder="Fee"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="noOfLessons"
            value={form.noOfLessons}
            onChange={handleChange}
            placeholder="Number of Lessons"
            className="w-full border p-2 rounded"
          />
          <input
            name="courseThumbnail"
            value={form.courseThumbnail}
            onChange={handleChange}
            placeholder="Thumbnail URL"
            className="w-full border p-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPreliminaryRequired"
              checked={form.isPreliminaryRequired}
              onChange={handleChange}
            />
            Preliminary Required
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;

import React, { useState } from 'react';
import axios from 'axios';
import { Course } from '../../types/Course';
import { toast } from 'react-toastify';

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
    description: course.description || '', // ✅ added
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target as HTMLInputElement;
    const checked = type === 'checkbox' ? (target as HTMLInputElement).checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_present', import.meta.env.VITE_UPLOAD_PRESET);

    setUploading(true);
    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        formData
      );
      if (data.secure_url) {
        setForm((prev) => ({
          ...prev,
          courseThumbnail: data.secure_url,
        }));
      } else {
        alert('Image upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave(form);
    toast.success('Course updated successfully!');
    onClose();
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

          {/* ✅ New Description Field */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Course Description"
            className="w-full border p-2 rounded resize-none h-24"
          />

          <div className="space-y-2">
            <label className="block font-medium">Thumbnail</label>
            {form.courseThumbnail && (
              <img
                src={form.courseThumbnail}
                alt="Course Thumbnail"
                className="w-full h-40 object-cover rounded border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          </div>

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
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={uploading}
          >
            {uploading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;

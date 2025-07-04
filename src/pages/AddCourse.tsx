import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Section from '../../src/pages/types/Section';


const CLOUD_NAME = 'dgnjzuwqu';
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET| ""  ;

const AddCoursePage: React.FC = () => {
  const [courseName, setCourseName] = useState('');
  const [isPreliminary, setIsPreliminary] = useState(false);
  const [courseThumbnail, setCourseThumbnail] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [noOfLessons, setNoOfLessons] = useState<number | ''>('');
  const [fee, setFee] = useState<number | ''>('');
  const [sections, setSections] = useState<Section[]>([{ title: '' }]);
  const [error, setError] = useState<string>('');

  // Handle client-side creation of object URL for thumbnail preview
  useEffect(() => {
    if (courseThumbnail) {
      const url = URL.createObjectURL(courseThumbnail);
      setPreviewURL(url);
      return () => {
        URL.revokeObjectURL(url); // Cleanup to prevent memory leaks
      };
    } else {
      setPreviewURL(null);
    }
  }, [courseThumbnail]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCourseThumbnail(file);
      setError(''); // Clear any previous error
    } else {
      setError('Please upload a valid image file');
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url;
  };

  const handleSectionChange = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index].title = value;
    setSections(newSections);
  };

  const addSection = () => setSections([...sections, { title: '' }]);

  const removeSection = (index: number) =>
    setSections(sections.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dbname = Cookies.get('dbname Ascending dbname');
    const schoolId = JSON.parse(Cookies.get('schoolData') || '{}')._id;

    if (!dbname || !schoolId) {
      setError('School data missing. Please login again.');
      return;
    }

    if (!courseThumbnail) {
      setError('Please upload a course thumbnail!');
      return;
    }

    try {
      const thumbnailURL = await uploadToCloudinary(courseThumbnail);

      const payload = {
        courseName,
        isPreliminaryRequired: isPreliminary,
        courseThumbnail: thumbnailURL,
        noOfLessons: Number(noOfLessons),
        fee: Number(fee),
        sections,
        forum: null,
        school: schoolId,
      };

      const response = await axios.post(
        `http://course.localhost:5000/api/school/${dbname}/add-course`,
        payload
      );

      console.log('✅ Course Added:', response.data);
      setError('');
      alert('Course added successfully!');
    } catch (error) {
      console.error('❌ Submission error:', error);
      setError('Something went wrong while submitting the course.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6">📘 Add New Course</h2>
      {error && <div className="text-red-600 mb-4" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="courseName" className="block font-medium">Course Name</label>
          <input
            id="courseName"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPreliminary"
            checked={isPreliminary}
            onChange={(e) => setIsPreliminary(e.target.checked)}
          />
          <label htmlFor="isPreliminary">Is Preliminary?</label>
        </div>
        <div>
          <label htmlFor="courseThumbnail" className="block font-medium">Course Thumbnail</label>
          <input
            id="courseThumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="mt-1"
          />
          {previewURL && (
            <img
              src={previewURL}
              alt="Preview"
              className="mt-2 w-40 h-24 object-cover rounded shadow"
            />
          )}
        </div>
        <div>
          <label htmlFor="noOfLessons" className="block font-medium">Number of Lessons</label>
          <input
            id="noOfLessons"
            type="number"
            value={noOfLessons}
            onChange={(e) =>
              setNoOfLessons(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="w-full border px-3 py-2 rounded"
            min={1}
            required
          />
        </div>
        <div>
          <label htmlFor="courseFee" className="block font-medium">Course Fee (₹)</label>
          <input
            id="courseFee"
            type="number"
            value={fee}
            onChange={(e) =>
              setFee(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="w-full border px-3 py-2 rounded"
            min={0}
            required
          />
        </div>
        <div>
          <label htmlFor="section-0" className="block font-medium mb-1">Sections</label>
          {sections.map((section, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                id={`section-${idx}`}
                type="text"
                placeholder={`Section ${idx + 1}`}
                value={section.title}
                onChange={(e) => handleSectionChange(idx, e.target.value)}
                className="flex-grow border px-3 py-2 rounded"
                required
              />
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(idx)}
                  className="text-red-600 hover:text-red-800 text-xl"
                  title="Remove Section"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="text-blue-600 hover:underline mt-2"
          >
            ➕ Add Section
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
        >
          Submit Course
        </button>
      </form>
    </div>
  );
};

export default AddCoursePage;
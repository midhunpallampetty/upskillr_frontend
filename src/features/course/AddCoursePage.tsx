import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import uploadToCloudinary from './utils/uploadToCloudinary';
import TextInput from './components/TextInput';
import NumberInput from './components/NumberInput';
import Checkbox from './components/Checkbox';
import ThumbnailUploader from './components/ThumbnailUploader';
import SectionsList from './components/SectionsList';
import Section from './types/Section';

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const AddCoursePage: React.FC = () => {
  const [courseName, setCourseName] = useState('');
  const [isPreliminary, setIsPreliminary] = useState(false);
  const [courseThumbnail, setCourseThumbnail] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [noOfLessons, setNoOfLessons] = useState<number | ''>('');
  const [fee, setFee] = useState<number | ''>('');
  const [sections, setSections] = useState<Section[]>([{ title: '' }]);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dbname = Cookies.get('dbname');
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
      const thumbnailURL = await uploadToCloudinary(courseThumbnail, UPLOAD_PRESET, CLOUD_NAME);

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
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          label="Course Name"
          id="courseName"
          value={courseName}
          onChange={setCourseName}
        />

        <Checkbox
          label="Is Preliminary?"
          id="isPreliminary"
          checked={isPreliminary}
          onChange={setIsPreliminary}
        />

        <ThumbnailUploader
          file={courseThumbnail}
          setFile={setCourseThumbnail}
          previewURL={previewURL}
          setPreviewURL={setPreviewURL}
          setError={setError}
        />

        <NumberInput
          label="Number of Lessons"
          id="noOfLessons"
          value={noOfLessons}
          onChange={setNoOfLessons}
          min={1}
        />

        <NumberInput
          label="Course Fee (₹)"
          id="courseFee"
          value={fee}
          onChange={setFee}
          min={0}
        />

        <SectionsList sections={sections} setSections={setSections} />

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

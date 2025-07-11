import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import uploadToCloudinary from './utils/uploadToCloudinary';

import TextInput from './components/TextInput';
import NumberInput from './components/NumberInput';
import Checkbox from './components/Checkbox';
import ThumbnailUploader from './components/ThumbnailUploader';
import SectionsList from './components/SectionsList';
import LoadingButton from '../shared/components/Loader'; 
import Section from './types/Section';
import Navbar from '../shared/components/Navbar';

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 🧠 Basic Validations
    if (!courseName.trim()) {
      toast.error('Course name is required.');
      return;
    }
  
    if (!noOfLessons || Number(noOfLessons) <= 0) {
      toast.error('Please enter a valid number of lessons.');
      return;
    }
  
    if (fee === '' || Number(fee) < 0) {
      toast.error('Please enter a valid course fee.');
      return;
    }
  
    if (!courseThumbnail) {
      toast.error('Please upload a course thumbnail!');
      return;
    }
  
    // 🧪 Validate sections: at least one non-empty title
    const validSections = sections.filter((s) => s.title.trim() !== '');
    if (validSections.length === 0) {
      toast.error('Please add at least one valid section title.');
      return;
    }
  
    // ✅ Thumbnail validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const fileType = courseThumbnail.type;
    const fileExtension = courseThumbnail.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  
    if (!allowedTypes.includes(fileType)) {
      toast.error('Thumbnail must be a JPG, PNG, or WEBP image.');
      return;
    }
  
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error('Invalid image format. Allowed: .jpg, .jpeg, .png, .webp');
      return;
    }
  
    const maxSizeMB = 2;
    if (courseThumbnail.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Thumbnail size should be under ${maxSizeMB}MB.`);
      return;
    }
  
    const dbname = Cookies.get('dbname');
    const schoolId = JSON.parse(Cookies.get('schoolData') || '{}')._id;
    if (!dbname || !schoolId) {
      toast.error('School data missing. Please login again.');
      return;
    }
  
    try {
      setIsLoading(true);
      const thumbnailURL = await uploadToCloudinary(courseThumbnail, UPLOAD_PRESET, CLOUD_NAME);
  
      const mappedSections = validSections.map((s) => ({
        sectionName: s.title,
        examRequired: false,
        videos: [],
      }));
  
      const payload = {
        courseName,
        isPreliminaryRequired: isPreliminary,
        courseThumbnail: thumbnailURL,
        noOfLessons: Number(noOfLessons),
        fee: Number(fee),
        sections: mappedSections,
        forum: null,
        schoolId,
      };
  
      await axios.post(`http://course.localhost:5000/api/school/${dbname}/add-course`, payload);
  
      setIsLoading(false);
     navigate(-1)
      Swal.fire({
        icon: 'success',
        title: 'Course Added!',
        text: 'Your course has been successfully added.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
  
      // ✅ Reset form
      setCourseName('');
      setIsPreliminary(false);
      setCourseThumbnail(null);
      setPreviewURL(null);
      setNoOfLessons('');
      setFee('');
      setSections([{ title: '' }]);
    } catch (error) {
      console.error('❌ Submission error:', error);
      setIsLoading(false);
      toast.error('Something went wrong while submitting the course.');
    }
  };
  

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <h2 className="text-2xl font-bold mb-6">📘 Add New Course</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput label="Course Name" id="courseName" value={courseName} onChange={setCourseName} />
          <Checkbox label="Is Preliminary?" id="isPreliminary" checked={isPreliminary} onChange={setIsPreliminary} />
          <ThumbnailUploader
            file={courseThumbnail}
            setFile={setCourseThumbnail}
            previewURL={previewURL}
            setPreviewURL={setPreviewURL}
            setError={(msg) => toast.error(msg)}
          />
          <NumberInput label="Number of Lessons" id="noOfLessons" value={noOfLessons} onChange={setNoOfLessons} min={1} />
          <NumberInput label="Course Fee (₹)" id="courseFee" value={fee} onChange={setFee}  />
          <SectionsList sections={sections} setSections={setSections} />

          <LoadingButton isLoading={isLoading} text="Submit Course" type="submit" />
        </form>
      </div>
    </>
  );
};

export default AddCoursePage;

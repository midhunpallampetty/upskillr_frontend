import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadToCloudinary from './utils/uploadToCloudinary';
import { addCourseToSchool } from './api/course.api';
import Navbar from '../shared/components/Navbar';
import Section from './types/Section';
const ThumbnailUploader = lazy(() => import('./components/ThumbnailUploader'));
const SectionsList = lazy(() => import('./components/SectionsList'));
const TextInput = lazy(() => import('./components/TextInput'));
const NumberInput = lazy(() => import('./components/NumberInput'));
const Checkbox = lazy(() => import('./components/Checkbox'));
const LoadingButton = lazy(() => import('../shared/components/UI/Loader'));

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const AddCoursePage: React.FC = () => {
  const [courseName, setCourseName] = useState('');
  const [isPreliminary, setIsPreliminary] = useState(false);
  const [courseThumbnail, setCourseThumbnail] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [fee, setFee] = useState<number | ''>('');
  const [sections, setSections] = useState<Section[]>([
    {
      title: '',
      sectionName: '',
      examRequired: false,
      _id: '',
      videos: [],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseName.trim()) return toast.error('Course name is required.');
    if (fee === '' || Number(fee) < 0) return toast.error('Please enter a valid course fee.');
    if (!courseThumbnail) return toast.error('Please upload a course thumbnail!');

    const validSections = sections.filter((s) => s.title.trim() !== '');
    if (validSections.length === 0) return toast.error('Please add at least one valid section title.');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const fileType = courseThumbnail.type;
    const fileExtension = courseThumbnail.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

    if (!allowedTypes.includes(fileType)) return toast.error('Thumbnail must be a JPG, PNG, or WEBP image.');
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) return toast.error('Invalid image format.');
    if (courseThumbnail.size > 2 * 1024 * 1024) return toast.error('Thumbnail size should be under 2MB.');

    const dbname = Cookies.get('dbname');
    const schoolId = JSON.parse(Cookies.get('schoolData') || '{}')._id;
    if (!dbname || !schoolId) return toast.error('School data missing. Please login again.');

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
        fee: Number(fee),
        sections: mappedSections,
        forum: null,
        schoolId,
      };

      const result = await addCourseToSchool(dbname, payload);

      if (!result.success) {
        toast.error(result.error || 'Failed to add course');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      navigate(-1);

      Swal.fire({
        icon: 'success',
        title: 'Course Added!',
        text: 'Your course has been successfully added.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });

      // Reset form
      setCourseName('');
      setIsPreliminary(false);
      setCourseThumbnail(null);
      setPreviewURL(null);
      setFee('');
      setSections([
        {
          title: '',
          sectionName: '',
          examRequired: false,
          _id: '',
          videos: [],
        },
      ]);
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

        <Suspense fallback={<p className="text-center text-gray-500">Loading form components...</p>}>
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
         
            <NumberInput label="Course Fee (₹)" id="courseFee" value={fee} onChange={setFee} />
            <SectionsList sections={sections} setSections={setSections} />
            <LoadingButton isLoading={isLoading} text="Submit Course" type="submit" />
          </form>
        </Suspense>

      </div>
    </>
  );
};

export default AddCoursePage;

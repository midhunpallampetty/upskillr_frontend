import React, { useReducer, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadToCloudinary from './utils/uploadToCloudinary';
import { addCourseToSchool } from './api/course.api';
import Navbar from '../shared/components/Navbar';
import {
  courseFormReducer,
  initialCourseFormState,
} from './reducers/courseForm.reducer';
import useSchoolAuthGuard from '../school/hooks/useSchoolAuthGuard';
import { BookOpen, Sparkles } from 'lucide-react';

const ThumbnailUploader = lazy(() => import('./components/ThumbnailUploader'));
const SectionsList = lazy(() => import('./components/SectionsList'));
const TextInput = lazy(() => import('./components/TextInput'));
const NumberInput = lazy(() => import('./components/NumberInput'));
const Checkbox = lazy(() => import('./components/Checkbox'));
const LoadingButton = lazy(() => import('../shared/components/UI/Loader'));

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET || 'demo';

const AddCoursePage: React.FC = () => {
  useSchoolAuthGuard();

  const [state, dispatch] = useReducer(courseFormReducer, initialCourseFormState);
  const navigate = useNavigate();

  const {
    courseName,
    isPreliminary,
    courseThumbnail,
    previewURL,
    fee,
    sections,
    isLoading,
  } = state;

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

    const dbname = Cookies.get('dbname') || 'demo';
    const schoolId = JSON.parse(Cookies.get('schoolData') || '{"_id": "demo"}')._id;
    if (!dbname || !schoolId) return toast.error('School data missing. Please login again.');

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

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
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      navigate(-1);

      Swal.fire({
        icon: 'success',
        title: 'Course Added!',
        text: 'Your course has been successfully added.',
        confirmButtonColor: '#3B82F6',
        confirmButtonText: 'OK',
      });

      dispatch({ type: 'RESET_FORM' });
    } catch (error) {
      console.error('❌ Submission error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error('Something went wrong while submitting the course.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-16"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create New Course
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Design and publish your course to share knowledge with students around the world.
            Fill in the details below to get started.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Course Details</h2>
            </div>
            <p className="text-blue-100 mt-2">
              Provide the essential information about your course
            </p>
          </div>

          <div className="p-8">
            <Suspense 
              fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading form components...</span>
                </div>
              }
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <TextInput
                      label="Course Name"
                      id="courseName"
                      value={courseName}
                      onChange={(val) => dispatch({ type: 'SET_COURSE_NAME', payload: val })}
                      placeholder="e.g., Complete Web Development Bootcamp"
                      required
                    />
                    
                    <NumberInput
                      label="Course Fee"
                      id="courseFee"
                      value={fee}
                      onChange={(val) => dispatch({ type: 'SET_FEE', payload: val })}
                      placeholder="0"
                      required
                    />


                    <Checkbox
                      label="Preliminary Assessment Required"
                      id="isPreliminary"
                      checked={isPreliminary}
                      onChange={(val) => dispatch({ type: 'SET_IS_PRELIMINARY', payload: val })}
                      description="Students must pass a preliminary test before accessing the course content"
                    />
                  </div>

                  <div>
                    <ThumbnailUploader
                      file={courseThumbnail}
                      setFile={(val) => dispatch({ type: 'SET_THUMBNAIL', payload: val })}
                      previewURL={previewURL}
                      setPreviewURL={(val) => dispatch({ type: 'SET_PREVIEW_URL', payload: val })}
                      setError={(msg) => toast.error(msg)}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <SectionsList
                    sections={sections}
                    setSections={(val) => dispatch({ type: 'SET_SECTIONS', payload: val })}
                  />
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <LoadingButton 
                    isLoading={isLoading} 
                    text="Create Course" 
                    type="submit"
                    className=''
                    variant="primary"
                  />
                </div>
              </form>
            </Suspense>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Once created, you can add videos, assignments, and other content to your course sections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;
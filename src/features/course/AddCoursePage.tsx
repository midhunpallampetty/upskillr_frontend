import React, { useReducer, Suspense, lazy, useState } from 'react';
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
import { 
  BookOpen, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Trophy,
  Users,
  Star,
  Zap,
  Upload,
  X,
  Camera,
  Image as ImageIcon,
  Eye,
  Sparkles
} from 'lucide-react';

const SectionsList = lazy(() => import('./components/SectionsList'));
const TextInput = lazy(() => import('./components/TextInput'));
const NumberInput = lazy(() => import('./components/NumberInput'));
const Checkbox = lazy(() => import('./components/Checkbox'));
const LoadingButton = lazy(() => import('../shared/components/UI/Loader'));

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

// Enhanced Error Message Component
const ErrorMessage: React.FC<{ error: string; className?: string }> = ({ error, className = '' }) => {
  if (!error) return null;
  
  return (
    <div className={`flex items-start space-x-2 mt-2 ${className}`}>
      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-red-600 font-medium leading-relaxed">{error}</p>
    </div>
  );
};

// Enhanced Interactive Thumbnail Uploader Component
const InteractiveThumbnailUploader: React.FC<{
  file: File | null;
  setFile: (file: File | null) => void;
  previewURL: string | null;
  setPreviewURL: (url: string | null) => void;
  setError: (error: string) => void;
  error?: string;
}> = ({ file, setFile, previewURL, setPreviewURL, setError, error }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isValidImage, setIsValidImage] = useState(true); // New state to track if file is a valid image type

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    setFile(selectedFile);
    
    // Create preview URL regardless of type for potential display
    const url = URL.createObjectURL(selectedFile);
    setPreviewURL(url);

    // Check if it's a valid image type
    const validType = allowedTypes.includes(selectedFile.type);
    setIsValidImage(validType);

    // Set errors
    let errorMsg = '';
    if (!validType) {
      errorMsg = 'Invalid file type. Please upload a JPG, PNG, or WEBP image.';
    } else if (selectedFile.size > maxSize) {
      errorMsg = 'Image size should be under 2MB.';
    }
    setError(errorMsg);

    // Simulate upload progress for better UX
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);
  };

  const removeImage = () => {
    setFile(null);
    setPreviewURL(null);
    setUploadProgress(0);
    setIsValidImage(true);
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Camera className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Course Thumbnail</h3>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          Optional
        </span>
      </div>

      {!previewURL ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group ${
            isDragOver
              ? 'border-blue-400 bg-blue-50 scale-105'
              : error
              ? 'border-red-300 bg-red-50/30'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => document.getElementById('thumbnail-input')?.click()}
        >
          <input
            type="file"
            id="thumbnail-input"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileSelect(selectedFile);
            }}
            className="hidden"
          />
          
          <div className={`space-y-4 transition-all duration-300 ${isHovering ? 'transform -translate-y-1' : ''}`}>
            <div className={`mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovering ? 'scale-110 shadow-lg' : ''
            }`}>
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {isDragOver ? 'Drop your image here!' : 'Upload Course Thumbnail'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Drag & drop or click to browse
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                <span className="bg-gray-100 px-2 py-1 rounded">JPG</span>
                <span className="bg-gray-100 px-2 py-1 rounded">PNG</span>
                <span className="bg-gray-100 px-2 py-1 rounded">WEBP</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Max 2MB</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {isValidImage ? (
                <img
                  src={previewURL}
                  alt="Course thumbnail preview"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center text-red-600">
                  <AlertCircle className="w-16 h-16 mb-2" />
                  <p className="text-sm font-medium">Invalid image format</p>
                  <p className="text-xs">Please delete and upload a valid image</p>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => window.open(previewURL, '_blank')}
                    className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            {uploadProgress < 100 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Success State */}
            {uploadProgress === 100 && (
              <div className="mt-3 flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Image ready!</span>
              </div>
            )}
          </div>
          
          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{file?.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {file ? Math.round(file.size / 1024) : 0} KB
              </span>
            </div>
          </div>
          
          {/* Replace Button */}
          <button
            type="button"
            onClick={() => document.getElementById('thumbnail-input')?.click()}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Replace Image
          </button>
          
          <input
            type="file"
            id="thumbnail-input"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileSelect(selectedFile);
            }}
            className="hidden"
          />
        </div>
      )}
      
      {/* Error Message */}
      <ErrorMessage error={error || ''} />
    </div>
  );
};

const AddCoursePage: React.FC = () => {
  useSchoolAuthGuard();

  const [state, dispatch] = useReducer(courseFormReducer, {
    ...initialCourseFormState,
    errors: {
      courseName: '',
      fee: '',
      sections: '',
      thumbnail: '',
    },
  });
  const navigate = useNavigate();

  const {
    courseName,
    isPreliminary,
    courseThumbnail,
    previewURL,
    fee,
    sections,
    isLoading,
    errors,
  } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    dispatch({
      type: 'SET_ERRORS',
      payload: { courseName: '', fee: '', sections: '', thumbnail: '' },
    });

    let hasError = false;
    const newErrors = { courseName: '', fee: '', sections: '', thumbnail: '' };

    // Validate course name: alphanumeric with spaces, must contain at least one letter, no special characters
    const alphanumericWithSpaceRegex = /^[a-zA-Z0-9 ]+$/;
    const hasLetterRegex = /[a-zA-Z]/;
    const trimmedCourseName = courseName.trim();
    if (!trimmedCourseName) {
      newErrors.courseName = 'Course name is required.';
      hasError = true;
    } else if (!alphanumericWithSpaceRegex.test(courseName)) {  // Check original for internal spaces
      newErrors.courseName = 'Course name can only contain letters, numbers, and spaces (no special characters).';
      hasError = true;
    } else if (!hasLetterRegex.test(trimmedCourseName)) {
      newErrors.courseName = 'Course name must contain at least one letter and cannot be purely numeric.';
      hasError = true;
    }

    // Validate fee
    if (fee === '' || Number(fee) < 0) {
      newErrors.fee = 'Please enter a valid course fee.';
      hasError = true;
    }

    // Validate sections: each must be alphanumeric with spaces, must contain at least one letter, no special characters
    const validSections = sections
      .map((s) => ({ ...s, title: s.title.trim() }))
      .filter((s) => s.title !== '');
    if (validSections.length === 0) {
      newErrors.sections = 'Please add at least one valid section title.';
      hasError = true;
    } else {
      let sectionError = '';
      sections.forEach((s) => {  // Validate original for internal spaces
        const trimmedTitle = s.title.trim();
        if (trimmedTitle !== '' && (!alphanumericWithSpaceRegex.test(s.title))) {
          sectionError = 'Section names can only contain letters, numbers, and spaces (no special characters).';
        } else if (trimmedTitle !== '' && !hasLetterRegex.test(trimmedTitle)) {
          sectionError = 'Section names must contain at least one letter and cannot be purely numeric.';
        }
      });
      if (sectionError) {
        newErrors.sections = sectionError;
        hasError = true;
      }
    }

    // Validate thumbnail if present
    if (courseThumbnail) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const fileType = courseThumbnail.type;
      const fileExtension = courseThumbnail.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

      if (!allowedTypes.includes(fileType) || !fileExtension || !allowedExtensions.includes(fileExtension)) {
        newErrors.thumbnail = 'Thumbnail must be a valid JPG, PNG, or WEBP image.';
        hasError = true;
      } else if (courseThumbnail.size > 2 * 1024 * 1024) {
        newErrors.thumbnail = 'Thumbnail size should be under 2MB.';
        hasError = true;
      }
    }

    if (hasError) {
      dispatch({
        type: 'SET_ERRORS',
        payload: newErrors,
      });

      // If thumbnail error specifically, show alert
      if (newErrors.thumbnail) {
        await Swal.fire({
          title: 'Invalid Thumbnail',
          text: 'Please delete the current file or choose a correct format (JPG, PNG, or WEBP under 2MB).',
          icon: 'warning',
          confirmButtonColor: '#3B82F6',
          confirmButtonText: 'OK',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
      }

      return;
    }

    // Confirmation alert (only if all validations pass, including thumbnail if present)
    const confirmed = await Swal.fire({
      title: 'Confirm Creation',
      text: 'Do you want to create the course with these details?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (!confirmed.isConfirmed) {
      return;
    }

    const dbname = Cookies.get('dbname') || 'demo';
    const schoolId = JSON.parse(Cookies.get('schoolData') || '{"_id": "demo"}')._id;
    if (!dbname || !schoolId) {
      toast.error('School data missing. Please login again.');
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      let thumbnailURL = 'https://res.cloudinary.com/dgnjzuwqu/image/upload/v1755924721/er6l2gthjwy5y31fbvn8.png';

      if (courseThumbnail) {
        thumbnailURL = await uploadToCloudinary(courseThumbnail, UPLOAD_PRESET, CLOUD_NAME);
      }

      const mappedSections = validSections.map((s) => ({
        sectionName: s.title,
        examRequired: false,
        videos: [],
      }));

      const payload = {
        courseName: courseName,  // Use original with spaces
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
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });

      dispatch({ type: 'RESET_FORM' });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(`Submission error: ${error instanceof Error ? error.message : 'Unknown error occurred. Please try again.'}`);
    }
  };

  const completionPercentage = () => {
    let completed = 0;
    let total = 4;
    
    if (courseName.trim()) completed++;
    if (fee !== '' && Number(fee) >= 0) completed++;
    if (courseThumbnail) completed++;
    if (sections.filter(s => s.title.trim() !== '').length > 0) completed++;
    
    return (completed / total) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
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
        toastClassName="backdrop-blur-sm"
      />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Enhanced Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-6 inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Courses</span>
        </button>

        {/* Enhanced Progress Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span>Course Creation Progress</span>
            </h3>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-600">
                {Math.round(completionPercentage())}% Complete
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${completionPercentage()}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Create New Course
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Design and publish your course to share knowledge with students around the world.
            Fill in the details below to get started on your teaching journey.
          </p>
          
          {/* Enhanced Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: Users, text: 'Unlimited Students', color: 'from-blue-500 to-cyan-500' },
              { icon: Star, text: 'Professional Tools', color: 'from-purple-500 to-pink-500' },
              { icon: Zap, text: 'Quick Setup', color: 'from-green-500 to-teal-500' }
            ].map((item, index) => (
              <div 
                key={index}
                className={`group inline-flex items-center space-x-3 bg-gradient-to-r ${item.color} text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Form Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-8">
            <h2 className="text-3xl font-bold text-white mb-2">Course Details</h2>
            <p className="text-blue-100 text-lg">
              Provide the essential information about your course
            </p>
          </div>

          <div className="p-8">
            <Suspense 
              fallback={
                <div className="flex items-center justify-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-blue-300 opacity-20"></div>
                  </div>
                  <span className="ml-4 text-lg text-gray-600 font-medium">Loading form components...</span>
                </div>
              }
            >
              <form onSubmit={handleSubmit} className="space-y-10" noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    {/* Enhanced Course Name Input */}
                    <div className="relative group">
                      <div className={`relative ${errors.courseName ? 'mb-1' : ''}`}>
                        <TextInput
                          label="Course Name"
                          id="courseName"
                          value={courseName}
                          onChange={(val) => dispatch({ type: 'SET_COURSE_NAME', payload: val })}
                          placeholder="e.g., Complete Web Development Bootcamp"
                        />
                        {courseName.trim() && !errors.courseName && (
                          <div className="absolute top-12 right-3 animate-bounce">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          </div>
                        )}
                      </div>
                      <ErrorMessage error={errors.courseName} />
                    </div>
                    
                    {/* Enhanced Course Fee Input */}
                    <div className="relative group">
                      <div className={`relative ${errors.fee ? 'mb-1' : ''}`}>
                        <NumberInput
                          label="Course Fee"
                          id="courseFee"
                          value={fee}
                          onChange={(val) => dispatch({ type: 'SET_FEE', payload: val })}
                          placeholder="0"
                        />
                        {fee !== '' && Number(fee) >= 0 && !errors.fee && (
                          <div className="absolute top-12 right-3 animate-bounce">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          </div>
                        )}
                      </div>
                      <ErrorMessage error={errors.fee} />
                    </div>

                    {/* Enhanced Checkbox */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 p-6 rounded-xl border border-gray-200 shadow-sm">
                      <Checkbox
                        label="Preliminary Assessment Required"
                        id="isPreliminary"
                        checked={isPreliminary}
                        onChange={(val) => dispatch({ type: 'SET_IS_PRELIMINARY', payload: val })}
                        description="Students must pass a preliminary test before accessing the course content"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 shadow-sm">
                      <InteractiveThumbnailUploader
                        file={courseThumbnail}
                        setFile={(val) => dispatch({ type: 'SET_THUMBNAIL', payload: val })}
                        previewURL={previewURL}
                        setPreviewURL={(val) => dispatch({ type: 'SET_PREVIEW_URL', payload: val })}
                        setError={(msg) => dispatch({ type: 'SET_ERRORS', payload: { ...errors, thumbnail: msg } })}
                        error={errors.thumbnail}
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Sections List */}
                <div className="border-t border-gray-200 pt-10">
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-xl border border-green-200 shadow-sm">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800">Course Sections</h3>
                        <p className="text-gray-600 mt-1">Organize your content into logical sections</p>
                      </div>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                        Required
                      </span>
                    </div>
                    <div className={errors.sections ? 'mb-2' : ''}>
                      <SectionsList
                        sections={sections}
                        setSections={(val) => dispatch({ type: 'SET_SECTIONS', payload: val })}
                      />
                    </div>
                    <ErrorMessage error={errors.sections} className="mt-2" />
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <div className="border-t border-gray-200 pt-10">
                  <div className="flex justify-center">
                    <LoadingButton 
                      isLoading={isLoading} 
                      text="Create Course" 
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-lg"
                      variant="primary"
                    />
                  </div>
                </div>
              </form>
            </Suspense>
          </div>
        </div>

        {/* Enhanced Footer Note */}
        <div className="text-center mt-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 inline-block max-w-2xl">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <p className="text-lg font-semibold text-gray-800">What's Next?</p>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-gray-600 leading-relaxed">
              Once created, you can add videos, assignments, quizzes, and other engaging content to your course sections.
              Start building an amazing learning experience!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;

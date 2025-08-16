import React, { useState, lazy, Suspense } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SectionProps, VideoUploadProgress } from './types/Props';
import { addVideoToSection, uploadVideoToCloudinary } from './api/video.api';
import useSchoolAuthGuard from './hooks/useSchoolAuthGuard';
import { Video, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = lazy(() => import('../shared/components/Navbar'));
const VideoUploader = lazy(() => import('./components/UI/VideoUploader'));
const UploadProgress = lazy(() => import('./components/UI/UploadProgress'));
const FormField = lazy(() => import('./components/UI/FormField'));
const LoadingButton = lazy(() => import('./components/UI/LoadingButton'));

const AddVideoToSection: React.FC<SectionProps> = ({ sectionId, schoolDb }) => {
  useSchoolAuthGuard();
  const navigate = useNavigate();
  
  const [videoName, setVideoName] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<VideoUploadProgress>({
    progress: 0,
    stage: 'preparing',
    message: ''
  });
  const [showProgress, setShowProgress] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!videoName.trim()) {
      newErrors.videoName = 'Video name is required';
    }
    
    if (!videoFile) {
      newErrors.videoFile = 'Please select a video file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);
    setShowProgress(true);

    try {
const videoUrl = await uploadVideoToCloudinary(
  videoFile!,
  (progress: number, stage: VideoUploadProgress['stage'], message: string) => {
    setUploadProgress({
      progress,
      stage,
      message
    });
  }
);


      if (!videoUrl) {
        toast.error('❌ Video upload failed');
        setLoading(false);
        setShowProgress(false);
        return;
      }

      // Add video to section
      setUploadProgress({
        progress: 100,
        stage: 'complete',
        message: 'Adding video to section...'
      });

      await addVideoToSection(schoolDb, sectionId, videoName, videoUrl, description);
      
      // Success animation
      setTimeout(() => {
        setShowProgress(false);
        toast.success('✅ Video added successfully!', {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        });
        
        // Reset form
        setVideoName('');
        setDescription('');
        setVideoFile(null);
        setErrors({});
      }, 1000);

    } catch (err) {
      console.error('❌ Failed to add video:', err);
      toast.error('Error adding video');
      setShowProgress(false);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message: string) => {
    toast.error(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Suspense fallback={
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading navigation...</div>
        </div>
      }>
        <Navbar />
      </Suspense>

      <ToastContainer 
        position="top-right" 
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-16"
      />

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading upload progress...</span>
        </div>
      }>
        <UploadProgress
          progress={uploadProgress.progress}
          stage={uploadProgress.stage}
          message={uploadProgress.message}
          isVisible={showProgress}
        />
      </Suspense>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Video className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Add Video to Section
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload and organize your educational content. Add videos to help students learn effectively.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Video Details</h2>
            </div>
            <p className="text-purple-100 mt-2">
              Provide information about your video content
            </p>
          </div>

          <div className="p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-gray-600">Loading form components...</span>
              </div>
            }>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <FormField 
                      label="Video Title" 
                      required 
                      error={errors.videoName}
                    >
                      <input
                        type="text"
                        value={videoName}
                        onChange={(e) => {
                          setVideoName(e.target.value);
                          if (errors.videoName) {
                            setErrors(prev => ({ ...prev, videoName: '' }));
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                          errors.videoName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Introduction to React Hooks"
                      />
                    </FormField>

                    <FormField label="Description (Optional)">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
                        placeholder="Provide a brief description of what students will learn..."
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField 
                      label="Video File" 
                      required 
                      error={errors.videoFile}
                    >
                      <VideoUploader
                        file={videoFile}
                        setFile={(file) => {
                          setVideoFile(file);
                          if (errors.videoFile) {
                            setErrors(prev => ({ ...prev, videoFile: '' }));
                          }
                        }}
                        setError={handleError}
                      />
                    </FormField>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <LoadingButton 
                    isLoading={loading} 
                    text="Upload Video" 
                    type="submit"
                    variant="primary"
                  />
                </div>
              </form>
            </Suspense>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Supported Formats</h3>
            </div>
            <p className="text-sm text-gray-600">
              MP4, WebM, OGG, AVI, MOV files are supported for optimal compatibility.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">File Size Limit</h3>
            </div>
            <p className="text-sm text-gray-600">
              Maximum file size is 100MB. Larger files may take longer to upload.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Best Practices</h3>
            </div>
            <p className="text-sm text-gray-600">
              Use clear titles and descriptions to help students understand the content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVideoToSection;
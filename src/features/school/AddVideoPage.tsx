import React, { useState, lazy, Suspense } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SectionProps } from './types/Props';
import { addVideoToSection, uploadVideoToCloudinary } from './api/video.api';
import useSchoolAuthGuard from './hooks/useSchoolAuthGuard';
const Navbar = lazy(() => import('../shared/components/Navbar'));
const AddVideoToSection: React.FC<SectionProps> = ({ sectionId, schoolDb }) => {
  useSchoolAuthGuard();
  const [videoName, setVideoName] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoName || !videoFile) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const videoUrl = await uploadVideoToCloudinary(videoFile);
    if (!videoUrl) {
      toast.error('❌ Video upload failed');
      setLoading(false);
      return;
    }

    try {
      await addVideoToSection(schoolDb, sectionId, videoName, videoUrl, description);
      toast.success('✅ Video added successfully');
      setVideoName('');
      setDescription('');
      setVideoFile(null);
    } catch (err) {
      console.error('❌ Failed to add video:', err);
      toast.error('Error adding video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Suspense fallback={<div className="text-center py-2 text-gray-500">Loading Navbar...</div>}>
        <Navbar />
      </Suspense>


      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4 text-center">📹 Add Video to Section</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Video Name *</label>
            <input
              type="text"
              value={videoName}
              onChange={(e) => setVideoName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Enter video title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Video *</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Enter short description"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Uploading...' : 'Add Video'}
          </button>
        </form>
      </div>


      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default AddVideoToSection;

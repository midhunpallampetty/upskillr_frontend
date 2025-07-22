import React, { useState } from 'react';

interface Video {
  _id: string;
  videoName: string;
  description: string;
  url: string;
}

interface VideoModalProps {
  open: boolean;
  currentVideo: Video | null;
  currentVideoIndex: number;
  videoCount: number;
  loadingVideo: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onDelete: any;
}

const VideoModal: React.FC<VideoModalProps> = ({
  open,
  currentVideo,
  currentVideoIndex,
  videoCount,
  loadingVideo,
  onDelete,
  onClose,
  onNext,
  onPrev,
}) => {
  if (!open) return null;
  const [showFullDescription, setShowFullDescription] = useState(false); // new toggle
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-5xl relative max-h-[95vh] overflow-y-auto">
        {/* ❌ Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖️
        </button>

        {loadingVideo ? (
          <p className="text-gray-600 text-center py-20">Loading video...</p>
        ) : currentVideo ? (
          <>
            {/* 🎬 Video Player */}
            <div className="mb-4">
              <video
                key={`${currentVideo._id}-${currentVideoIndex}`}
                src={currentVideo.url}
                controls
                autoPlay
                className="w-full h-64 md:h-96 rounded"
                onError={() => console.error('Video playback error:', currentVideo.url)}
                onEnded={onNext}
              />
            </div>

            {/* 📝 Title + Delete */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">{currentVideo.videoName}</h3>
              <button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm shadow"
              >
                🗑️ Delete Video
              </button>
            </div>

            {/* 📄 Description */}
            <div className="bg-gray-100 p-4 rounded mb-6">
              <h4 className="text-lg font-semibold mb-2">📄 Description</h4>
  <p className="text-gray-700 whitespace-pre-line">
                {currentVideo.description.length <= 200 || showFullDescription
                  ? currentVideo.description
                  : currentVideo.description.slice(0, 200) + '...'}
              </p>
            </div>

            {/* ⏮️⏭️ Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={onPrev}
                disabled={currentVideoIndex === 0}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                ⏮️ Previous
              </button>
              <span className="text-sm text-gray-500">
                Video {currentVideoIndex + 1} of {videoCount}
              </span>
              <button
                onClick={onNext}
                disabled={currentVideoIndex >= videoCount - 1}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                ⏭️ Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-red-600 text-center py-20">⚠️ Video not available</p>
        )}
      </div>
    </div>
  );
};

export default VideoModal;

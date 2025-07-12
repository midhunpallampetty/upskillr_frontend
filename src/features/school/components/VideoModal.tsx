import React from 'react';

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
}

const VideoModal: React.FC<VideoModalProps> = ({
  open,
  currentVideo,
  currentVideoIndex,
  videoCount,
  loadingVideo,
  onClose,
  onNext,
  onPrev,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-5xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖️
        </button>

        {loadingVideo ? (
          <p className="text-gray-600 text-center py-20">Loading video...</p>
        ) : currentVideo ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Video Player */}
            <div className="md:w-2/3 w-full">
              <h3 className="text-xl font-bold mb-2">{currentVideo.videoName}</h3>
              <video
                key={`${currentVideo._id}-${currentVideoIndex}`}
                src={currentVideo.url}
                controls
                autoPlay
                className="w-full h-72 md:h-96 rounded mb-3"
                onError={() => console.error('Video playback error:', currentVideo.url)}
                onEnded={onNext}
              />
            </div>

            {/* Right: Description */}
            <div className="md:w-1/3 w-full">
              <h4 className="text-lg font-semibold mb-2">📄 Description</h4>
              <p className="text-gray-700 whitespace-pre-line">{currentVideo.description}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-600 text-center">⚠️ Video not available</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onPrev}
            disabled={currentVideoIndex === 0}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            ⏮️ Previous
          </button>
          <button
            onClick={onNext}
            disabled={currentVideoIndex >= videoCount - 1}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            ⏭️ Next
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-4 text-center">
          Video {currentVideoIndex + 1} of {videoCount}
        </p>
      </div>
    </div>
  );
};

export default VideoModal;

import React, { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import Swal from 'sweetalert2';
import { Video } from '../../types/Video';
import { updateVideoOrder } from '../../api/course.api';

interface DragVideoOrderModalProps {
  open: boolean;
  onClose: () => void;
  videos: Video[];
  sectionId: string;
  schoolDb: string;
  onOrderUpdated: () => void;
}

const DragVideoOrderModal: React.FC<DragVideoOrderModalProps> = ({
  open,
  onClose,
  videos,
  sectionId,
  schoolDb,
  onOrderUpdated,
}) => {
  const [localVideos, setLocalVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (open) {
      setLocalVideos(videos ? [...videos] : []);
    } else {
      setLocalVideos([]);
    }
  }, [open, videos]);

  const handleSaveOrder = async () => {
    try {
      const items = localVideos.map((video, index) => ({
        _id: video._id,
        order: index + 1,
      }));

      await updateVideoOrder(schoolDb, sectionId, items);

      Swal.fire({
        title: 'Success',
        text: 'Video order updated successfully.',
        icon: 'success',
        confirmButtonColor: '#10b981',
      });

      onOrderUpdated();
      onClose();
    } catch (err: any) {
      Swal.fire({
        title: 'Error',
        text: err?.message || 'Failed to update video order.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl p-8 w-[500px] max-h-[85vh] overflow-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Reorder Videos</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            &#10005;
          </button>
        </div>

<ReactSortable
  list={localVideos}
  setList={setLocalVideos}
  animation={250}
  easing="cubic-bezier(0.25, 1, 0.5, 1)"
  delay={5}
  delayOnTouchOnly={true}
  tag="ul"
  className="space-y-3"
  ghostClass="opacity-50"
>
  {localVideos.length === 0 ? (
    <li className="text-gray-500 text-center p-4 bg-gray-100 rounded-xl">
      No videos available to reorder.
    </li>
  ) : (
    localVideos.map((video) => (
      <li
        key={video._id}
        data-id={video._id}
        className="flex items-center p-4 rounded-xl bg-gray-100 cursor-grab hover:bg-gray-200 shadow-sm select-none"
      >
        <svg
          className="w-6 h-6 mr-4 text-gray-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
        <span className="text-gray-700 font-medium">
          {video.videoName || video.title || 'Untitled Video'}
        </span>
      </li>
    ))
  )}
</ReactSortable>


        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveOrder}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default DragVideoOrderModal;

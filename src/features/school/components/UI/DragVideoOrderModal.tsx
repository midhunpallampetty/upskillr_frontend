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
      // Defensive copy of videos array to avoid external mutations
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Reorder Videos</h2>

        <ReactSortable
          list={localVideos}
          setList={setLocalVideos}
          animation={150}
          tag="ul"
        >
          {localVideos.map((video) => (
            <li
              key={video._id}
              data-id={video._id}
              className="p-3 mb-2 bg-gray-100 rounded cursor-move flex items-center"
            >
              <svg
                className="w-5 h-5 mr-3 text-gray-600"
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
              {video.videoName || video.title || 'Untitled Video'}
            </li>
          ))}
        </ReactSortable>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveOrder}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default DragVideoOrderModal;

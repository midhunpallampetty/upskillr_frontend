import React, { useState, useEffect } from 'react';
import { GripVertical, X, Save } from 'lucide-react';

interface Video {
  _id: string;
  videoName?: string;
  title?: string;
  order?: number;
}

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
  onOrderUpdated,
}) => {
  const [localVideos, setLocalVideos] = useState<Video[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setLocalVideos(videos ? [...videos] : []);
    } else {
      setLocalVideos([]);
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  }, [open, videos]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newVideos = [...localVideos];
    const [draggedVideo] = newVideos.splice(draggedIndex, 1);
    newVideos.splice(dropIndex, 0, draggedVideo);

    setLocalVideos(newVideos);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    try {
      onOrderUpdated();
      onClose();
    } catch (err: any) {
      console.error('Failed to update video order:', err);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Reorder Videos</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop videos to change their order
          </p>

          <div className="space-y-2">
            {localVideos.map((video, index) => (
              <div
                key={video._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  group relative flex items-center gap-3 p-4 rounded-xl border-2
                  transition-all duration-200 cursor-move
                  ${
                    draggedIndex === index
                      ? 'opacity-50 scale-95 border-blue-400 bg-blue-50'
                      : dragOverIndex === index
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-semibold text-sm">
                  {index + 1}
                </div>

                <GripVertical
                  className={`w-5 h-5 transition-colors ${
                    draggedIndex === index
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">
                    {video.videoName || video.title || 'Untitled Video'}
                  </p>
                </div>

                <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none group-hover:border-gray-300 transition-colors" />
              </div>
            ))}
          </div>

          {localVideos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No videos available
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveOrder}
            disabled={localVideos.length === 0}
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default DragVideoOrderModal;
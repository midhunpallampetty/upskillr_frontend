import React, { useRef, useState } from 'react';
import { Upload, X, Video, Play, FileVideo } from 'lucide-react';

interface VideoUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setError: (message: string) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  file,
  setFile,
  setError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewURL, setPreviewURL] = useState<string>('');

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please select a valid video file (MP4, WebM, OGG, AVI, MOV).');
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
      setError('Video size should be under 100MB.');
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewURL(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewURL('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Upload Video
        <span className="text-red-500 ml-1">*</span>
      </label>

      {file ? (
        <div className="relative group">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileVideo className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {file.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(file.size)}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Video className="w-3 h-3 mr-1" />
                    Video Ready
                  </span>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${isDragOver
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 bg-gray-50'
            }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,.avi,.mov"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />


          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full transition-all duration-300 ${isDragOver ? 'bg-blue-100 scale-110' : 'bg-gray-100'
                }`}>
                {isDragOver ? (
                  <Upload className="w-10 h-10 text-blue-500" />
                ) : (
                  <Video className="w-10 h-10 text-gray-400" />
                )}
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragOver ? 'Drop your video here' : 'Upload video file'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400 mt-2">
                MP4, WebM, OGG, AVI, MOV • Max 100MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
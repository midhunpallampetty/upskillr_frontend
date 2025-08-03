// components/ui/ImageUpload.tsx
import React from 'react';
import { Camera, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  isDarkMode: boolean;
  isUploading: boolean;
  onUpload: (file: File | null) => void;
  label: string;
  isProfile?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ isDarkMode, isUploading, onUpload, label, isProfile = false }) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/40 ${isProfile ? 'rounded-2xl' : ''}`}>
      <label className={`cursor-pointer ${isProfile ? '' : 'bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-200'}`}>
        <div className={`flex ${isProfile ? 'items-center' : 'flex-col items-center space-y-2'} text-white`}>
          {isUploading ? (
            <Loader2 className={`w-${isProfile ? '6' : '8'} h-${isProfile ? '6' : '8'} animate-spin`} />
          ) : (
            <Camera className={`w-${isProfile ? '6' : '8'} h-${isProfile ? '6' : '8'}`} />
          )}
          {!isProfile && <span className="text-sm font-medium">{isUploading ? 'Uploading...' : label}</span>}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onUpload(e.target.files?.[0] || null)}
          className="hidden"
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
import { useState } from "react";
import { ImageModal } from "./ImageModal";
import { Asset } from "../../types/ImportsAndTypes";

export const AssetGallery = ({ assets, size = 'sm' }: { assets?: Asset[], size?: 'sm' | 'md' | 'lg' }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  if (!assets?.length) return null;

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {assets.map(asset => (
          <div
            key={asset._id}
            className={`${sizeClasses[size]} group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50 cursor-pointer hover:border-blue-400 transition-all duration-200`}
            onClick={() => setSelectedImage(asset.imageUrl)}
          >
            <img
              src={asset.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  );
};

import { XMarkIcon } from "@heroicons/react/24/outline";

export const ImageModal = ({ src, onClose }: { src: string; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
    <div className="relative max-h-[90vh] max-w-[90vw]">
      <img src={src} alt="Full size" className="h-auto w-auto max-h-full max-w-full rounded-lg" />
      <button
        onClick={onClose}
        className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
      >
        <XMarkIcon className="h-8 w-8" />
      </button>
    </div>
  </div>
);

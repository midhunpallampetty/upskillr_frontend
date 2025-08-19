import { PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

export const ResponseForm = ({
  onSubmit,
  placeholder = 'Type your response...',
  disabled = false,
  socket,
  threadId,
  userName,
}: {
  onSubmit: (t: string, imgs: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  socket: any;
  threadId: string;
  userName: string;
}) => {
  const [text, setText] = useState('');
  const [imgs, setImgs] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setImgs(prev => [...prev, data.secure_url]);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('typing', { threadId, userName });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket) {
        socket.emit('stop_typing', { threadId, userName });
      }
    }, 2000);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text, imgs);
    setText('');
    setImgs([]);
    setShowImageUpload(false);
    if (isTyping && socket) {
      setIsTyping(false);
      socket.emit('stop_typing', { threadId, userName });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {imgs.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {imgs.map((url, i) => (
            <div key={i} className="group relative">
              <img src={url} className="h-12 w-12 rounded-lg object-cover" alt="" />
              <button
                onClick={() => setImgs(prev => prev.filter((_, idx) => idx !== i))}
                className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyPress}
            placeholder={`${placeholder} (Ctrl+Enter to send)`}
            disabled={disabled}
            className="w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 p-3 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            rows={2}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImageUpload(!showImageUpload)}
            disabled={disabled}
            className="rounded-xl border-2 border-gray-200 p-3 text-gray-600 transition-all hover:border-blue-400 hover:text-blue-600 disabled:opacity-50"
          >
            <PaperClipIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading || disabled || !text.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {showImageUpload && (
        <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading || disabled}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 p-3 transition-all hover:border-blue-400"
          />
        </div>
      )}
    </div>
  );
};

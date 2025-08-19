import { ChatBubbleLeftIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStudentAuthGuard from "../../../student/hooks/useStudentAuthGuard";

export const QuestionForm = ({ onSubmit }: { onSubmit: (q: string, imgs: string[], category: string) => void }) => {
  useStudentAuthGuard();
  const [question, setQuestion] = useState('');
  const [imgs, setImgs] = useState<string[]>([]);
  const [category, setCategory] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
  const categories = [
    { value: 'general', label: '🔍 General', color: 'bg-gray-500' },
    { value: 'math', label: '🔢 Mathematics', color: 'bg-blue-500' },
    { value: 'science', label: '🧪 Science', color: 'bg-green-500' },
    { value: 'history', label: '📚 History', color: 'bg-yellow-500' },
    { value: 'other', label: '🎯 Other', color: 'bg-purple-500' }
  ];

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

  const removeImage = (index: number) => {
    setImgs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!question.trim()) return;
    onSubmit(question, imgs, category);
    setQuestion('');
    setImgs([]);
    setCategory('general');
    setIsExpanded(false);
  };

  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <div className="space-y-4">
        <button className="text-black" onClick={() => navigate('/studenthome')}>Back</button>
        <div className="flex items-center gap-3">
          <ChatBubbleLeftIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Ask a Question</h2>
        </div>
        <div className="relative">
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="What would you like to know? Share your question here..."
            className="w-full resize-none rounded-xl border-2 border-gray-200 bg-white p-4 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            rows={isExpanded ? 4 : 2}
          />
        </div>
        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white p-3 text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Images</label>
                <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3 transition-all hover:border-blue-400 hover:bg-blue-50">
                  <PhotoIcon className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {imgs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {imgs.map((url, i) => (
                  <div key={i} className="group relative">
                    <img src={url} className="h-16 w-16 rounded-lg object-cover" alt="" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={uploading || !question.trim()}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Post Question'}
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="rounded-xl border-2 border-gray-300 px-4 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

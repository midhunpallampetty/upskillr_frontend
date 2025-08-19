import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { 
  PaperClipIcon, 
  PaperAirplaneIcon, 
  TrashIcon, 
  ChatBubbleLeftIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  PhotoIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useStudentAuthGuard from '../student/hooks/useStudentAuthGuard';

// --- Data Types ---
type User = { _id: string; fullName: string; role: 'Student' | 'School' };
type Asset = { _id: string; imageUrl: string };
type Reply = {
  _id: string;
  forum_answer_id?: string;
  forum_question_id?: string;
  text: string;
  author: User;
  assets?: Asset[];
  parent_reply_id?: string;
  replies?: Reply[];
  createdAt: string;
};
type Answer = {
  _id: string;
  forum_question_id: string;
  text: string;
  author: User;
  assets?: Asset[];
  replies?: Reply[];
  createdAt: string;
};
type Question = {
  _id: string;
  question: string;
  author: User;
  assets?: Asset[];
  answers?: Answer[];
  replies?: Reply[];
  isDeleted: boolean;
  category: string;
  createdAt: string;
};

type Toast = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

// --- Toast Component ---
const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`max-w-sm rounded-xl p-4 shadow-2xl transform transition-all duration-500 ease-out backdrop-blur-sm border ${
            toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
            toast.type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' :
            toast.type === 'warning' ? 'bg-amber-500/90 border-amber-400 text-white' :
            'bg-blue-500/90 border-blue-400 text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Image Modal Component ---
const ImageModal = ({ src, onClose }: { src: string; onClose: () => void }) => (
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

// --- Enhanced Asset Gallery ---
const AssetGallery = ({ assets, size = 'sm' }: { assets?: Asset[], size?: 'sm' | 'md' | 'lg' }) => {
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

// --- Enhanced Question Form ---
const QuestionForm = ({ onSubmit }: { onSubmit: (q: string, imgs: string[], category: string) => void }) => {
  useStudentAuthGuard()
  const [question, setQuestion] = useState('');
  const [imgs, setImgs] = useState<string[]>([]);
  const [category, setCategory] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate=useNavigate()
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
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
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
                  <button className='text-balck' onClick={(()=>navigate('/studenthome'))}>Back</button>

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

// --- Enhanced Response Form ---
const ResponseForm = ({
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
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
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

// --- Enhanced Message Component (with safe author handling) ---
const Message = ({
  author,
  text,
  assets,
  role,
  createdAt,
  isQuestion = false,
  onReply,
  socket,
  threadId,
  userName,
  onDelete,
  currentUserId,
  itemId,
}: {
  author: string | any; // Accept both string and object
  text: string;
  assets?: Asset[];
  role: string;
  createdAt: string;
  isQuestion?: boolean;
  onReply?: (text: string, imgs: string[]) => void;
  socket?: any;
  threadId?: string;
  userName?: string;
  onDelete?: (id: string) => void;
  currentUserId: string;
  itemId: string;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isOwnMessage = currentUserId === itemId;

  // **SAFE AUTHOR HANDLING** - Works with any author format
  const getAuthorName = (author: any): string => {
    if (!author) return 'Unknown User';
    if (typeof author === 'string') return author;
    if (typeof author === 'object') {
      return author.fullName || author.name || author._id || 'Unknown User';
    }
    return String(author);
  };

  const getAuthorInitial = (author: any): string => {
    const name = getAuthorName(author);
    return name.charAt(0).toUpperCase();
  };

  const getAuthorRole = (role: any): string => {
    if (!role || typeof role !== 'string') return 'User';
    return role;
  };

  const getRoleColor = (role: string) => {
    return role === 'Student' ? 'text-blue-600' : 'text-emerald-600';
  };

  const getRoleBadge = (role: string) => {
    return role === 'Student' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-emerald-100 text-emerald-800';
  };

  const authorName = getAuthorName(author);
  const authorRole = getAuthorRole(role);

  return (
    <div className={`group mb-6 rounded-2xl p-5 transition-all ${
      isQuestion 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200' 
        : 'bg-white border border-gray-200 hover:shadow-lg'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
            {getAuthorInitial(author)}
          </div>
          <div>
            <div className={`font-semibold ${getRoleColor(authorRole)}`}>
              {authorName}
            </div>
            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getRoleBadge(authorRole)}`}>
              {authorRole}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {(onReply || (isOwnMessage && onDelete)) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-full p-1 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 z-10 w-32 rounded-xl bg-white border border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
                  {onReply && (
                    <button
                      onClick={() => {
                        setShowReplyForm(!showReplyForm);
                        setShowMenu(false);
                      }}
                      className="w-full rounded-t-xl px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Reply
                    </button>
                  )}
                  {isOwnMessage && onDelete && (
                    <button
                      onClick={() => {
                        onDelete(itemId);
                        setShowMenu(false);
                      }}
                      className="w-full rounded-b-xl px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-gray-800 leading-relaxed">{text}</div>
      <AssetGallery assets={assets} size="md" />
      
      {showReplyForm && onReply && socket && threadId && userName && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
          <ResponseForm
            onSubmit={onReply}
            placeholder="Type your reply..."
            socket={socket}
            threadId={threadId}
            userName={userName}
          />
        </div>
      )}
    </div>
  );
};

// --- Enhanced Question List Item ---
const QuestionListItem = ({ 
  question, 
  isSelected, 
  onClick, 
  onDelete, 
  canDelete 
}: { 
  question: Question; 
  isSelected: boolean; 
  onClick: () => void; 
  onDelete: () => void; 
  canDelete: boolean; 
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-gray-500',
      math: 'bg-blue-500',
      science: 'bg-green-500',
      history: 'bg-yellow-500',
      other: 'bg-purple-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getAnswerCount = () => {
    const answerCount = question.answers?.length || 0;
    const replyCount = (question.replies?.length || 0) + 
      (question.answers?.reduce((acc, ans) => acc + (ans.replies?.length || 0), 0) || 0);
    return answerCount + replyCount;
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer border-b border-gray-100 p-4 transition-all hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-2 w-2 rounded-full ${getCategoryColor(question.category)}`} />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {question.category}
            </span>
            {getAnswerCount() > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {getAnswerCount()} {getAnswerCount() === 1 ? 'response' : 'responses'}
              </span>
            )}
          </div>
          
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {question.question}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserCircleIcon className="h-4 w-4" />
            <span>{question.author?.fullName}</span>
            <span>•</span>
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="ml-2 rounded-full p-1 text-gray-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <AssetGallery assets={question.assets} size="sm" />
    </div>
  );
};

// --- Enhanced Recursive Reply Renderer (with safe author access) ---
const ReplyRenderer = ({
  replies,
  onReplySubmit,
  onDeleteReply,
  socket,
  threadId,
  userName,
  currentUserId,
  questionId,
  answerId,
  depth = 0
}: {
  replies?: Reply[];
  onReplySubmit: (text: string, imgs: string[], parentReplyId?: string, forum_question_id?: string, forum_answer_id?: string) => void;
  onDeleteReply: (replyId: string, questionId: string, answerId?: string) => void;
  socket?: any;
  threadId?: string;
  userName?: string;
  currentUserId: string;
  questionId: string;
  answerId?: string;
  depth?: number;
}) => {
  if (!replies?.length) return null;
  
  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-6' : ''} space-y-4`}>
      {replies.map(reply => (
        <div key={reply._id}>
          <Message
            author={reply.author || 'Unknown User'} // **Safe fallback**
            text={reply.text}
            assets={reply.assets}
            role={(reply.author?.role) || 'User'} // **Safe role access**
            createdAt={reply.createdAt}
            onReply={(text, imgs) => onReplySubmit(text, imgs, reply._id, questionId, answerId)}
            onDelete={() => onDeleteReply(reply._id, questionId, answerId)}
            currentUserId={currentUserId}
            itemId={reply.author?._id || reply._id} // **Safe ID access**
            socket={socket}
            threadId={threadId}
            userName={userName}
          />
          <ReplyRenderer
            replies={reply.replies}
            onReplySubmit={onReplySubmit}
            onDeleteReply={onDeleteReply}
            socket={socket}
            threadId={threadId}
            userName={userName}
            currentUserId={currentUserId}
            questionId={questionId}
            answerId={answerId}
            depth={depth + 1}
          />
        </div>
      ))}
    </div>
  );
};

const API = 'http://localhost:5000/api';

// --- Main Enhanced Component ---
export default function ForumChatUI() {
  const studentData = JSON.parse(localStorage.getItem('student') || '{}');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user] = useState<User>({
    _id: studentData._id || 'id1',
    fullName: studentData.fullName || 'TestUser',
    role: 'Student',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toast management functions
  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Auto-scroll function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Filter questions based on search and category
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.author.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return !q.isDeleted && matchesSearch && matchesCategory;
  });

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [selected?.answers, selected?.replies, scrollToBottom]);

  useEffect(() => {
    // Fetch initial questions
    setLoading(true);
    axios.get(`${API}/forum/questions`)
      .then(res => {
        setQuestions(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('Failed to fetch questions:', err);
        addToast('Failed to load questions. Please try again.', 'error');
      })
      .finally(() => setLoading(false));

    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      addToast('Connected to real-time updates', 'success');
    });

    // Handle new questions
    socketRef.current.on('new_question', (qDoc: Question) => {
        const authorName = qDoc.author?.fullName || qDoc.author || 'Unknown User';
  const authorId = qDoc.author?._id || qDoc.author;
      setQuestions(prevQuestions => [qDoc, ...prevQuestions]);
      if (String(qDoc.author._id) !== String(user._id)) {
        addToast(`${qDoc.author.fullName} asked a new question`, 'info');
      }
    });

    // Handle new answers
    socketRef.current.on('new_answer', (aDoc: Answer) => {
      setQuestions(prevQuestions =>
        prevQuestions.map(q => q._id === aDoc.forum_question_id
          ? { ...q, answers: [...(q.answers || []), aDoc] }
          : q
        )
      );

      setSelected(prevSelected => {
        if (prevSelected && prevSelected._id === aDoc.forum_question_id) {
          const answerAuthorId = String(aDoc.author._id);
          const currentUserId = String(user._id);
          
          if (answerAuthorId !== currentUserId) {
            addToast(`someone responded to the question`, 'success');
          }
          return { ...prevSelected, answers: [...(prevSelected.answers || []), aDoc] };
        }
        return prevSelected;
      });
    });

    // Handle new replies
    socketRef.current.on('new_reply', (rDoc: Reply) => {
      const updateNestedReplies = (replies: Reply[], newReply: Reply): Reply[] => {
        if (!newReply.parent_reply_id) {
          return [...replies, { ...newReply, replies: [] }];
        }
        return replies.map(r => {
          if (r._id === newReply.parent_reply_id) {
            return { ...r, replies: [...(r.replies || []), { ...newReply, replies: [] }] };
          }
          if (r.replies) {
            return { ...r, replies: updateNestedReplies(r.replies, newReply) };
          }
          return r;
        });
      };

      setQuestions(prevQuestions =>
        prevQuestions.map(q => {
          if (rDoc.forum_question_id === q._id && !rDoc.forum_answer_id) {
            return { ...q, replies: updateNestedReplies(q.replies || [], rDoc) };
          }
          return {
            ...q,
            answers: q.answers?.map(a =>
              a._id === rDoc.forum_answer_id
                ? { ...a, replies: updateNestedReplies(a.replies || [], rDoc) }
                : a
            ) || []
          };
        })
      );

      setSelected(prevSelected => {
        if (!prevSelected || prevSelected._id !== rDoc.forum_question_id) return prevSelected;

        const replyAuthorId = String(rDoc.author._id);
        const currentUserId = String(user._id);
        
        if (replyAuthorId !== currentUserId) {
          addToast(`${rDoc.author.fullName} replied to a message`, 'info');
        }

        if (!rDoc.forum_answer_id) {
          return { ...prevSelected, replies: updateNestedReplies(prevSelected.replies || [], rDoc) };
        }

        return {
          ...prevSelected,
          answers: prevSelected.answers?.map(a =>
            a._id === rDoc.forum_answer_id
              ? { ...a, replies: updateNestedReplies(a.replies || [], rDoc) }
              : a
          ) || []
        };
      });
    });

    // Handle typing events
    socketRef.current.on('typing', ({ threadId, userName }: { threadId: string; userName: string }) => {
      setSelected(prevSelected => {
        if (prevSelected && prevSelected._id === threadId && userName !== user.fullName) {
          setTypingUsers(prevUsers =>
            prevUsers.includes(userName) ? prevUsers : [...prevUsers, userName]
          );
        }
        return prevSelected;
      });
    });

    socketRef.current.on('stop_typing', ({ threadId, userName }: { threadId: string; userName: string }) => {
      setSelected(prevSelected => {
        if (prevSelected && prevSelected._id === threadId) {
          setTypingUsers(prevUsers => prevUsers.filter(name => name !== userName));
        }
        return prevSelected;
      });
    });

    // Handle deletions
    socketRef.current.on('question_deleted', ({ id }: { id: string }) => {
      setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== id));
      setSelected(prevSelected => prevSelected?._id === id ? null : prevSelected);
      addToast('Question deleted', 'info');
    });

    socketRef.current.on('answer_deleted', ({ id, questionId }: { id: string; questionId: string }) => {
      setQuestions(prevQuestions =>
        prevQuestions.map(q => q._id === questionId
          ? { ...q, answers: q.answers?.filter(a => a._id !== id) || [] }
          : q
        )
      );
      setSelected(prevSelected => {
        if (prevSelected?._id === questionId) {
          return { ...prevSelected, answers: prevSelected.answers?.filter(a => a._id !== id) || [] };
        }
        return prevSelected;
      });
    });

    socketRef.current.on('reply_deleted', ({ id, questionId, answerId }: { id: string; questionId: string; answerId?: string }) => {
      const removeNestedReply = (replies: Reply[]): Reply[] => {
        return replies.reduce((acc, r) => {
          if (r._id === id) return acc;
          return [...acc, { ...r, replies: removeNestedReply(r.replies || []) }];
        }, [] as Reply[]);
      };

      setQuestions(prevQuestions =>
        prevQuestions.map(q => {
          if (q._id === questionId) {
            if (answerId) {
              return {
                ...q,
                answers: q.answers?.map(a => a._id === answerId ? { ...a, replies: removeNestedReply(a.replies || []) } : a) || []
              };
            } else {
              return { ...q, replies: removeNestedReply(q.replies || []) };
            }
          }
          return q;
        })
      );

      setSelected(prevSelected => {
        if (prevSelected?._id === questionId) {
          if (answerId) {
            return {
              ...prevSelected,
              answers: prevSelected.answers?.map(a => a._id === answerId ? { ...a, replies: removeNestedReply(a.replies || []) } : a) || []
            };
          } else {
            return { ...prevSelected, replies: removeNestedReply(prevSelected.replies || []) };
          }
        }
        return prevSelected;
      });
    });

    socketRef.current.on('connect_error', (err: any) => {
      console.error('Socket connection error:', err);
      addToast('Failed to connect to real-time updates. Please refresh.', 'error');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user.fullName, user._id, addToast]);

  // Clear typing users and join thread when switching questions
  useEffect(() => {
    setTypingUsers([]);
    if (selected?._id && socketRef.current) {
      socketRef.current.emit('join_thread', selected._id);
    }
  }, [selected]);

  const selectQuestion = (qid: string) => {
    if (selected?._id === qid) return;
    
    setLoading(true);
    axios.get(`${API}/forum/questions/${qid}`)
      .then(res => {
        if (!res.data || !res.data._id) {
          throw new Error('Invalid question data');
        }
        setSelected(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch question:', err);
        addToast(`Failed to load question: ${err.message}. Please try again.`, 'error');
      })
      .finally(() => setLoading(false));
  };

  const deleteQuestion = (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    axios.delete(`${API}/forum/questions/${questionId}`)
      .then(() => {
        if (socketRef.current) {
          socketRef.current.emit('delete_question', questionId);
        }
      })
      .catch(err => {
        console.error('Failed to delete question:', err);
        addToast('Failed to delete question. Please try again.', 'error');
      });
  };

  const deleteAnswer = (answerId: string, questionId: string) => {
    if (!confirm('Are you sure you want to delete this answer?')) return;
    
    axios.delete(`${API}/forum/answers/${answerId}`)
      .then(() => {
        if (socketRef.current) {
          socketRef.current.emit('delete_answer', { answerId, questionId });
        }
      })
      .catch(err => {
        console.error('Failed to delete answer:', err);
        addToast('Failed to delete answer. Please try again.', 'error');
      });
  };

  const deleteReply = (replyId: string, questionId: string, answerId?: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    
    axios.delete(`${API}/forum/replies/${replyId}`)
      .then(() => {
        if (socketRef.current) {
          socketRef.current.emit('delete_reply', { replyId, questionId, answerId });
        }
      })
      .catch(err => {
        console.error('Failed to delete reply:', err);
        addToast('Failed to delete reply. Please try again.', 'error');
      });
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: '🔍 General' },
    { value: 'math', label: '🔢 Mathematics' },
    { value: 'science', label: '🧪 Science' },
    { value: 'history', label: '📚 History' },
    { value: 'other', label: '🎯 Other' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Left Sidebar: Enhanced Question Form + List */}
      <div className="w-96 flex flex-col bg-white shadow-xl border-r border-gray-200">
        <QuestionForm
          onSubmit={(text, imgs, category) =>
            axios.post(`${API}/forum/questions`, {
              question: text,
              author: user._id,
              category,
              authorType: user.role,
              imageUrls: imgs
            })
              .then(() => {
                addToast('Question posted successfully!', 'success');
              })
              .catch(err => {
                console.error('Failed to post question:', err);
                addToast('Failed to post question. Please try again.', 'error');
              })
          }
        />
        {/* Search and Filter Section */}
        <div className="border-b border-gray-200 p-4 space-y-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'No questions match your search.' 
                  : 'No questions available yet.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredQuestions.map(q => (
                <QuestionListItem
                  key={q._id}
                  question={q}
                  isSelected={selected?._id === q._id}
                  onClick={() => selectQuestion(q._id)}
                  onDelete={() => deleteQuestion(q._id)}
                  canDelete={q.author._id === user._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Main: Enhanced Selected Question Chat */}
      <div className="flex flex-1 flex-col">
        {selected ? (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {selected.question}
                  </h1>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <UserCircleIcon className="h-4 w-4" />
                      {selected.author.fullName} ({selected.author.role})
                    </span>
                    <span>•</span>
                    <span>Category: {selected.category}</span>
                    <span>•</span>
                    <span>{new Date(selected.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Original Question */}
                <Message
                  author={selected.author.fullName}
                  text={selected.question}
                  assets={selected.assets}
                  role={selected.author.role}
                  createdAt={selected.createdAt}
                  isQuestion={true}
                  socket={socketRef.current}
                  threadId={selected._id}
                  userName={user.fullName}
                  onDelete={() => deleteQuestion(selected._id)}
                  currentUserId={user._id}
                  itemId={selected.author._id}
                />
                {/* Question Replies */}
                <ReplyRenderer
                  replies={selected.replies}
                  onReplySubmit={(text, imgs, parentReplyId, forum_question_id, forum_answer_id) =>
                    axios.post(`${API}/forum/replies`, {
                      forum_question_id: forum_question_id || selected._id,
                      forum_answer_id: forum_answer_id,
                      text,
                      author: user._id,
                      authorType: user.role,
                      imageUrls: imgs,
                      parent_reply_id: parentReplyId
                    }).catch(err => {
                      console.error('Failed to post reply:', err);
                      addToast('Failed to post reply. Please try again.', 'error');
                    })
                  }
                  onDeleteReply={deleteReply}
                  socket={socketRef.current}
                  threadId={selected._id}
                  userName={user.fullName}
                  currentUserId={user._id}
                  questionId={selected._id}
                />

                {/* Answers */}
                {(selected.answers || []).map(ans => (
                  <div key={ans._id}>
                    <Message
                      author={ans.author.fullName}
                      text={ans.text}
                      assets={ans.assets}
                      role={ans.author.role}
                      createdAt={ans.createdAt}
                      onReply={(text, imgs) =>
                        axios.post(`${API}/forum/replies`, {
                          forum_question_id: selected._id,
                          forum_answer_id: ans._id,
                          text,
                          author: user._id,
                          authorType: user.role,
                          imageUrls: imgs
                        }).catch(err => {
                          console.error('Failed to post reply:', err);
                          addToast('Failed to post reply. Please try again.', 'error');
                        })
                      }
                      onDelete={() => deleteAnswer(ans._id, selected._id)}
                      currentUserId={user._id}
                      itemId={ans.author._id}
                      socket={socketRef.current}
                      threadId={selected._id}
                      userName={user.fullName}
                    />
                    <ReplyRenderer
                      replies={ans.replies}
                      onReplySubmit={(text, imgs, parentReplyId, forum_question_id, forum_answer_id) =>
                        axios.post(`${API}/forum/replies`, {
                          forum_question_id: forum_question_id || selected._id,
                          forum_answer_id: forum_answer_id || ans._id,
                          text,
                          author: user._id,
                          authorType: user.role,
                          imageUrls: imgs,
                          parent_reply_id: parentReplyId
                        }).catch(err => {
                          console.error('Failed to post reply:', err);
                          addToast('Failed to post reply. Please try again.', 'error');
                        })
                      }
                      onDeleteReply={deleteReply}
                      socket={socketRef.current}
                      threadId={selected._id}
                      userName={user.fullName}
                      currentUserId={user._id}
                      questionId={selected._id}
                      answerId={ans._id}
                    />
                  </div>
                ))}

                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="border-t border-gray-200 bg-blue-50 px-6 py-3">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span>
                    {typingUsers.length === 1
                      ? `${typingUsers[0]} is typing...`
                      : `${typingUsers.join(' and ')} are typing...`}
                  </span>
                </div>
              </div>
            )}

            {/* Response Form */}
            <ResponseForm
              onSubmit={(text, imgs) =>
                axios.post(`${API}/forum/answers`, {
                  forum_question_id: selected._id,
                  text,
                  author: user._id,
                  authorType: user.role,
                  imageUrls: imgs
                }).then(() => {
                  addToast('Answer posted successfully!', 'success');
                }).catch(err => {
                  console.error('Failed to post answer:', err);
                  addToast('Failed to post answer. Please try again.', 'error');
                })
              }
              placeholder="Share your answer or thoughts..."
              socket={socketRef.current}
              threadId={selected._id}
              userName={user.fullName}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <ChatBubbleLeftIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Question
              </h3>
              <p className="text-gray-500">
                Choose a question from the sidebar to view and participate in the discussion
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

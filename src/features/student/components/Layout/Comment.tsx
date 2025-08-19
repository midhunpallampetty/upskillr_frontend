import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

type CommentType = {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    image?: string | null;
  };
  content: string;
  createdAt: string;
  replies?: CommentType[];
};

const DEFAULT_USER_IMAGE =
  'https://ui-avatars.com/api/?name=User&background=random&size=64';

const COMMENTS_PAGE_SIZE = 5;

// Reusable Emoji Picker component
const EmojiPicker = ({
  onEmojiClick,
}: {
  onEmojiClick: (emoji: string) => void;
}) => {
  const emojis = ['😊', '😂', '❤️', '👍', '😎', '🎉', '🤔', '😢', '🔥', '🌟'];

  return (
    <div className="absolute z-10 bg-white border rounded shadow-lg p-2 grid grid-cols-5 gap-2">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          className="text-xl hover:bg-gray-100 rounded"
          onClick={() => onEmojiClick(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

const CommentComponent = ({
  courseId,
  schoolName,
}: {
  courseId: string;
  schoolName: string;
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // For replies
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});

  // For pagination
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PAGE_SIZE);

  // Store current userId
  const [userId, setUserId] = useState<string | null>(null);

  // For emoji pickers
  const [showMainEmojiPicker, setShowMainEmojiPicker] = useState(false);
  const [showReplyEmojiPickers, setShowReplyEmojiPickers] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    // Get current userId on load
    let student = localStorage.getItem('student');
    if (student) {
      try {
        const parsed = JSON.parse(student);
        setUserId(parsed?._id || null);
      } catch {
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://comment.upskillr.online/api/${courseId}`
      );
      setComments(res.data.comments || res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
    }
    setLoading(false);
  };

  const postComment = async () => {
    if (!content.trim() || !userId) return;
    try {
      await axios.post('https://comment.upskillr.online/api/add-comment', {
        userId,
        text: content,
        parentId: null,
        courseId,
        schoolName,
      });
      setContent('');
      fetchComments();
      setVisibleCount(COMMENTS_PAGE_SIZE); // Reset to first page on new post
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const postReply = async (parentId: string) => {
    const replyContent = replyTexts[parentId]?.trim();
    if (!replyContent || !userId) return;
    try {
      await axios.post('https://comment.upskillr.online/api/add-comment', {
        userId,
        text: replyContent,
        parentId,
        courseId,
        schoolName,
      });
      setReplyTexts((prev) => ({ ...prev, [parentId]: '' }));
      setActiveReply(null);
      fetchComments();
    } catch (err) {
      console.error('Error posting reply:', err);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!userId) return;
    const result = await Swal.fire({
      title: 'Delete this comment?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`https://comment.upskillr.online/api/${commentId}`, {
        data: { userId },
      });
      toast.success('Comment deleted.');
      fetchComments();
    } catch (err) {
      toast.error('Failed to delete comment.');
      console.error('Error deleting comment:', err);
    }
  };

  useEffect(() => {
    fetchComments();
    setVisibleCount(COMMENTS_PAGE_SIZE);
    // eslint-disable-next-line
  }, [courseId]);

  const handleEmojiInsert = (emoji: string, isReply?: string) => {
    if (isReply) {
      setReplyTexts((prev) => ({
        ...prev,
        [isReply]: (prev[isReply] || '') + emoji,
      }));
      setShowReplyEmojiPickers((prev) => ({ ...prev, [isReply]: false }));
    } else {
      setContent((prev) => prev + emoji);
      setShowMainEmojiPicker(false);
    }
  };

  const renderComments = (items: CommentType[], level = 0) =>
    items.map((c) => (
      <div
        key={c._id}
        style={{ marginLeft: level ? `${level * 32}px` : 0 }}
        className="text-sm text-gray-800 border-t pt-2 flex gap-3 items-start"
      >
        <img
          src={c.user?.image || DEFAULT_USER_IMAGE}
          alt={c.user?.fullName || 'User'}
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <strong>{c.user?.fullName || 'Anonymous'}</strong>
            {userId === c.user?._id && (
              <button
                className="text-xs text-red-600 hover:underline ml-2"
                onClick={() => deleteComment(c._id)}
              >
                Delete
              </button>
            )}
          </div>
          <p>{c.content}</p>
          <div className="text-xs text-gray-500">
            {new Date(c.createdAt).toLocaleString()}
          </div>
          <button
            className="text-xs text-indigo-600 hover:underline mt-1"
            onClick={() => setActiveReply(c._id)}
          >
            Reply
          </button>
          {activeReply === c._id && (
            <div className="my-2 flex gap-2 items-center relative">
              <input
                type="text"
                value={replyTexts[c._id] || ''}
                onChange={(e) =>
                  setReplyTexts((prev) => ({ ...prev, [c._id]: e.target.value }))
                }
                placeholder="Write a reply..."
                className="border px-2 py-1 rounded text-sm flex-1"
              />
              <button
                className="text-xl"
                onClick={() =>
                  setShowReplyEmojiPickers((prev) => ({
                    ...prev,
                    [c._id]: !prev[c._id],
                  }))
                }
              >
                😊
              </button>
              {showReplyEmojiPickers[c._id] && (
                <EmojiPicker
                  onEmojiClick={(emoji) => handleEmojiInsert(emoji, c._id)}
                />
              )}
              <button
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                onClick={() => postReply(c._id)}
                disabled={!replyTexts[c._id]?.trim()}
              >
                Post
              </button>
              <button
                className="text-sm px-2 py-1"
                onClick={() => setActiveReply(null)}
              >
                Cancel
              </button>
            </div>
          )}
          {c.replies && c.replies.length > 0 && (
            <div className="ml-5 mt-2 border-l border-gray-200 pl-3">
              {renderComments(c.replies, level + 1)}
            </div>
          )}
        </div>
      </div>
    ));

  const visibleTopLevel = comments.slice(0, visibleCount);

  return (
    <div className="mt-4 ml-6 p-4 bg-white rounded-lg border border-gray-200">
      <div className="mb-3 relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment about this course..."
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          className="absolute right-10 top-2 text-xl"
          onClick={() => setShowMainEmojiPicker(!showMainEmojiPicker)}
        >
          😊
        </button>
        {showMainEmojiPicker && (
          <EmojiPicker onEmojiClick={(emoji) => handleEmojiInsert(emoji)} />
        )}
        <button
          onClick={postComment}
          className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          disabled={loading || !content.trim()}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="space-y-3 min-h-[50px]">
        {loading ? (
          <div className="text-center text-sm text-gray-500">Loading comments...</div>
        ) : visibleTopLevel.length === 0 ? (
          <div className="text-center text-sm text-gray-500">No comments yet.</div>
        ) : (
          renderComments(visibleTopLevel)
        )}
        {/* Load more if more top-level comments remain */}
        {visibleCount < comments.length && (
          <div className="text-center mt-2">
            <button
              onClick={() => setVisibleCount((vc) => vc + COMMENTS_PAGE_SIZE)}
              className="px-4 py-1 bg-gray-100 border rounded text-indigo-700 hover:bg-indigo-200"
            >
              Load more comments
            </button>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
    </div>
  );
};

export default CommentComponent;

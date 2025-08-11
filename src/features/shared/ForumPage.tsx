import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

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
  createdAt: string; // Added for send time
};
type Answer = {
  _id: string;
  forum_question_id: string;
  text: string;
  author: User;
  assets?: Asset[];
  replies?: Reply[];
  createdAt: string; // Added for send time
};
type Question = {
  _id: string;
  question: string;
  author: User;
  assets?: Asset[];
  answers?: Answer[];
  replies?: Reply[];
  category: string;
  createdAt: string;
};

// --- Asset Gallery ---
const AssetGallery = ({ assets }: { assets?: Asset[] }) => {
  if (!assets?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {assets.map(a => (
        <img
          key={a._id}
          src={a.imageUrl}
          alt=""
          className="h-20 w-20 rounded-md border border-gray-200 object-cover shadow-sm"
        />
      ))}
    </div>
  );
};

// --- Question Form ---
const QuestionForm = ({ onSubmit }: { onSubmit: (q: string, imgs: string[], category: string) => void }) => {
  const [question, setQuestion] = useState('');
  const [imgs, setImgs] = useState<string[]>([]);
  const [category, setCategory] = useState('general');

  const [uploading, setUploading] = useState(false);
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  const categories = ['general', 'math', 'science', 'history', 'other'];

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
      } else {
        console.error('Image upload failed: No secure_url in response');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white p-4 shadow-md">
      <textarea
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask a new question..."
        className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
        className="mt-2 w-full"
      />
      <button
        onClick={() => {
          if (!question.trim()) {
            alert('Please enter a question.');
            return;
          }
          onSubmit(question, imgs, category);
          setQuestion('');
          setImgs([]);
          setCategory('general');
        }}
        disabled={uploading}
        className={`mt-3 w-full rounded-lg p-3 font-semibold text-white transition-colors ${
          uploading ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {uploading ? 'Uploading...' : 'Post Question'}
      </button>
      <div className="mt-2 flex flex-wrap gap-2">
        {imgs.map((url, i) => (
          <img key={i} src={url} className="h-12 w-12 rounded-md object-cover" alt="" />
        ))}
      </div>
    </div>
  );
};

// --- Response Form (for Answers and Replies) ---
const ResponseForm = ({
  onSubmit,
  placeholder = 'Type your response...',
  disabled = false,
  socket, // Socket.IO client instance
  threadId, // Selected question _id
  userName, // For identifying the typer
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
      } else {
        console.error('Image upload failed: No secure_url in response');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { threadId, userName });
    }

    // Reset the stop-typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing', { threadId, userName });
    }, 2000); // Stop after 2 seconds of inactivity
  };

  return (
    <div className="sticky bottom-0 flex items-center border-t border-gray-200 bg-white p-4 shadow-md">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading || disabled}
        className="mr-3"
      />
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
      />
      <button
        onClick={() => {
          if (!text.trim()) {
            alert('Please enter a response.');
            return;
          }
          onSubmit(text, imgs);
          setText('');
          setImgs([]);
          // Stop typing immediately after sending
          if (isTyping) {
            setIsTyping(false);
            socket.emit('stop_typing', { threadId, userName });
          }
        }}
        disabled={uploading || disabled}
        className={`ml-3 rounded-lg p-3 font-semibold text-white transition-colors ${
          uploading || disabled ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {uploading ? 'Uploading...' : 'Send'}
      </button>
      <div className="ml-3 flex flex-wrap gap-2">
        {imgs.map((url, i) => (
          <img key={i} src={url} className="h-10 w-10 rounded-md object-cover" alt="" />
        ))}
      </div>
    </div>
  );
};

// --- Message Component for Chat-like Display ---
const Message = ({
  author,
  text,
  assets,
  role,
  createdAt, // Added for send time
  isQuestion = false,
  onReply,
  socket,
  threadId,
  userName,
  onDelete,
  currentUserId,
  itemId,
}: {
  author: string;
  text: string;
  assets?: Asset[];
  role: string;
  createdAt: string; // Added
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
  const isOwnMessage = currentUserId === itemId; // Note: This assumes itemId is the author's _id; adjust if needed

  return (
    <div className={`mb-4 max-w-3xl rounded-lg p-4 shadow-md ${isQuestion ? 'bg-blue-50' : 'bg-gray-100'}`}>
      <div className={`mb-2 font-semibold ${role === 'Student' ? 'text-blue-600' : 'text-green-600'}`}>
        {author} <span className="text-sm text-gray-500">({role})</span>
      </div>
      <div className="text-gray-800">{text}</div>
      <AssetGallery assets={assets} />
      <div className="text-xs text-gray-400 mt-1">
        Sent: {new Date(createdAt).toLocaleString()} {/* Converted to local time */}
      </div>
      <div className="mt-2 flex gap-2">
        {onReply && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="border-none bg-transparent text-sm text-blue-600 hover:text-blue-800"
          >
            {showReplyForm ? 'Hide Reply' : 'Reply'}
          </button>
        )}
        {isOwnMessage && onDelete && (
          <button
            onClick={() => onDelete(itemId)}
            className="border-none bg-transparent text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        )}
      </div>
      {showReplyForm && onReply && (
        <ResponseForm
          onSubmit={onReply}
          placeholder="Type your reply..."
          socket={socket}
          threadId={threadId || ''}
          userName={userName || ''}
        />
      )}
    </div>
  );
};

// --- Recursive Reply Renderer ---
const ReplyRenderer = ({ 
  replies, 
  onReplySubmit, 
  onDeleteReply,
  socket,
  threadId,
  userName,
  currentUserId,
  questionId,
  answerId
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
}) => {
  if (!replies?.length) return null;
  return (
    <div className="ml-6 border-l-2 border-gray-200 pl-4">
      {replies.map(rep => (
        <div key={rep._id}>
          <Message
            author={rep.author.fullName}
            text={rep.text}
            assets={rep.assets}
            role={rep.author.role}
            createdAt={rep.createdAt} // Passed for send time
            onReply={(text, imgs) => onReplySubmit(text, imgs, rep._id, questionId, answerId)}
            onDelete={() => onDeleteReply(rep._id, questionId, answerId)}
            currentUserId={currentUserId}
            itemId={rep.author._id} // Assuming delete only if author matches
            socket={socket}
            threadId={threadId}
            userName={userName}
          />
          <ReplyRenderer 
            replies={rep.replies} 
            onReplySubmit={onReplySubmit} 
            onDeleteReply={onDeleteReply}
            socket={socket}
            threadId={threadId}
            userName={userName}
            currentUserId={currentUserId}
            questionId={questionId}
            answerId={answerId}
          />
        </div>
      ))}
    </div>
  );
};

const API = 'http://localhost:5000/api';

// --- Main Component ---
export default function ForumChatUI() {
  const studentData = JSON.parse(localStorage.getItem('student') || '{}');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const [user] = useState<User>({
    _id: studentData._id || 'id1',
    fullName: studentData.fullName || 'TestUser',
    role: 'Student',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    axios.get(`${API}/forum/questions`).then(res => { 
      setQuestions(Array.isArray(res.data) ? res.data : []);
    }).catch(err => {
      console.error('Failed to fetch questions:', err);
      alert('Failed to load questions. Please try again.');
    });

    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('new_question', (qDoc: Question) => {
      setQuestions(qs => [qDoc, ...qs]);
    });

    socketRef.current.on('typing', ({ threadId, userName }: { threadId: string; userName: string }) => {
      if (selected && selected._id === threadId) {
        setTypingUsers(u => (u.includes(userName) ? u : [...u, userName]));
      }
    });

    socketRef.current.on('stop_typing', ({ threadId, userName }: { threadId: string; userName: string }) => {
      if (selected && selected._id === threadId) {
        setTypingUsers(u => u.filter(n => n !== userName));
      }
    });

    socketRef.current.on('new_answer', (aDoc: Answer) => {
      setQuestions(qs =>
        qs.map(q => q._id === aDoc.forum_question_id
          ? { ...q, answers: [...(q.answers || []), aDoc] }
          : q
        )
      );
      if (selected && selected._id === aDoc.forum_question_id) {
        setSelected(sel => sel ? { ...sel, answers: [...(sel.answers || []), aDoc] } : sel);
      }
    });

    socketRef.current.on('new_reply', (rDoc: Reply) => {
      setQuestions(qs =>
        qs.map(q => {
          if (rDoc.forum_question_id === q._id && !rDoc.forum_answer_id) {
            return {
              ...q,
              replies: updateNestedReplies(q.replies || [], rDoc)
            };
          }
          return {
            ...q,
            answers: q.answers?.map(a =>
              a._id === rDoc.forum_answer_id
                ? {
                    ...a,
                    replies: updateNestedReplies(a.replies || [], rDoc)
                  }
                : a
            )
          };
        })
      );
      if (selected) {
        setSelected(sel => {
          if (!sel) return sel;
          if (rDoc.forum_question_id === sel._id && !rDoc.forum_answer_id) {
            return {
              ...sel,
              replies: updateNestedReplies(sel.replies || [], rDoc)
            };
          }
          return {
            ...sel,
            answers: sel.answers?.map(a =>
              a._id === rDoc.forum_answer_id
                ? {
                    ...a,
                    replies: updateNestedReplies(a.replies || [], rDoc)
                  }
                : a
            )
          };
        });
      }
    });

    socketRef.current.on('question_deleted', ({ id }: { id: string }) => {
      setQuestions(qs => qs.filter(q => q._id !== id));
      if (selected?._id === id) setSelected(null);
    });

    socketRef.current.on('answer_deleted', ({ id, questionId }: { id: string; questionId: string }) => {
      setQuestions(qs =>
        qs.map(q => q._id === questionId ? { ...q, answers: q.answers?.filter(a => a._id !== id) || [] } : q)
      );
      if (selected?._id === questionId) {
        setSelected(sel => sel ? { ...sel, answers: sel.answers?.filter(a => a._id !== id) || [] } : sel);
      }
    });

    socketRef.current.on('reply_deleted', ({ id, questionId, answerId }: { id: string; questionId: string; answerId?: string }) => {
      const removeNestedReply = (replies: Reply[]): Reply[] => {
        return replies.reduce((acc, r) => {
          if (r._id === id) return acc;
          return [...acc, { ...r, replies: removeNestedReply(r.replies || []) }];
        }, [] as Reply[]);
      };

      setQuestions(qs =>
        qs.map(q => {
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

      if (selected?._id === questionId) {
        setSelected(sel => {
          if (!sel) return sel;
          if (answerId) {
            return {
              ...sel,
              answers: sel.answers?.map(a => a._id === answerId ? { ...a, replies: removeNestedReply(a.replies || []) } : a) || []
            };
          } else {
            return { ...sel, replies: removeNestedReply(sel.replies || []) };
          }
        });
      }
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      alert('Failed to connect to real-time updates. Please refresh.');
    });

    return () => { socketRef.current.disconnect(); };
  }, []);

  useEffect(() => {
    if (selected?._id && socketRef.current) {
      socketRef.current.emit('join_thread', selected._id);
    }
  }, [selected]);

  const updateNestedReplies = (replies: Reply[], newReply: Reply): Reply[] => {
    if (!newReply.parent_reply_id) {
      return [...replies, { ...newReply, replies: [] }];
    }
    return replies.map(r => {
      if (r._id === newReply.parent_reply_id) {
        return {
          ...r,
          replies: [...(r.replies || []), { ...newReply, replies: [] }]
        };
      }
      if (r.replies) {
        return { ...r, replies: updateNestedReplies(r.replies, newReply) };
      }
      return r;
    });
  };

  const selectQuestion = (qid: string) => {
    if (selected?._id === qid) return;
    axios.get(`${API}/forum/questions/${qid}`)
      .then(res => {
        if (!res.data || !res.data._id) {
          throw new Error('Invalid question data');
        }
        setSelected(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch question:', err);
        alert(`Failed to load question: ${err.message}. Please try again.`);
      });
  };

  const deleteQuestion = (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    axios.delete(`${API}/forum/questions/${questionId}`)
      .then(() => {
        socketRef.current.emit('delete_question', questionId);
      })
      .catch(err => {
        console.error('Failed to delete question:', err);
        alert('Failed to delete question. Please try again.');
      });
  };

  const deleteAnswer = (answerId: string, questionId: string) => {
    if (!confirm('Are you sure you want to delete this answer?')) return;
    axios.delete(`${API}/forum/answers/${answerId}`)
      .then(() => {
        socketRef.current.emit('delete_answer', { answerId, questionId });
      })
      .catch(err => {
        console.error('Failed to delete answer:', err);
        alert('Failed to delete answer. Please try again.');
      });
  };

  const deleteReply = (replyId: string, questionId: string, answerId?: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    axios.delete(`${API}/forum/replies/${replyId}`)
      .then(() => {
        socketRef.current.emit('delete_reply', { replyId, questionId, answerId });
      })
      .catch(err => {
        console.error('Failed to delete reply:', err);
        alert('Failed to delete reply. Please try again.');
      });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar: Question Form + List */}
      <div className="w-80 overflow-y-auto bg-white shadow-lg">
        <QuestionForm
          onSubmit={(text, imgs, category) =>
            axios.post(`${API}/forum/questions`, {
              question: text,
              author: user._id,
              category,
              authorType: user.role,
              imageUrls: imgs
            })
              .then(() => {})
              .catch(err => {
                console.error('Failed to post question:', err);
                alert('Failed to post question. Please try again.');
              })
          }
        />
        <ul className="m-0 p-0">
          {questions.map(q => (
            <li
              key={q._id}
              onClick={() => selectQuestion(q._id)}
              className={`cursor-pointer border-b border-gray-200 p-4 transition-colors ${
                selected?._id === q._id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-sm font-semibold text-gray-800 truncate">{q.question}</div>
              <div className="text-xs text-gray-500 mt-1">
                by {q.author?.fullName || 'Unknown'} 
              </div>
              <div className="text-xs text-gray-500">Category: {q.category}</div>
              <span className='text-sm text-gray-400'> {new Date(q.createdAt).toLocaleString()}</span>
              <AssetGallery assets={q.assets} />
              {q.author._id === user._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(q._id);
                  }}
                  className="mt-2 border-none bg-transparent text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
          {questions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No questions available
            </div>
          )}
        </ul>
      </div>

      {/* Right Main: Selected Question Chat */}
      <div className="flex flex-1 flex-col">
        {selected ? (
          <>
            <div className="border-b border-gray-200 bg-white p-4 shadow-md">
              <h3 className="m-0 text-lg font-semibold">{selected.question}</h3>
              <span className="text-sm text-gray-500">
                Category: {selected.category} | By: {selected.author.fullName} ({selected.author.role})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
              <Message
                author={selected.author.fullName}
                text={selected.question}
                assets={selected.assets}
                role={selected.author.role}
                createdAt={selected.createdAt} // Passed for send time
                isQuestion={true}
                socket={socketRef.current}
                threadId={selected._id}
                userName={user.fullName}
                onDelete={() => deleteQuestion(selected._id)}
                currentUserId={user._id}
                itemId={selected.author._id}
              />
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
                    alert('Failed to post reply. Please try again.');
                  })
                }
                onDeleteReply={deleteReply}
                socket={socketRef.current}
                threadId={selected._id}
                userName={user.fullName}
                currentUserId={user._id}
                questionId={selected._id}
              />
              {(selected.answers || []).map(ans => (
                <div key={ans._id}>
                  <Message
                    author={ans.author.fullName}
                    text={ans.text}
                    assets={ans.assets}
                    role={ans.author.role}
                    createdAt={ans.createdAt} // Passed for send time
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
                        alert('Failed to post reply. Please try again.');
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
                        alert('Failed to post reply. Please try again.');
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
            </div>
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="bg-gray-200 p-2 text-sm text-gray-600">
                {typingUsers.length === 1
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.join(' and ')} are typing...`}
              </div>
            )}
            <ResponseForm
              onSubmit={(text, imgs) =>
                axios.post(`${API}/forum/answers`, {
                  forum_question_id: selected._id,
                  text,
                  author: user._id,
                  authorType: user.role,
                  imageUrls: imgs
                }).catch(err => {
                  console.error('Failed to post answer:', err);
                  alert('Failed to post answer. Please try again.');
                })
              }
              placeholder="Type your answer..."
              socket={socketRef.current}
              threadId={selected._id}
              userName={user.fullName}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Select a question from the sidebar to view and respond
          </div>
        )}
      </div>
    </div>
  );
}

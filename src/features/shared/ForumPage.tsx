import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { MagnifyingGlassIcon, FunnelIcon, UserCircleIcon, ChatBubbleLeftIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { QuestionForm } from './components/UI/QuestionForm';
import { ToastContainer } from './components/UI/ToastContainer';
import { QuestionListItem } from './components/UI/QuestionListItem';
import { Message } from './components/UI/Message';
import { ReplyRenderer } from './components/UI/ReplyRender';
import { ResponseForm } from './components/UI/QuestionResponse';
import { User, Question, Answer, Reply, Toast, API } from './types/ImportsAndTypes';

// Utility function for debouncing
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function ForumChatUI() {
  const studentData = JSON.parse(localStorage.getItem('student') || '{}');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const [user] = useState<User>({
    _id: studentData._id || 'id1',
    fullName: studentData.fullName || 'TestUser',
    role: 'Student',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKeys, setRefreshKeys] = useState<{ [key: string]: number }>({});
  const [forceUpdate, setForceUpdate] = useState(0);
  const [sidebarRefreshing, setSidebarRefreshing] = useState(false);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Debounced refresh key setter
  const debouncedSetRefreshKey = useCallback(
    debounce((questionId: string) => {
      setRefreshKeys((prev) => ({ ...prev, [questionId]: Date.now() }));
    }, 100),
    []
  );

  const filteredQuestions = questions
    .filter((q) => {
      const matchesSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.author?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      return !q.isDeleted && matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'latest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

  useEffect(() => {
    scrollToBottom();
  }, [selected?.answers, selected?.replies, scrollToBottom]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/forum/questions`)
      .then((res) => {
        setQuestions(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch questions:', err);
        addToast('Failed to load questions. Please try again.', 'error');
      })
      .finally(() => setLoading(false));

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

    socketRef.current.on('connect', () => {
      addToast('Connected to real-time updates', 'success');
    });

    // Improved new question handler
    socketRef.current.on('new_question', (qDoc: Question) => {
      console.log('New question received:', qDoc);
      
      setQuestions((prevQuestions) => {
        // Remove any existing question with same ID and add new one at the beginning
        const filteredQuestions = prevQuestions.filter((q) => q._id !== qDoc._id);
        return [qDoc, ...filteredQuestions];
      });
      
      // Set immediate refresh key for rendering
      setRefreshKeys((prev) => ({ ...prev, [qDoc._id]: Date.now() }));
      
      // Force component update
      setForceUpdate(prev => prev + 1);
      
      if (qDoc.assets && qDoc.assets.length > 0) {
        const hasUnprocessedImages = qDoc.assets.some(asset => 
          !asset.url || 
          asset.url.includes('processing') || 
          asset.url.includes('placeholder')
        );
        
        if (hasUnprocessedImages) {
          addToast('Question posted! Processing images...', 'info');
        } else {
          addToast('Question posted successfully!', 'success');
        }
      } else {
        addToast('Question posted successfully!', 'success');
      }
    });

    // Enhanced image processing handler
    socketRef.current.on('image_processed', ({ questionId, updatedQuestion }: { questionId: string; updatedQuestion: Question }) => {
      console.log('Image processed for question:', questionId, updatedQuestion);
      
      // Update questions list
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q._id === questionId ? updatedQuestion : q))
      );
      
      // Update selected question if it matches
      if (selected && selected._id === questionId) {
        setSelected(updatedQuestion);
      }
      
      // Force re-render with new refresh key
      setRefreshKeys((prev) => ({ ...prev, [questionId]: Date.now() }));
      setForceUpdate(prev => prev + 1);
      
      addToast('Images processed successfully!', 'success');
    });

    socketRef.current.on('image_processing_error', ({ questionId, error }: { questionId: string; error: string }) => {
      console.error('Image processing error:', questionId, error);
      addToast(`Image processing failed: ${error}`, 'error');
      debouncedSetRefreshKey(questionId);
    });

    socketRef.current.on('new_answer', (aDoc: Answer) => {
      if (selected && selected._id === aDoc.forum_question_id) {
        selectQuestion(selected._id, true);
        if (String(aDoc.author?._id) !== String(user._id)) {
          addToast(`${aDoc.author?.fullName || 'Someone'} responded to the question`, 'success');
        }
      } else {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === aDoc.forum_question_id
              ? { ...q, answers: [...(q.answers || []), aDoc] }
              : q
          )
        );
      }
    });

    socketRef.current.on('new_reply', (rDoc: Reply) => {
      if (selected && selected._id === rDoc.forum_question_id) {
        selectQuestion(selected._id, true);
        if (String(rDoc.author?._id) !== String(user._id)) {
          addToast(`${rDoc.author?.fullName || 'Someone'} replied to a message`, 'info');
        }
      } else {
        const updateNestedReplies = (replies: Reply[], newReply: Reply): Reply[] => {
          if (!newReply.parent_reply_id) {
            return [...replies, { ...newReply, replies: [] }];
          }
          return replies.map((r) => {
            if (r._id === newReply.parent_reply_id) {
              return { ...r, replies: [...(r.replies || []), { ...newReply, replies: [] }] };
            }
            if (r.replies) {
              return { ...r, replies: updateNestedReplies(r.replies, newReply) };
            }
            return r;
          });
        };

        setQuestions((prevQuestions) =>
          prevQuestions.map((q) => {
            if (rDoc.forum_question_id === q._id && !rDoc.forum_answer_id) {
              return { ...q, replies: updateNestedReplies(q.replies || [], rDoc) };
            }
            return {
              ...q,
              answers: q.answers?.map((a) =>
                a._id === rDoc.forum_answer_id
                  ? { ...a, replies: updateNestedReplies(a.replies || [], rDoc) }
                  : a
              ) || [],
            };
          })
        );
      }
    });

    socketRef.current.on('typing', ({ threadId, userName }: { threadId: string; userName: string }) => {
      if (selected && selected._id === threadId && userName !== user.fullName) {
        setTypingUsers((prevUsers) => (prevUsers.includes(userName) ? prevUsers : [...prevUsers, userName]));
      }
    });

    socketRef.current.on('stop_typing', ({ threadId, userName }: { threadId: string; userName: string }) => {
      if (selected && selected._id === threadId) {
        setTypingUsers((prevUsers) => prevUsers.filter((name) => name !== userName));
      }
    });

    socketRef.current.on('question_deleted', ({ id }: { id: string }) => {
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== id));
      if (selected?._id === id) {
        setSelected(null);
      }
      addToast('Question deleted', 'info');
    });

    socketRef.current.on('answer_deleted', ({ id, questionId }: { id: string; questionId: string }) => {
      if (selected && selected._id === questionId) {
        selectQuestion(questionId, true);
      } else {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId ? { ...q, answers: q.answers?.filter((a) => a._id !== id) || [] } : q
          )
        );
      }
    });

    socketRef.current.on('reply_deleted', ({ id, questionId, answerId }: { id: string; questionId: string; answerId?: string }) => {
      if (selected && selected._id === questionId) {
        selectQuestion(questionId, true);
      } else {
        const removeNestedReply = (replies: Reply[]): Reply[] => {
          return replies.reduce((acc, r) => {
            if (r._id === id) return acc;
            return [...acc, { ...r, replies: removeNestedReply(r.replies || []) }];
          }, [] as Reply[]);
        };

        setQuestions((prevQuestions) =>
          prevQuestions.map((q) => {
            if (q._id === questionId) {
              if (answerId) {
                return {
                  ...q,
                  answers: q.answers?.map((a) =>
                    a._id === answerId ? { ...a, replies: removeNestedReply(a.replies || []) } : a
                  ) || [],
                };
              } else {
                return { ...q, replies: removeNestedReply(q.replies || []) };
              }
            }
            return q;
          })
        );
      }
    });

    socketRef.current.on('connect_error', (err: any) => {
      console.error('Socket connection error:', err);
      addToast('Failed to connect to real-time updates. Please refresh.', 'error');
    });

    socketRef.current.on('disconnect', () => {
      addToast('Disconnected from real-time updates', 'warning');
    });

    socketRef.current.on('reconnect', () => {
      addToast('Reconnected to real-time updates', 'success');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user.fullName, user._id, addToast, selected, debouncedSetRefreshKey]);

  useEffect(() => {
    setTypingUsers([]);
    if (selected?._id && socketRef.current) {
      socketRef.current.emit('join_thread', selected._id);
    }
  }, [selected]);

  const selectQuestion = useCallback((qid: string, force: boolean = false) => {
    if (!force && selected?._id === qid) return;

    setLoading(true);
    axios
      .get(`${API}/forum/questions/${qid}`)
      .then((res) => {
        if (!res.data || !res.data._id) {
          throw new Error('Invalid question data');
        }
        console.log('Fetched question data:', res.data);
        const questionData = {
          ...res.data,
          author: res.data.author,
        };
        setSelected(questionData);
      })
      .catch((err) => {
        console.error('Failed to fetch question:', err);
        addToast(`Failed to load question: ${err.message}. Please try again.`, 'error');
      })
      .finally(() => setLoading(false));
  }, [selected, addToast]);

  const deleteQuestion = useCallback((questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    axios
      .delete(`${API}/forum/questions/${questionId}`)
      .then(() => {
        if (socketRef.current) {
          socketRef.current.emit('delete_question', questionId);
        }
      })
      .catch((err) => {
        console.error('Failed to delete question:', err);
        addToast('Failed to delete question. Please try again.', 'error');
      });
  }, [addToast]);

  const deleteAnswer = useCallback((answerId: string, questionId: string) => {
    if (!confirm('Are you sure you want to delete this answer?')) return;

    axios
      .delete(`${API}/forum/answers/${answerId}`)
      .then(() => {
        if (socketRef.current) {
          socketRef.current.emit('delete_answer', { answerId, questionId });
        }
        if (selected?._id === questionId) {
          selectQuestion(questionId, true);
        }
      })
      .catch((err) => {
        console.error('Failed to delete answer:', err);
        addToast('Failed to delete answer. Please try again.', 'error');
      });
  }, [selected, selectQuestion, addToast]);

  const deleteReply = useCallback((replyId: string, questionId: string, answerId?: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    axios
      .delete(`${API}/forum/replies/${replyId}`)
      .then(() => {
        if (socketRef.current) {
          socketRef.current.emit('delete_reply', { replyId, questionId, answerId });
        }
        if (selected?._id === questionId) {
          selectQuestion(questionId, true);
        }
      })
      .catch((err) => {
        console.error('Failed to delete reply:', err);
        addToast('Failed to delete reply. Please try again.', 'error');
      });
  }, [selected, selectQuestion, addToast]);

  const handleQuestionSubmit = useCallback((text: string, imgs: string[], category: string) => {
    setSidebarRefreshing(true);
    return axios
      .post(`${API}/forum/questions`, {
        question: text,
        author: user._id,
        category,
        authorType: user.role,
        imageUrls: imgs,
      })
      .then((res) => {
        addToast('Question posted successfully! Refreshing questions...', 'success');

        // Fetch updated questions list for sidebar refresh
        return axios.get(`${API}/forum/questions`)
          .then((res) => {
            if (Array.isArray(res.data)) {
              setQuestions(res.data);
            }
          })
          .catch((err) => {
            console.error('Failed to refresh questions:', err);
            addToast('Failed to refresh questions after posting. Please refresh the page.', 'error');
          });
      })
      .catch((err) => {
        console.error('Failed to post question:', err);
        addToast('Failed to post question. Please try again.', 'error');
        throw err;
      })
      .finally(() => {
        setSidebarRefreshing(false);
      });
  }, [user._id, user.role, addToast]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: '🔍 General' },
    { value: 'math', label: '🔢 Mathematics' },
    { value: 'science', label: '🧪 Science' },
    { value: 'history', label: '📚 History' },
    { value: 'other', label: '🎯 Other' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  return (
    <div className="flex md:flex-row flex-col h-screen bg-gray-50">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className={`w-full md:w-96 flex flex-col bg-white shadow-xl border-r border-gray-200 ${selected ? 'hidden md:flex' : 'flex'}`}>
        <QuestionForm onSubmit={handleQuestionSubmit} />

        <div className="border-b border-gray-200 p-4 space-y-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <ClockIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative">
          {sidebarRefreshing && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
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
              {filteredQuestions.map((q) => (
                <QuestionListItem
                  key={`${q._id}-${refreshKeys[q._id] || 0}-${q.assets?.length || 0}-${forceUpdate}`}
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

      <div className={`flex flex-1 flex-col ${selected ? 'flex' : 'hidden md:flex'}`}>
        {selected ? (
          <>
            {/* ...rest of the right-side detailed view unchanged */}
            {/* Keep your existing code here for selected question display */}
            {/* ... */}
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

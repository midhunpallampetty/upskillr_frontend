import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { MagnifyingGlassIcon, FunnelIcon, UserCircleIcon, ChatBubbleLeftIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import {QuestionForm} from './components/UI/QuestionForm';
import {ToastContainer} from './components/UI/ToastContainer';
import {QuestionListItem} from './components/UI/QuestionListItem';
import {Message} from './components/UI/Message';  
import {ReplyRenderer} from './components/UI/ReplyRender';
import {ResponseForm} from './components/UI/QuestionResponse';
import { User, Question, Answer, Reply, Toast, API } from './types/ImportsAndTypes';


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
  const selectedRef = useRef<Question | null>(null); // Ref to track current selected without triggering rerenders


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


  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);


  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (q.author?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      return !q.isDeleted && matchesSearch && matchesCategory;
    });
  }, [questions, searchQuery, selectedCategory]);


  useEffect(() => {
    scrollToBottom();
  }, [selected?.answers, selected?.replies, scrollToBottom]);


  // Separate use Ascent: Fetch initial questions only once
  useEffect(() => {
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
  }, []);


  // Socket setup in a separate effect with minimal dependencies
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);


    socketRef.current.on('connect', () => {
      addToast('Connected to real-time updates', 'success');
    });


    socketRef.current.on('new_question', (qDoc: Question) => {
      // Fetch full question data to ensure images/assets are included
      axios.get(`${API}/forum/questions/${qDoc._id}`)
        .then(res => {
          const fullQuestion = res.data;
          setQuestions(prevQuestions => {
            // Avoid duplicate if already added (e.g., via onSubmit fetch)
            if (prevQuestions.some(q => q._id === fullQuestion._id)) {
              return prevQuestions.map(q => 
                q._id === fullQuestion._id ? fullQuestion : q
              );
            }
            return [fullQuestion, ...prevQuestions];
          });
          if (String(fullQuestion.author._id) !== String(user._id)) {
            addToast(`${fullQuestion.author.fullName} asked a new question`, 'info');
          }
        })
        .catch(err => {
          console.error('Failed to fetch new question details:', err);
          // Fallback to using socket data if fetch fails
          setQuestions(prevQuestions => [qDoc, ...prevQuestions]);
          if (String(qDoc.author._id) !== String(user._id)) {
            addToast(`${qDoc.author.fullName} asked a new question`, 'info');
          }
        });
    });


    socketRef.current.on('new_answer', (aDoc: Answer) => {
      if (selectedRef.current && selectedRef.current._id === aDoc.forum_question_id) {
        selectQuestion(selectedRef.current._id, true);
        if (String(aDoc.author?._id) !== String(user._id)) {
          addToast(`${aDoc.author?.fullName || 'Someone'} responded to the question`, 'success');
        }
      } else {
        setQuestions(prevQuestions =>
          prevQuestions.map(q => q._id === aDoc.forum_question_id
            ? { ...q, answers: [...(q.answers || []), aDoc] }
            : q
          )
        );
      }
    });


    socketRef.current.on('new_reply', (rDoc: Reply) => {
      if (selectedRef.current && selectedRef.current._id === rDoc.forum_question_id) {
        selectQuestion(selectedRef.current._id, true);
        if (String(rDoc.author?._id) !== String(user._id)) {
          addToast(`${rDoc.author?.fullName || 'Someone'} replied to a message`, 'info');
        }
      } else {
        // Minimal update for non-selected questions
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
      }
    });


    socketRef.current.on('typing', ({ threadId, userName }: { threadId: string; userName: string }) => {
      if (selectedRef.current && selectedRef.current._id === threadId && userName !== user.fullName) {
        setTypingUsers(prevUsers =>
          prevUsers.includes(userName) ? prevUsers : [...prevUsers, userName]
        );
      }
    });


    socketRef.current.on('stop_typing', ({ threadId, userName }: { threadId: string; userName: string }) => {
      if (selectedRef.current && selectedRef.current._id === threadId) {
        setTypingUsers(prevUsers => prevUsers.filter(name => name !== userName));
      }
    });


    socketRef.current.on('question_deleted', ({ id }: { id: string }) => {
      setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== id));
      if (selectedRef.current?._id === id) {
        setSelected(null);
      }
      addToast('Question deleted', 'info');
    });


    socketRef.current.on('answer_deleted', ({ id, questionId }: { id: string; questionId: string }) => {
      if (selectedRef.current && selectedRef.current._id === questionId) {
        selectQuestion(questionId, true);
      } else {
        setQuestions(prevQuestions =>
          prevQuestions.map(q => q._id === questionId
            ? { ...q, answers: q.answers?.filter(a => a._id !== id) || [] }
            : q
          )
        );
      }
    });


    socketRef.current.on('reply_deleted', ({ id, questionId, answerId }: { id: string; questionId: string; answerId?: string }) => {
      if (selectedRef.current && selectedRef.current._id === questionId) {
        selectQuestion(questionId, true);
      } else {
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
      }
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
  }, [user.fullName, user._id, addToast]); // Removed 'selected' from dependencies to prevent reconnection on select change


  // Update ref when selected changes
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);


  // Join thread when selected changes
  useEffect(() => {
    setTypingUsers([]);
    if (selected?._id && socketRef.current) {
      socketRef.current.emit('join_thread', selected._id);
    }
  }, [selected]);


  const selectQuestion = useCallback((qid: string, force: boolean = false) => {
    if (!force && selected?._id === qid) return;
    
    setLoading(true);
    axios.get(`${API}/forum/questions/${qid}`)
      .then(res => {
        if (!res.data || !res.data._id) {
          throw new Error('Invalid question data');
        }
        console.log('Fetched question data:', res.data);
        console.log('Answers with replies:', res.data.answers?.map(ans => ({
          answerId: ans._id,
          replyCount: ans.replies?.length || 0
        }))); // Debug: Check if replies are nested under answers
        // Ensure author exists; set defaults if missing
        const questionData = {
          ...res.data,
          author: res.data.author ,
        };
        setSelected(questionData);
      })
      .catch(err => {
        console.error('Failed to fetch question:', err);
        addToast(`Failed to load question: ${err.message}. Please try again.`, 'error');
      })
      .finally(() => setLoading(false));
  }, [selected, addToast]);


  const deleteQuestion = useCallback((questionId: string) => {
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
  }, [addToast]);


  const deleteAnswer = useCallback((answerId: string, questionId: string) => {
    if (!confirm('Are you sure you want to delete this answer?')) return;
    
    axios.delete(`${API}/forum/answers/${answerId}`)
      .then(() => {
        if (socketRef.current) {
          socketRef.current.emit('delete_answer', { answerId, questionId });
        }
        if (selected?._id === questionId) {
          selectQuestion(questionId, true);
        }
      })
      .catch(err => {
        console.error('Failed to delete answer:', err);
        addToast('Failed to delete answer. Please try again.', 'error');
      });
  }, [selected, selectQuestion, addToast]);


  const deleteReply = useCallback((replyId: string, questionId: string, answerId?: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    
    axios.delete(`${API}/forum/replies/${replyId}`)
      .then(() => {
        if (socketRef.current) {
          socketRef.current.emit('delete_reply', { replyId, questionId, answerId });
        }
        if (selected?._id === questionId) {
          selectQuestion(questionId, true);
        }
      })
      .catch(err => {
        console.error('Failed to delete reply:', err);
        addToast('Failed to delete reply. Please try again.', 'error');
      });
  }, [selected, selectQuestion, addToast]);


  const categories = useMemo(() => [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: '🔍 General' },
    { value: 'math', label: '🔢 Mathematics' },
    { value: 'science', label: '🧪 Science' },
    { value: 'history', label: '📚 History' },
    { value: 'other', label: '🎯 Other' }
  ], []);


  return (
    <div className="flex md:flex-row flex-col h-screen bg-gray-50">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className={`w-full md:w-96 flex flex-col bg-white shadow-xl border-r border-gray-200 ${selected ? 'hidden md:flex' : 'flex'}`}>
        <QuestionForm
          onSubmit={(text, imgs, category) =>
            axios.post(`${API}/forum/questions`, {
              question: text,
              author: user._id,
              category,
              authorType: user.role,
              imageUrls: imgs
            })
              .then(res => {
                const newQuestionId = res.data._id; // Assuming the POST returns the created question with at least its ID
                addToast('Question posted successfully!', 'success');


                // Immediately fetch the full question to get complete data (including images)
                return axios.get(`${API}/forum/questions/${newQuestionId}`)
                  .then(fetchRes => {
                    const fullQuestion = fetchRes.data;
                    setQuestions(prevQuestions => {
                      // Avoid duplicate if socket already added it
                      if (prevQuestions.some(q => q._id === fullQuestion._id)) {
                        return prevQuestions.map(q => 
                          q._id === fullQuestion._id ? fullQuestion : q
                        );
                      }
                      return [fullQuestion, ...prevQuestions];
                    });
                  });
              })
              .catch(err => {
                console.error('Failed to post question:', err);
                addToast('Failed to post question. Please try again.', 'error');
              })
          }
        />


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
        <div className="flex-1 overflow-y-auto">
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
      <div className={`flex flex-1 flex-col ${selected ? 'flex' : 'hidden md:flex'}`}>
        {selected ? (
          <>
            <div className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelected(null)} 
                  className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {selected.question}
                  </h1>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <UserCircleIcon className="h-4 w-4" />
                      {selected.author?.fullName })
                    </span>
                    <span>•</span>
                    <span>Category: {selected.category}</span>
                    <span>•</span>
                    <span>{new Date(selected.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <Message
                  author={selected.author?.fullName || 'Anonymous'}
                  text={selected.question}
                  assets={selected.assets}
                  role={selected.author?.role}
                  createdAt={selected.createdAt}
                  isQuestion={true}
                  socket={socketRef.current}
                  threadId={selected._id}
                  userName={user.fullName}
                  onDelete={() => deleteQuestion(selected._id)}
                  currentUserId={user._id}
                  itemId={selected.author?._id}
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
                    }).then(() => {
                      selectQuestion(selected._id, true);
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
                {(selected.answers || []).map(ans => (
                  <div key={ans._id}>
                    <Message
                      author={ans.author?.fullName || 'Anonymous'}
                      text={ans.text}
                      assets={ans.assets}
                      role={ans.author?.role}
                      createdAt={ans.createdAt}
                      onDelete={() => deleteAnswer(ans._id, selected._id)}
                      currentUserId={user._id}
                      itemId={ans.author?._id}
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
                        }).then(() => {
                          selectQuestion(selected._id, true);
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
                <div ref={messagesEndRef} />
              </div>
            </div>
            {typingUsers.length > 0 && (
              <div className="border-t border-gray-200 bg-blue-50 px-6 py-3">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: '0.2s' }} />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span>
                    {typingUsers.length === 1
                      ? `${typingUsers[0]} is typing...`
                      : `${typingUsers.join(' and ')} are typing...`}
                  </span>
                </div>
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
                }).then(() => {
                  addToast('Answer posted successfully!', 'success');
                  selectQuestion(selected._id, true);
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

import { EllipsisVerticalIcon } from "lucide-react";
import { ResponseForm } from "./QuestionResponse";
import { Asset } from "../../types/ImportsAndTypes";
import { useState } from "react";
import { AssetGallery } from "./AssetGallery";

export const Message = ({
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
  author: string | any;
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
            <div className={`font-semibold ${getRoleColor(authorRole)}`}>{authorName}</div>
            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getRoleBadge(authorRole)}`}>{authorRole}</span>
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

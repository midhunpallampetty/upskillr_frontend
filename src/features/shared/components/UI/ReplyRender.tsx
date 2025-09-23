// components/UI/ReplyRender.tsx (or wherever it's defined)
import { Reply } from "../../types/ImportsAndTypes";
import { Message } from "./Message";

export const ReplyRenderer = ({
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
  
  // Increase indentation based on depth (e.g., 20px per level)
  const indentation = depth * 20;

  return (
    <div style={{ marginLeft: `${indentation}px`, borderLeft: depth > 0 ? '2px solid #e5e7eb' : 'none', paddingLeft: depth > 0 ? '16px' : '0' }} className="space-y-4">
      {replies.map(reply => (
        <div key={reply._id}>
          <Message
            author={reply.author?.fullName || 'Unknown User'}  // Safe author handling
            text={reply.text}
            assets={reply.assets}
            role={reply.author?.role || 'User'}
            createdAt={reply.createdAt}
            onReply={(text, imgs) => onReplySubmit(text, imgs, reply._id, questionId, answerId)}
            onDelete={() => onDeleteReply(reply._id, questionId, answerId)}
            currentUserId={currentUserId}
            itemId={reply.author?._id || reply._id}
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
            depth={depth + 1}  // Increment depth for nesting
          />
        </div>
      ))}
    </div>
  );
};

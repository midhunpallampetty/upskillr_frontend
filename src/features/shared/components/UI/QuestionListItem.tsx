import { TrashIcon, UserCircleIcon } from "lucide-react";
import { AssetGallery } from "./AssetGallery";
import { Question } from "../../types/ImportsAndTypes";

export const QuestionListItem = ({ 
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

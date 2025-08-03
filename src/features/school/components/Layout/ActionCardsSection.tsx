import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Users, FileText } from 'lucide-react';
import ActionCard from '../UI/ActionCard';
import { useGlobalState } from '../../../../context/GlobalState';

interface ActionCardsSectionProps {
  dispatchView: (action: { type: string }) => void;
}

const ActionCardsSection: React.FC<ActionCardsSectionProps> = ({ dispatchView }) => {
  const { isDarkMode } = useGlobalState();
  const navigate = useNavigate();
  const { verifiedSchool } = useParams();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <ActionCard
        title="Add New Course"
        description="Create and publish new courses for your students"
        icon={<BookOpen className="w-8 h-8" />}
        gradient="from-blue-500 to-blue-600"
        onClick={() => navigate(`/school/${verifiedSchool}/addCourse`)}
        isDarkMode={isDarkMode}
      />
      <ActionCard
        title="View Students"
        description="Manage and track your enrolled students"
        icon={<Users className="w-8 h-8" />}
        gradient="from-green-500 to-green-600"
        onClick={() => dispatchView({ type: 'SHOW_STUDENTS' })}
        isDarkMode={isDarkMode}
      />
      <ActionCard
        title="Manage Exams"
        description="Create, schedule and monitor examinations"
        icon={<FileText className="w-8 h-8" />}
        gradient="from-purple-500 to-purple-600"
        onClick={() => navigate(`/school/${verifiedSchool}/manage-exam`)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ActionCardsSection;
import React, { lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useGlobalState } from '../../../../context/GlobalState';
import LoadingGrid from '../UI/LoadingGrid';

const SchoolCourses = lazy(() => import('../UI/SchoolCourses'));

interface CoursesSectionProps {
  schoolId: string;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ schoolId }) => {
  const { isDarkMode } = useGlobalState();
  const navigate = useNavigate();
  const { verifiedSchool } = useParams();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Your Courses
        </h3>
        <button
          onClick={() => navigate(`/school/${verifiedSchool}/addCourse`)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>
      <Suspense fallback={<LoadingGrid isDarkMode={isDarkMode} />}>
        <SchoolCourses schoolId={schoolId} dbname={verifiedSchool || ''} />
      </Suspense>
    </div>
  );
};

export default CoursesSection;
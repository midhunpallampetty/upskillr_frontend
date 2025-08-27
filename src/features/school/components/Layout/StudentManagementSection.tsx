import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGlobalState } from '../../../../context/GlobalState';
import LoadingCard from '../UI/LoadingCard';

const StudentList = lazy(() => import('../UI/StudentList'));

interface StudentManagementSectionProps {
  dispatchView: (action: { type: string }) => void;
  schoolData: any; // 🔹 replace `any` with your actual type (e.g., School type/interface)
}

const StudentManagementSection: React.FC<StudentManagementSectionProps> = ({ dispatchView, schoolData }) => {
  const { isDarkMode } = useGlobalState();
  const { verifiedSchool } = useParams();

  console.log("Verified School in StudentManagementSection:", verifiedSchool);
  console.log("School Data in StudentManagementSection:", schoolData);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Student Management
          </h2>
          <p
            className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            View and manage all enrolled students
          </p>
        </div>
        <button
          onClick={() => dispatchView({ type: 'SHOW_DASHBOARD' })}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <Suspense fallback={<LoadingCard isDarkMode={isDarkMode} />}>
        {/* ✅ now you can use both verifiedSchool and schoolData */}
        <StudentList dbname={verifiedSchool || ''} schoolData={schoolData} />
      </Suspense>
    </div>
  );
};

export default StudentManagementSection;

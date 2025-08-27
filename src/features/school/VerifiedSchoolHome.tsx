import React, { useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useGlobalState } from '../../context/GlobalState';
import { getSchoolBySubdomain, createDatabase } from './api/school.api';
import { useSchoolInfo } from './hooks/useSchoolInfo';
import { viewReducer, type ViewState } from './reducers/ViewReducer';
import SchoolHeader from './components/Layout/SchoolHeader';
import SchoolCover from './components/Layout/SchoolCover';
import ErrorState from './components/UI/ErrorState';
import LoadingState from './components/UI/LoadingState';
import WelcomeSection from './components/UI/WelcomeSection';
import QuickStats from './components/Layout/QuickStats';
import ActionCardsSection from './components/Layout/ActionCardsSection';
import CoursesSection from './components/Layout/CoursesSection';
import StudentManagementSection from './components/Layout/StudentManagementSection';
import LoadingSchoolDashboard from './components/UI/LoadingSchoolDashboard';
const SchoolHome: React.FC = () => {
  const { isDarkMode } = useGlobalState();
  const navigate = useNavigate();
  const { verifiedSchool } = useParams();
  const { state, dispatch, school, setSchool } = useSchoolInfo(verifiedSchool);
  const [activeView, dispatchView] = useReducer(viewReducer, 'dashboard' as ViewState);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      if (!verifiedSchool) {
        dispatch({ type: 'FETCH_ERROR', payload: '❌ School identifier is missing in URL.' });
        return;
      }

      try {
        dispatch({ type: 'FETCH_START' });
        let token=Cookies.get('accessToken')
        const res = await getSchoolBySubdomain(verifiedSchool,token);
        const schoolData = res.data.school;
console.log("Fetched school data:", schoolData);

        setSchool(schoolData);
        Cookies.set('schoolData', JSON.stringify(schoolData), { expires: 1 });
        Cookies.set('dbname', verifiedSchool);

        await createDatabase(verifiedSchool,token);
      } catch (err) {
        console.error('❌ Error fetching school:', err);
        dispatch({ type: 'FETCH_ERROR', payload: 'Unable to fetch school details. Please try again later.' });
      }
    };

    fetchSchoolInfo();
  }, [verifiedSchool]);

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');
      const schoolData = Cookies.get('schoolData');

      if (!accessToken || !refreshToken || !schoolData) {
        navigate('/schoolLogin');
      }
    };

    const interval = setInterval(() => {
      checkAuth();
    }, 100);

    const timeout = setTimeout(() => {
      checkAuth();
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  if (state.error) {
    return <ErrorState error={state.error} />;
  }

  if (!school) {
    return <LoadingSchoolDashboard />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
    >
      <SchoolHeader school={school} setSchool={setSchool} />
      <SchoolCover school={school} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'dashboard' ? (
          <>
            <WelcomeSection schoolName={school.name} />
            <QuickStats isDarkMode={isDarkMode} />
            <ActionCardsSection dispatchView={dispatchView} />
            <CoursesSection schoolId={school._id} />
          </>
        ) : activeView === 'students' ? (
<StudentManagementSection schoolData={school} dispatchView={dispatchView} />
        ) : null}
      </div>
    </div>
  );
};

export default SchoolHome;

import React, { useEffect,  lazy, Suspense, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useGlobalState } from '../../context/GlobalState';
import { getSchoolBySubdomain, createDatabase, } from './api/school.api';
import { useSchoolInfo } from '../school/hooks/useSchoolInfo';
import { viewReducer, type ViewState } from './reducers/ViewReducer';

const SchoolCourses = lazy(() => import('./components/UI/SchoolCourses'));
const StudentList = lazy(() => import('./components/UI/StudentList'));


const SchoolHome: React.FC = () => {
  const { isDarkMode } = useGlobalState();
  const navigate = useNavigate();
  const { verifiedSchool } = useParams();
  const { state, dispatch, school, setSchool } = useSchoolInfo(verifiedSchool);
const [activeView, dispatchView] = useReducer(viewReducer, 'dashboard');

  
  useEffect(() => {
    const fetchSchoolInfo = async () => {
      if (!verifiedSchool) {
        dispatch({ type: 'FETCH_ERROR', payload: '❌ School identifier is missing in URL.' });
        return;
      }

      try {
        dispatch({ type: 'FETCH_START' });
        const res = await getSchoolBySubdomain(verifiedSchool);
        const schoolData = res.data.school;

        setSchool(schoolData);
        Cookies.set('schoolData', JSON.stringify(schoolData), { expires: 1 });
        Cookies.set('dbname', verifiedSchool);

        await createDatabase(verifiedSchool);
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
  }, []);

  const handleLogout = () => {
    ['accessToken', 'refreshToken', 'schoolData'].forEach((key) => Cookies.remove(key));
    setSchool(null);
    navigate('/schoolLogin');
  };

  // ✨ UI States
  if (state.error) {
    return <div className="p-10 text-center text-red-600 text-lg">{state.error}</div>;
  }

  if (!school) {
    return <p className="p-10 text-center text-lg text-gray-700">Loading school info...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">School Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Cover + Logo */}
      {/* Cover + Logo */}
      <div className="relative">
        {/* Profile Button */}
        <button
          onClick={() => navigate(`/school/${verifiedSchool}/profile`)}
          className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          Profile
        </button>

        <img src={school.coverImage} alt="Cover" className="w-full h-60 object-cover" loading="lazy" />

        <div className="absolute -bottom-12 left-6">
          <img
            src={school.image}
            alt="School Logo"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            loading="lazy"
          />
        </div>
      </div>


      {activeView === 'dashboard' ? (
        <>
          {/* Main Grid */}
          <div className="mt-16 px-6">
            <h1 className="text-3xl font-bold mb-6">Welcome, {school.name}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              <Card title="Add Course" onClick={() => navigate(`/school/${verifiedSchool}/addCourse`)}>
                Create and publish new courses.
              </Card>

              <Card title="Enrolled Students" onClick={() => dispatchView({ type: 'SHOW_STUDENTS' })}>
                View and manage your students.
              </Card>


              <Card title="Payments">
                Track course payments and dues.
              </Card>
            </div>
          </div>

          {/* School Courses */}
          <div className="mt-10">
            <Suspense fallback={<p className="text-center text-gray-500 mt-6">Loading courses...</p>}>
              <SchoolCourses schoolId={school._id} dbname={verifiedSchool || ''} />
            </Suspense>
          </div>
        </>
      ) : activeView === 'students' ? (
        <div className="mt-10 px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Enrolled Students</h2>
            <button
              onClick={() => dispatchView({ type: 'SHOW_DASHBOARD' })}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Back to Dashboard
            </button>

          </div>
          <Suspense fallback={<p className="text-center text-gray-500">Loading students...</p>}>
            <StudentList dbname={verifiedSchool || ''} />
          </Suspense>
        </div>
      ) : null}
    </div>
  );
};

export default SchoolHome;

// 🧩 Reusable Card Component
const Card: React.FC<{ title: string; onClick?: () => void; children: React.ReactNode }> = ({
  title,
  onClick,
  children,
}) => (
  <div
    className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition cursor-pointer"
    onClick={onClick}
  >
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-600">{children}</p>
  </div>
);

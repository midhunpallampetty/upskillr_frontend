import { useReducer, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminDashboardReducer,
  initialAdminDashboardState,
} from '../../reducers/adminDashboardReducer';
import { Cookie } from 'lucide-react';
import Cookies from 'js-cookie';
import useAdminAuthGuard from '../../hooks/useAdminAuthGuard';

const SchoolGrid = lazy(() => import('../../../school/components/UI/SchoolGrid'));

const ManageStudents = () => (
  <div className="text-center text-gray-600">
    📋 Student Management UI (Coming soon...)
  </div>
);

const ManageContent = () => (
  <div className="text-center text-gray-600">
    📚 Content Management UI (Coming soon...)
  </div>
);

const AdminDashboard = () => {
  useAdminAuthGuard()
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(
    adminDashboardReducer,
    initialAdminDashboardState
  );

  const handleLogout = () => {
    localStorage.removeItem('admin');
    Cookies.remove('adminAccessToken');
    Cookies.remove('adminRefreshToken');

    dispatch({ type: 'RESET' });
    navigate('/adminRegister');
  };

  const renderContent = () => {
    return (
      <Suspense fallback={<p className="text-center text-gray-400">Loading...</p>}>
        {
          {
            students: <ManageStudents />,
            schools: <SchoolGrid />,
            content: <ManageContent />,
            welcome: (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  Welcome to the Admin Dashboard
                </h2>
                <img
                  src="/admin.png"
                  alt="Admin Illustration"
                  className="w-80 mx-auto rounded shadow"
                />
              </div>
            ),
          }[state.activeSection]
        }
      </Suspense>
    );
  };

  const getSectionDescription = () => {
    switch (state.activeSection) {
      case 'students':
        return 'Manage student data and accounts.';
      case 'schools':
        return 'View, approve, and edit schools.';
      case 'content':
        return 'Manage uploaded content and resources.';
      default:
        return 'Here’s a quick overview and tools to manage the platform.';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
          <p className="text-sm text-slate-300">Dashboard Controls</p>
        </div>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => dispatch({ type: 'SET_SECTION', payload: 'students' })}
            className={`bg-slate-800 py-2 px-4 rounded hover:bg-slate-700 text-left ${
              state.activeSection === 'students' ? 'bg-slate-700' : ''
            }`}
          >
            🎓 Manage Students
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_SECTION', payload: 'schools' })}
            className={`bg-slate-800 py-2 px-4 rounded hover:bg-slate-700 text-left ${
              state.activeSection === 'schools' ? 'bg-slate-700' : ''
            }`}
          >
            🏫 Manage Schools
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_SECTION', payload: 'content' })}
            className={`bg-slate-800 py-2 px-4 rounded hover:bg-slate-700 text-left ${
              state.activeSection === 'content' ? 'bg-slate-700' : ''
            }`}
          >
            📚 Manage Content
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 py-2 px-4 rounded hover:bg-red-700"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Welcome, Admin 👋</h2>
          <p className="text-gray-500">{getSectionDescription()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

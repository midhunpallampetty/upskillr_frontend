import { useReducer, lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminDashboardReducer,
  AdminSection,
  initialAdminDashboardState,
} from '../../reducers/adminDashboardReducer';
import { 
  Users, 
  School, 
  BookOpen, 
  LogOut, 
  Home,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu
} from 'lucide-react';
import Cookies from 'js-cookie';
import useAdminAuthGuard from '../../hooks/useAdminAuthGuard';

const SchoolGrid = lazy(() => import('./SchoolGrid'));

const StatsCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  useAdminAuthGuard();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(
    adminDashboardReducer,
    initialAdminDashboardState
  );
  const [showDropdown, setShowDropdown] = useState(false);

  // Set initial section to 'schools' on component mount to show SchoolGrid by default
  useEffect(() => {
    dispatch({ type: 'SET_SECTION', payload: 'schools' });
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    Cookies.remove('adminAccessToken');
    Cookies.remove('adminRefreshToken');

    dispatch({ type: 'RESET' });
    navigate('/adminLogin');
  };

  type NavItem = {
    id: AdminSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>; // Assumes Lucide icons (adjust if needed)
  };

  const navigationItems: NavItem[] = [
    { id: 'schools', label: 'Schools', icon: School },
  ];

  const renderContent = () => {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        {
          {
            schools: <SchoolGrid />,
          }[state.activeSection]
        }
      </Suspense>
    );
  };

  const getPageTitle = () => {
    switch (state.activeSection) {
      case 'students':
        return 'Student Management';
      case 'schools':
        return 'School Management';
      case 'content':
        return 'Content Management';
      default:
        return 'Dashboard Overview';
    }
  };

  const getPageDescription = () => {
    switch (state.activeSection) {
      case 'students':
        return 'Manage student accounts, track progress, and handle enrollments';
      case 'schools':
        return 'Review school applications, manage institutions, and monitor activity';
      case 'content':
        return 'Upload, review, and manage educational content and resources';
      default:
        return 'Welcome to your admin control center. Monitor key metrics and manage your platform.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">Education Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => dispatch({ type: 'SET_SECTION', payload: item.id })}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    state.activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    state.activeSection === item.id ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-gray-600 mt-1">{getPageDescription()}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="profile-dropdown relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center focus:outline-none"
                  >
                    <span className="text-white text-sm font-medium">A</span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[600px]">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

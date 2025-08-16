import { useReducer, lazy, Suspense } from 'react';
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

const ManageStudents = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-gray-800">Student Management</h3>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
        Add Student
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        icon={Users} 
        title="Total Students" 
        value="2,847" 
        subtitle="+12% from last month"
        color="blue"
      />
      <StatsCard 
        icon={Users} 
        title="Active Students" 
        value="2,643" 
        subtitle="92.8% active rate"
        color="green"
      />
      <StatsCard 
        icon={Users} 
        title="New This Month" 
        value="284" 
        subtitle="+24% increase"
        color="purple"
      />
      <StatsCard 
        icon={BarChart3} 
        title="Completion Rate" 
        value="87.2%" 
        subtitle="+5.3% improvement"
        color="orange"
      />
    </div>
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Recent Student Activity</h4>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="text-center py-12 text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>Student management interface coming soon...</p>
      </div>
    </div>
  </div>
);

const ManageContent = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-gray-800">Content Management</h3>
      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
        Upload Content
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        icon={BookOpen} 
        title="Total Courses" 
        value="156" 
        subtitle="+8 this month"
        color="purple"
      />
      <StatsCard 
        icon={BookOpen} 
        title="Published" 
        value="142" 
        subtitle="91% published"
        color="green"
      />
      <StatsCard 
        icon={BookOpen} 
        title="Draft Content" 
        value="14" 
        subtitle="9% in draft"
        color="orange"
      />
      <StatsCard 
        icon={BarChart3} 
        title="Views This Month" 
        value="45.2K" 
        subtitle="+18% increase"
        color="blue"
      />
    </div>
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center py-12 text-gray-500">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>Content management system coming soon...</p>
      </div>
    </div>
  </div>
);

const WelcomeDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        icon={Users} 
        title="Total Users" 
        value="3,247" 
        subtitle="+12% from last month"
        color="blue"
      />
      <StatsCard 
        icon={School} 
        title="Active Schools" 
        value="89" 
        subtitle="+3 new schools"
        color="green"
      />
      <StatsCard 
        icon={BookOpen} 
        title="Course Content" 
        value="156" 
        subtitle="8+ added this week"
        color="purple"
      />
      <StatsCard 
        icon={BarChart3} 
        title="Monthly Growth" 
        value="+15.3%" 
        subtitle="Above target"
        color="orange"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New school registration</p>
              <p className="text-xs text-gray-500">Lincoln High School - 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Content approved</p>
              <p className="text-xs text-gray-500">Mathematics Course - 15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New student batch</p>
              <p className="text-xs text-gray-500">45 students enrolled - 1 hour ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-sm text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <Settings className="w-5 h-5 text-blue-200" />
        </div>
        <div className="space-y-3">
          <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-left transition-all">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5" />
              <span className="font-medium">Manage Students</span>
            </div>
          </button>
          <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-left transition-all">
            <div className="flex items-center space-x-3">
              <School className="w-5 h-5" />
              <span className="font-medium">Review Schools</span>
            </div>
          </button>
          <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-left transition-all">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Upload Content</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  useAdminAuthGuard();
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
type NavItem = {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>; // Assumes Lucide icons (adjust if needed)
};

const navigationItems: NavItem[] = [
  { id: 'welcome', label: 'Dashboard', icon: Home },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'schools', label: 'Schools', icon: School },
  { id: 'content', label: 'Content', icon: BookOpen },
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
            students: <ManageStudents />,
            schools: <SchoolGrid />,
            content: <ManageContent />,
            welcome: <WelcomeDashboard />,
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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
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
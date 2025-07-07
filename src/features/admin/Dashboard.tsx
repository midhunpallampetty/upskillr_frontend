import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SchoolGrid from '../school/components/SchoolGrid';
// Dummy components — Replace with actual implementations
const ManageStudents = () => <div>📋 Student Management UI</div>;
const ManageContent = () => <div>📚 Content Management UI</div>;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('welcome');

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/adminRegister');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'students':
        return <ManageStudents />;
      case 'schools':
        return <SchoolGrid />;
      case 'content':
        return <ManageContent />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to the Admin Dashboard</h2>
            <img
              src="/admin.png"
              alt="Admin Illustration"
              className="w-80 mx-auto rounded shadow"
            />
          </div>
        );
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
            onClick={() => setActiveSection('students')}
            className={`bg-slate-800 py-2 px-4 rounded hover:bg-slate-700 text-left ${
              activeSection === 'students' ? 'bg-slate-700' : ''
            }`}
          >
            🎓 Manage Students
          </button>
          <button
            onClick={() => setActiveSection('schools')}
            className={`bg-slate-800 py-2 px-4 rounded hover:bg-slate-700 text-left ${
              activeSection === 'schools' ? 'bg-slate-700' : ''
            }`}
          >
            🏫 Manage Schools
          </button>
          <button
            onClick={() => setActiveSection('content')}
            className={`bg-slate-800 py-2 px-4 rounded hover:bg-slate-700 text-left ${
              activeSection === 'content' ? 'bg-slate-700' : ''
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
          <p className="text-gray-500">
            {activeSection === 'welcome'
              ? 'Here’s a quick overview and tools to manage the platform.'
              : `You’re viewing: ${activeSection.replace(/^./, c => c.toUpperCase())}`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

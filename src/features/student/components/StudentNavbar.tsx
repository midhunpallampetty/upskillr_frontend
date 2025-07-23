import React, { useState, useRef, useEffect } from 'react';
import { LogOut, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Student {
  fullName?: string;
}

interface StudentNavbarProps {
  student: Student | null;
  handleLogout: () => void;
}

const StudentNavbar: React.FC<StudentNavbarProps> = ({ student, handleLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfile = () => {
    closeDropdown();
    navigate('/student/profile');
  };

  const handleHome = () => {
    navigate('/studenthome');
  };

  return (
    <nav className="bg-white shadow-sm border-b relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div
            onClick={handleHome}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Upskillr</h1>
              <p className="text-xs text-gray-500">E-Learning Platform</p>
            </div>
          </div>

          {/* Student Info & Logout */}
          <div className="flex items-center space-x-4">
            <div
              ref={dropdownRef}
              className="relative hidden md:flex items-center space-x-3 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {student?.fullName?.charAt(0).toLowerCase() || 'g'}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{student?.fullName?.toLowerCase() || 'guest'}</p>
                <p className="text-gray-500">Student</p>
              </div>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-12 right-0 bg-white shadow-lg border rounded-lg w-40 py-2 z-50">
                  <button
                    onClick={handleProfile}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    Profile
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;

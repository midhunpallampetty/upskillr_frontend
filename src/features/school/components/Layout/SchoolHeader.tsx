import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GraduationCap, User, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import { useGlobalState } from '../../../../context/GlobalState';
import { SchoolHeaderProps } from '../../types/SchoolHeaderProps';


const SchoolHeader: React.FC<SchoolHeaderProps> = ({ school, setSchool }) => {
  const { isDarkMode } = useGlobalState();
  const navigate = useNavigate();
  const { verifiedSchool } = useParams();

  const handleLogout = () => {
    ['accessToken', 'refreshToken', 'schoolData'].forEach((key) => Cookies.remove(key));
    setSchool(null);
    navigate('/schoolLogin');
  };

  return (
    <header
      className={`backdrop-blur-lg border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900/80 border-gray-700/20' : 'bg-white/80 border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-xl font-bold transition-colors duration-300 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'
                  }`}
                >
                  School Dashboard
                </h1>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Manage your institution
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/school/${verifiedSchool}/profile`)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SchoolHeader;
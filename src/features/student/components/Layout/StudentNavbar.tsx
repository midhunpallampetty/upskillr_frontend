import React, { useState, useRef, useEffect } from 'react';
import { LogOut, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSchoolBySubdomain } from '../../../school/api/school.api'; // Adjust the import path to match your project structure (e.g., the api folder where this function exists)
import { getCoursesBySchool } from '../../../school/api/course.api'; // Assuming this is the import for the new API function; adjust path accordingly
import Cookies from 'js-cookie';

// Embedded utility function to extract subdomain
const getSubdomain = (url: string = window.location.href): string => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[parts.length - 2] === 'eduvia' && parts[parts.length - 1] === 'space') {
      return parts.slice(0, -2).join('.');
    }
    return '';
  } catch (error) {
    console.error('Error extracting subdomain:', error);
    return '';
  }
};

// Utility function to slugify school name for URL
const slugify = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '');
};

// Define interface for course objects based on your API structure
interface Course {
  _id: string;
  courseName: string;
  isPreliminaryRequired: boolean;
  courseThumbnail: string;
  fee: number;
  isDeleted: boolean;
  sections: any[]; // Adjust type as needed
  school: string;
  description: string;
  preliminaryExam: any; // Adjust type
  finalExam: any; // Adjust type
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Interface for Student (matching StudentNavbar)
interface Student {
  fullName?: string;
  image: string;
}

// Interface for SchoolData (to type schoolData)
interface SchoolData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  foundedYear: string;
  studentsGraduated: string;
  successRate: string;
  subDomain: string;
  experience: string;
  image: string;
  coverImage: string;
  coursesOffered: any[];
}

// Separate Navbar Component
const SchoolMarketingNavbar: React.FC<{
  schoolData: SchoolData;
  subdomain: string;
  student: Student | null;
  isLoggedIn: boolean;
  handleLogout: () => void;
  handleLogin: () => void;
}> = ({ schoolData, subdomain, student, isLoggedIn, handleLogout, handleLogin }) => {
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
    navigate('/profile');
  };

  const handleHome = () => {
    navigate(`/school/${slugify(subdomain)}/home`); // Adapted for school subdomain
  };

  return (
    <nav className="bg-white shadow-sm border-b relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title (School-specific) */}
          <div
            onClick={handleHome}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <img 
                src={schoolData.image || 'https://images7.alphacoders.com/463/463447.jpg'} 
                alt={`${schoolData.name} Logo`} 
                className="w-10 h-10 rounded-lg object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{schoolData.name || 'EduVia Academy'}</h1>
              <p className="text-xs text-gray-500">E-Learning Platform</p>
            </div>
          </div>

          {/* Student Info & Logout (if logged in) or Login button */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div
                  ref={dropdownRef}
                  className="relative hidden md:flex items-center space-x-3 cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    {student ? (
                      <img
                        src={student.image || 'https://as1.ftcdn.net/jpg/01/68/80/20/1000_F_168802075_Il6LeUG0NCK4JOELmkC7Ki81g0CiLpxU.jpg'}
                        alt="student avatar"
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://as1.ftcdn.net/jpg/01/68/80/20/1000_F_168802075_Il6LeUG0NCK4JOELmkC7Ki81g0CiLpxU.jpg';
                        }}
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                        G
                      </span>
                    )}
                  </div>

                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{student?.fullName?.toLowerCase() || 'Guest'}</p>
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
                      <button
                        onClick={() => {
                          closeDropdown();
                          navigate('/student/purchased-courses');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                      >
                        My Courses
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
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SchoolMarketingNavbar;

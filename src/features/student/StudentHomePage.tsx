  import React, { useEffect, useState } from 'react';
  import Cookies from 'js-cookie';
  import { useNavigate } from 'react-router-dom';
  import {
    Search, LogOut, GraduationCap, Clock, BookOpen, ChevronLeft, ChevronRight
  } from 'lucide-react';
  import { getAllSchools } from './api/student.api';
  import { School } from './types/School';
  import { Student } from './types/School';

  const ITEMS_PER_PAGE = 6;

  const StudentHomePage: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [student, setStudent] = useState<Student | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
      const token = Cookies.get('studentAccessToken');
      if (!token) {
        navigate('/studentlogin');
      }
    }, [navigate]);

    useEffect(() => {
      const stored = localStorage.getItem('student');
      if (stored) setStudent(JSON.parse(stored));
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const allSchools = await getAllSchools();
          setSchools(allSchools);
        } catch (error) {
          console.error('Error fetching schools:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    const handleLogout = () => {
      Cookies.remove('studentAccessToken');
      Cookies.remove('studentRefreshToken');
      localStorage.removeItem('student');
      navigate('/studentlogin');
    };
const extractSubdomain = (fullUrl: string) => {
  const url = new URL(fullUrl);
  const hostParts = url.hostname.split('.');

  // Handle localhost-based subdomain routing: subdomain.localhost
  if (hostParts.length >= 2 && hostParts[1] === 'localhost') {
    return hostParts[0]; // returns "orangeschool"
  }

  // Handle normal domains like sub.domain.com
  return hostParts.length > 2 ? hostParts[0] : '';
};

const handleSchoolClick = (schoolUrl: string) => {
  const subDomain = extractSubdomain(schoolUrl);
  navigate(`/school/${subDomain}/home`);
};



    const filteredSchools = schools.filter(
      (school) =>
        school.isVerified &&
        school.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filteredSchools.slice(start, start + ITEMS_PER_PAGE);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Upskillr</h1>
                  <p className="text-xs text-gray-500">E-Learning Platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {student?.fullName?.charAt(0) || 'G'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{student?.fullName || 'Guest'}</p>
                    <p className="text-gray-500">Student</p>
                  </div>
                </div>
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

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Welcome to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Your Learning Journey
                </span>
              </h2>
              <p className="text-xl text-blue-100 mb-6">
                Discover verified schools, explore courses, and unlock your future.
              </p>
              <div className="text-sm text-blue-100">
                <span className="mr-4">🎓 {filteredSchools.length} Verified Schools</span>
                <span>📚 Quality Education</span>
              </div>
            </div>
            <img
              src="/images/students/student_home.png"
              alt="student learning"
              className="rounded-xl shadow-lg hidden lg:block h-64 object-cover"
            />
          </div>
        </section>

        {/* Search Section */}
        <section className="bg-white border-b py-6 px-4">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for schools, courses, or specializations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* School Cards */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading schools...</div>
          ) : paginated.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map((school) => (
                <div
                  key={school._id}
                  onClick={() => handleSchoolClick(school.subDomain)}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={school.image}
                    alt={school.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{school.name}</h3>
                    <div className="text-sm text-gray-600 flex justify-between mb-2">
                      <span><Clock className="inline w-4 h-4" /> {school.experience} yrs</span>
                      <span><BookOpen className="inline w-4 h-4" /> 0  students</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      Courses: {school.coursesOffered.slice(0, 3).join(', ')}
                      {school.coursesOffered.length > 3 && ` +${school.coursesOffered.length - 3} more`}
                    </div>
                    <div className="text-sm flex justify-between items-center pt-2 border-t">
                      {/* <span className="text-yellow-500">
                        {'★'.repeat(Math.floor(Number(3)) + '☆'.repeat(5 - Math.floor(5))}
                      </span> */}
                      <button className="text-blue-600 hover:underline text-sm">View Courses</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-gray-500">No schools found for this search.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    );
  };

  export default StudentHomePage;

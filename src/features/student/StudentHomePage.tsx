import React, { useEffect, useState, ChangeEvent } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  Search, LogOut, GraduationCap, Clock, BookOpen, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { getAllSchools } from './api/student.api';
import { School } from './types/School';
import { Student } from './types/School';
import StudentNavbar from './components/Layout/StudentNavbar';
import useStudentAuthGuard from './hooks/useStudentAuthGuard';

const ITEMS_PER_PAGE = 6;

const StudentHomePage: React.FC = () => {
  useStudentAuthGuard();
  const [schoolData, setSchoolData] = useState<{
    schools: School[];
    total: number;
    totalPages: number;
    currentPage: number;
    count: number;
  }>({
    schools: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [student, setStudent] = useState<Student | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('student');
    if (stored) setStudent(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllSchools({
          search,
          sortBy,
          sortOrder,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          fromDate,
          toDate,
          isVerified: true, // Explicitly filter for verified schools
        });

        // Client-side filtering for extra safety
        const verifiedSchools = response.schools.filter((school: School) => school.isVerified === true);

        // Apply client-side sorting if sorting by name (case-insensitive)
        let sortedSchools = verifiedSchools;
        if (sortBy === 'name') {
          sortedSchools = [...verifiedSchools].sort((a, b) => {
            const compareResult = a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
            return sortOrder === 'asc' ? compareResult : -compareResult;
          });
        }

        setSchoolData({
          ...response,
          schools: sortedSchools,
          total: sortedSchools.length, // Update total to reflect filtered count
          totalPages: Math.ceil(sortedSchools.length / ITEMS_PER_PAGE), // Recalculate total pages
        });
      } catch (error) {
        console.error('Error fetching schools:', error);
        setSchoolData({
          schools: [],
          total: 0,
          totalPages: 1,
          currentPage: 1,
          count: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, sortBy, sortOrder, currentPage, fromDate, toDate]);

  const handleLogout = () => {
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    localStorage.removeItem('student');
    navigate('/studentlogin');
  };

  const extractSubdomain = (fullUrl: string) => {
    const url = new URL(fullUrl);
    const hostParts = url.hostname.split('.');

    // Handle localhost-based subdomain routing
    if (hostParts.length >= 2 && hostParts[1] === 'localhost') {
      return hostParts[0];
    }

    // Handle normal domains
    return hostParts.length > 2 ? hostParts[0] : '';
  };

  const handleSchoolClick = (schoolUrl: string) => {
    const subDomain = extractSubdomain(schoolUrl);
    navigate(`/school/${subDomain}/home`);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortOrder] = e.target.value.split(':');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as 'asc' | 'desc');
    setCurrentPage(1);
  };

  const handleFromDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
    setCurrentPage(1);
  };

  const handleToDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <StudentNavbar student={student} handleLogout={handleLogout} />

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
            <div className="text-sm text-blue-100 mb-6">
              <span className="mr-4">🎓 {schoolData.total} Verified Schools</span>
              <span>📚 Quality Education</span>
            </div>
            <a
              href="/forum"
              className="inline-block px-6 py-3 text-lg font-semibold text-blue-900 bg-yellow-300 rounded-lg shadow hover:bg-yellow-400 transition-colors"
            >
              Wanna start discussion with other learners? Visit Forum
            </a>
          </div>
          <img
            src="/images/students/student_home.png"
            alt="student learning"
            className="rounded-xl shadow-lg hidden lg:block h-64 object-cover"
          />
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b py-6 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, address, city, state, country, etc."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={handleSortChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
              <option value="experience:asc">Experience (Low-High)</option>
              <option value="experience:desc">Experience (High-Low)</option>
            </select>
          </div>

          {/* From Date */}
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              placeholder="From Date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* To Date */}
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              placeholder="To Date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* School Cards */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading schools...</div>
        ) : schoolData.schools.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schoolData.schools.map((school) => (
              <div
                key={school._id}
                onClick={() => handleSchoolClick(school.subDomain || '')}
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
                    <span><BookOpen className="inline w-4 h-4" /> 0 students</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span>{school.address}, {school.city}, {school.state}, {school.country}</span>
                  </div>
                  <div className="text-sm flex justify-between items-center pt-2 border-t">
                    <button className="text-blue-600 hover:underline text-sm">View Courses</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">No verified schools found for this search.</p>
        )}

        {/* Pagination */}
        {schoolData.totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: schoolData.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(schoolData.totalPages, prev + 1))}
              disabled={currentPage === schoolData.totalPages}
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
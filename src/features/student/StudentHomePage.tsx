import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getAllSchools } from './api/student.api'; 
import { School } from './types/School';
import { Student } from './types/School';

const ITEMS_PER_PAGE = 5;

const StudentHomePage: React.FC = () => {
  const navigate = useNavigate();

  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const token = Cookies.get('studentAccessToken');
    if (!token) navigate('/studentlogin');
  }, [navigate]);

  useEffect(() => {
    const stored = localStorage.getItem('student');
    if (stored) setStudent(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allSchools = await getAllSchools();
      setSchools(allSchools);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    localStorage.removeItem('student');
    navigate('/studentlogin');
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1A2E46] text-white flex flex-col items-center py-6">
        <div className="mb-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-500 mb-2" />
          <span className="font-semibold text-lg">{student?.fullName ?? 'Guest'}</span>
        </div>
        <nav className="space-y-4 w-full px-6">
          <span className="block text-white bg-white/10 px-4 py-2 rounded-md">Schools</span>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white p-4 flex justify-end">
          <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Logout
          </button>
        </div>

        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-800 text-white px-10 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome to</h1>
            <h2 className="text-3xl font-bold">E Learning Platform</h2>
          </div>
          <img
            src="/images/students/student_home.png"
            alt="learning"
            className="h-40 bg-blue-500/50 rounded-md"
          />
        </section>

        {/* Search */}
        <section className="p-6 bg-gradient-to-r from-sky-100 to-blue-100">
          <input
            type="text"
            placeholder="Search verified schools..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 rounded border"
          />
        </section>

        {/* School List */}
        <section className="p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading schools...</p>
          ) : paginated.length ? (
            <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-4">School</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Courses Offered</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((school) => (
                  <tr
                    key={school._id}
                    onClick={() =>
                      navigate(`/school/${encodeURIComponent(school.subDomain)}/courses`)
                    }
                    className="border-t cursor-pointer hover:bg-gray-100"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img src={school.image} alt="school" className="w-10 h-10 rounded-full" />
                      {school.name}
                    </td>
                    <td className="p-4">{school.experience} yrs</td>
                    <td className="p-4">{school.coursesOffered.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No verified schools found.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentHomePage;

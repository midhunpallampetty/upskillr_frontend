import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface School {
  _id: string;
  name: string;
  image: string;
  experience: string;
  coursesOffered: string[];
  isVerified: boolean;
}

const ITEMS_PER_PAGE = 5;

const StudentHomePage = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = Cookies.get('studentAccessToken');
    if (!token) {
      navigate('/studentlogin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get('http://school.localhost:5000/api/getSchools');
        console.log('API Response:', res.data);
  
        const schoolList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.schools)
          ? res.data.schools
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
  
        setSchools(schoolList);
      } catch (err) {
        console.error('Error fetching schools:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSchools();
  }, []);
  

  const handleLogout = () => {
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    localStorage.removeItem('student');
    navigate('/studentlogin');
  };

  const verifiedSchools = schools.filter(
    (school) =>
      school.isVerified &&
      school.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(verifiedSchools.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSchools = verifiedSchools.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1A2E46] text-white flex flex-col items-center py-6">
        <div className="mb-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-500 mb-2" />
          <span className="font-semibold text-lg">Robin J</span>
        </div>
        <nav className="space-y-4 w-full px-6">
          <a href="#" className="block text-white bg-white/10 px-4 py-2 rounded-md">Schools</a>
          <a href="#" className="block text-white hover:bg-white/10 px-4 py-2 rounded-md">Classes</a>
          <a href="#" className="block text-white hover:bg-white/10 px-4 py-2 rounded-md">Courses</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white p-4 flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={handleLogout}
          >
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
            src="https://www.clipartmax.com/png/full/198-1985660_students-clipart-transparent-background.png"
            alt="learning"
            className="h-24"
          />
        </section>

        {/* Search Bar */}
        <section className="p-6 bg-gradient-to-r from-sky-100 to-blue-100">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search verified schools..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 p-2 rounded border"
            />
          </div>
        </section>

        {/* School List */}
        <section className="p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading schools...</p>
          ) : paginatedSchools.length > 0 ? (
            <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-4">School</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Courses Offered</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSchools.map((school) => (
                  <tr key={school._id} className="border-t">
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
            <p className="text-center text-gray-500 mt-6">No verified schools found.</p>
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

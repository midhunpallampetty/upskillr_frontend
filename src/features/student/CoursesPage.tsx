import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCoursesBySchool } from './api/course.api';
import { Course } from './types/Course';
import { ChevronLeft, ChevronRight, BookOpen, Clock } from 'lucide-react';
import useStudentAuthGuard from './hooks/useStudentAuthGuard';
import { useGlobalDispatch } from '../../context/GlobalState';
import Cookies from 'js-cookie';

const ITEMS_PER_PAGE = 6;

const CoursesPage: React.FC = () => {
  const dispatch = useGlobalDispatch();

  useStudentAuthGuard()
  const { schoolName } = useParams();
  localStorage.setItem('schoolname',schoolName);
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!schoolName) return;

    const decodedUrl = decodeURIComponent(schoolName);
    Cookies.set('dbname',schoolName)
      dispatch({ type: 'SET_SCHOOL_NAME', payload: decodedUrl }); 
    console.log(decodedUrl, "decodedUrl")
    const getCourses = async () => {
      const result = await fetchCoursesBySchool("http://" + decodedUrl + '.localhost:5173');

      if (result.success && result.courses) {
        setCourses(result.courses);
      } else {
        console.error('Error fetching courses:', result.error);
      }

      setLoading(false);
    };

    getCourses();
  }, [schoolName]);

  const filteredCourses = useMemo(() => {
    const term = search.toLowerCase();

    return courses
      .filter(
        (course) =>
          course.courseName.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        if (sortOption === 'name') {
          return a.courseName.localeCompare(b.courseName);
        } else if (sortOption === 'fee') {
          return a.fee - b.fee;
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [courses, search, sortOption]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Courses at{' '}
              <span className="block text-yellow-300">
                {decodeURIComponent(schoolName || '')}
              </span>
            </h2>
            <p className="text-blue-100 text-lg mb-4">
              Browse all available courses and discover the right one for you.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-block bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              ⬅ Back to Schools
            </button>
          </div>
          <img
            src="/images/students/student_home.png"
            alt="Courses"
            className="rounded-xl shadow-lg hidden md:block h-64 object-cover"
          />
        </div>
      </section>

      {/* Search & Sort */}
      <section className="bg-white border-b py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search for courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="fee">Sort by Fee</option>
          </select>
        </div>
      </section>

      {/* Courses */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center text-gray-500">Loading courses...</div>
        ) : paginatedCourses.length ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer"
                >
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseName}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {course.courseName}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    <div className="text-sm text-gray-600 mt-3 flex justify-between">
                      <span><BookOpen className="inline w-4 h-4 mr-1" /> {course.noOfLessons} Lessons</span>
                      <span>₹{course.fee}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Created on {new Date(course.createdAt).toLocaleDateString('en-IN')}
                    </p>
                    <button
                      onClick={() => {
                        dispatch({ type: 'SET_COURSE', payload: JSON.stringify(course) });
                        navigate(`/school/${schoolName}/course/${course._id}`);
                      }}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition"
                    >
                      View Details
                    </button>


                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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
                  className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
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
          </>
        ) : (
          <p className="text-center text-gray-500 py-10 text-3xl font-semibold">No courses found for this school.</p>
        )}
      </section>
    </div>
  );
};

export default CoursesPage;

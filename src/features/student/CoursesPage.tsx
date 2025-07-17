import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCoursesBySchool } from './api/course.api';
import { Course } from './types/Course';

const ITEMS_PER_PAGE = 6;

const CoursesPage: React.FC = () => {
  const { schoolName } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date'); // date, name, fee
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!schoolName) return;

    const decodedUrl = decodeURIComponent(schoolName);

    const getCourses = async () => {
      const result = await fetchCoursesBySchool(decodedUrl);

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
    const term = searchTerm.toLowerCase();

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
  }, [courses, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-blue-800">Courses Offered</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          ⬅ Back
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
        {/* <input
          type="text"
          placeholder="Search courses..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}

        <select
          className="w-full md:w-48 px-4 py-2 border rounded-md"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="fee">Sort by Fee</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading courses...</p>
      ) : filteredCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={course.courseThumbnail}
                  alt={course.courseName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-blue-800 mb-1">
                    {course.courseName}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Lessons:</span> {course.noOfLessons}
                  </div>

                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Fee:</span> ₹{course.fee}
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Created on {new Date(course.createdAt).toLocaleDateString('en-IN')}
                  </p>
                  <button className="bg-green-600 align-middle text-white font-extrabold p-3 m-3 rounded-md">
                    View more Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
            <button
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No courses available for this school.</p>
      )}
    </div>
  );
};

export default CoursesPage;
  
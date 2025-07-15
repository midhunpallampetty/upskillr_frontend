import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCoursesBySchool } from './api/course.api'; 
import { Course } from './types/Course';


const CoursesPage: React.FC = () => {
  const { schoolName } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800">Courses Offered</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          ⬅ Back
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading courses...</p>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
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
                  <span className="font-medium">Lessons:</span>{' '}
                  {course.noOfLessons}
                </div>

                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Fee:</span> ₹{course.fee}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Created on{' '}
                  {new Date(course.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No courses available for this school.</p>
      )}
    </div>
  );
};

export default CoursesPage;

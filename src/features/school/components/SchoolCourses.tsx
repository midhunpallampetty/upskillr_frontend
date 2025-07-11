import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Course } from '../types/Course';
import { Props } from '../types/Props';
import { getCoursesBySchool } from '../api/course.api';
import { useNavigate } from 'react-router-dom';

interface Section {
  _id: string;
  sectionName: string;
  examRequired: boolean;
}

const SchoolCourses: React.FC<Props> = ({ schoolId, dbname }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const navigate = useNavigate(); // 👈 for routing

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await getCoursesBySchool(schoolId, dbname);
        setCourses(courseList);
      } catch (err) {
        console.error('❌ Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId && dbname) {
      fetchCourses();
    }
  }, [schoolId, dbname]);

  const handleCourseClick = async (course: Course) => {
    setSelectedCourse(course);
    setLoadingSections(true);
    try {
      const res = await axios.get(
        `http://course.localhost:5000/api/${dbname}/courses/${course._id}/sections`
      );
      setSections(res.data.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch sections:', err);
    } finally {
      setLoadingSections(false);
    }
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setSections([]);
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading courses...</p>;
  }

  return (
    <div className="p-6">
      {!selectedCourse ? (
        <>
          <h2 className="text-xl font-bold mb-4">🎓 Courses Offered</h2>
          {courses.length === 0 ? (
            <p className="text-gray-600">No courses added yet.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition"
                  onClick={() => handleCourseClick(course)}
                >
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseName}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-semibold">{course.courseName}</h3>
                  <p className="text-gray-500">
                    ₹{course.fee} • {course.noOfLessons} Lessons
                  </p>
                  <p className="text-sm text-gray-600">
                    {course.isPreliminaryRequired ? 'Preliminary Required' : 'Open to All'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
          >
            ← Back to Courses
          </button>
          <h2 className="text-xl font-bold mb-4">
            📘 Sections for {selectedCourse.courseName}
          </h2>
          {loadingSections ? (
            <p className="text-gray-600">Loading sections...</p>
          ) : sections.length === 0 ? (
            <p className="text-gray-500">No sections available for this course.</p>
          ) : (
            <ul className="space-y-4">
              {sections.map((section) => (
                <li
                  key={section._id}
                  className="p-4 bg-white rounded shadow border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-lg font-semibold">{section.sectionName}</h4>
                    <p className="text-sm text-gray-500">
                      {section.examRequired ? '📝 Exam Required' : '✅ No Exam'}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/school/${dbname}/section/${section._id}/add-video`)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm shadow"
                  >
                    ➕ Add Video
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default SchoolCourses;

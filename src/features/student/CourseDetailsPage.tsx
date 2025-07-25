import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState, useSetStudent } from '../../context/GlobalState';
import StudentNavbar from './components/StudentNavbar';
import Cookies from 'js-cookie';
import { getSectionsByCourse } from '../school/api/course.api';

const CourseSkeleton = () => (
  <div className="animate-pulse px-4 md:px-10 py-6">
    <div className="bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl shadow-lg mb-10 flex flex-col md:flex-row items-center">
      <div className="w-full md:w-1/2 h-72 bg-gray-300 rounded-md" />
      <div className="p-8 md:w-1/2 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white border rounded-lg p-5 shadow-md">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

const CourseDetailsPage: React.FC = () => {
  const { student, schoolName, course } = useGlobalState();
  const setStudent = useSetStudent();
  const [parsedCourse, setParsedCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [videocount, setVideoCount] = useState(0);
  const navigate = useNavigate();

  const [imgSrc, setImgSrc] = useState<string>(
    'https://t3.ftcdn.net/jpg/08/06/10/36/360_F_806103697_E9Y1vKhtQimCEIiA75QWEn4NdZe7lQXj.jpg'
  );

  // Navigate to payment page
  const handleClick = (courseId: string) => {
    navigate(`/purchase`);
  };

  // ✅ Load student from localStorage into global state
  useEffect(() => {
    const stored = localStorage.getItem('student');
    if (stored) {
      setStudent(JSON.parse(stored));
    }
  }, [setStudent]);

  // ✅ Count videos across sections
  useEffect(() => {
    const totalVideos = sections.reduce((count, section) => {
      return count + (section.videos?.length || 0);
    }, 0);
    setVideoCount(totalVideos);
  }, [sections]);

  // ✅ Load course and sections
  useEffect(() => {
    const loadCourse = async () => {
      try {
        let parsed = null;

        if (course) {
          parsed = JSON.parse(course);
          localStorage.setItem('selectedCourse', course);
        } else {
          const local = localStorage.getItem('selectedCourse');
          parsed = local ? JSON.parse(local) : null;
        }

        setParsedCourse(parsed);

        if (parsed?.courseThumbnail) {
          setImgSrc(parsed.courseThumbnail);
        }

        if (parsed?.school && parsed?._id) {
          const sectionList = await getSectionsByCourse(schoolName, parsed._id);
          setSections(sectionList);
        }
      } catch (err) {
        console.error('Error loading course or sections:', err);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    loadCourse();
  }, [course, schoolName]);

  // ✅ Logout handler
  const handleLogout = () => {
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    localStorage.removeItem('student');
    setStudent(null); // clear from global context
    navigate('/studentlogin');
  };

  if (loading) return <CourseSkeleton />;

  if (!parsedCourse)
    return <div className="text-center py-10 text-red-500">Course not found</div>;

  return (
    <>
      <StudentNavbar student={student} handleLogout={handleLogout} />

      <div className="bg-white min-h-screen pt-6 pb-16 px-4 md:px-10">
        {/* Banner */}
        <div className="bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center mb-10">
          <img
            src={imgSrc}
            alt={parsedCourse.courseName || 'Course Thumbnail'}
            className="w-full md:w-1/2 h-72 rounded-md object-cover"
            onError={() =>
              setImgSrc(
                'https://t3.ftcdn.net/jpg/08/06/10/36/360_F_806103697_E9Y1vKhtQimCEIiA75QWEn4NdZe7lQXj.jpg'
              )
            }
          />
          <div className="p-8 md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              {parsedCourse.courseName}
            </h1>
            <p className="text-gray-700 text-lg mb-4">
              {parsedCourse.description?.trim()
                ? parsedCourse.description
                : 'No course description available.'}
            </p>
            <p className="text-sm text-gray-500">
              Created on {new Date(parsedCourse.createdAt).toLocaleDateString()}
            </p>

            {/* ✅ Buy Now / Enroll Button */}
            {parsedCourse.fee === 0 ? (
              <button
                onClick={() => handleClick(parsedCourse._id)}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Enroll for Free
              </button>
            ) : (
              <button
                onClick={() => handleClick(parsedCourse._id)}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
              >
                Buy Now for ₹{parsedCourse.fee}
              </button>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-800">
          <div className="bg-white border rounded-lg p-5 shadow-md">
            <h2 className="text-md font-semibold text-gray-700 mb-2">Course Fee</h2>
            <p className="text-blue-600 text-lg font-bold">₹{parsedCourse.fee}</p>
          </div>

          <div className="bg-white border rounded-lg p-5 shadow-md">
            <h2 className="text-md font-semibold text-gray-700 mb-2">Preliminary Required</h2>
            <p>{parsedCourse.isPreliminaryRequired ? 'Yes' : 'No'}</p>
          </div>

          <div className="bg-white border rounded-lg p-5 shadow-md">
            <h2 className="text-md font-semibold text-gray-700 mb-2">No. of Videos</h2>
            <p>{videocount}</p>
          </div>

          <div className="bg-white border rounded-lg p-5 shadow-md">
            <h2 className="text-md font-semibold text-gray-700 mb-2">School</h2>
            <p>{schoolName}</p>
          </div>

          {/* Detailed Sections */}
          <div className="bg-white border rounded-lg p-5 shadow-md col-span-1 md:col-span-2">
            <h2 className="text-md font-semibold text-gray-700 mb-4">Sections</h2>
            {sections.length > 0 ? (
              <ul className="space-y-4">
                {sections.map((section, index) => (
                  <li key={index} className="bg-gray-50 p-4 rounded shadow-sm border">
                    <h3 className="text-lg font-semibold text-indigo-700">
                      {section.sectionName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Exam Required: {section.examRequired ? 'Yes' : 'No'}
                    </p>
                    {section.exam && (
                      <p className="text-sm text-gray-600">Exam: {section.exam}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No sections available.</p>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsPage;

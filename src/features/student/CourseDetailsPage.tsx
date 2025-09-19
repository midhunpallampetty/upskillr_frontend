import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseSkeleton from './components/UI/CourseSkeleton';
import { useGlobalState, useSetStudent } from '../../context/GlobalState';
import StudentNavbar from './components/Layout/StudentNavbar';
import Cookies from 'js-cookie';
import { getSectionsByCourse } from '../school/api/course.api';
import { useSetCourse } from '../../context/GlobalState';
import { checkPreviousPurchase } from './api/course.api';

const CourseDetailsPage: React.FC = () => {
  // Use useParams for cleaner, reactive course ID extraction
  const { courseId: extractedCourseId } = useParams<{ courseId: string }>();

  const setCourse = useSetCourse();
  const { student, schoolName, course } = useGlobalState();
  const setStudent = useSetStudent();
  const [parsedCourse, setParsedCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [videocount, setVideoCount] = useState(0);
  const [isPurchased, setIsPurchased] = useState(false);
  const navigate = useNavigate();

  const [imgSrc, setImgSrc] = useState<string>(
    'https://t3.ftcdn.net/jpg/08/06/10/36/360_F_806103697_E9Y1vKhtQimCEIiA75QWEn4NdZe7lQXj.jpg'
  );

  // Use navigate for SPA-friendly navigation (avoids full reload)
  const handleClick = (id: string) => {
    console.log(`Navigating - Course ID: ${id}, Is Purchased: ${isPurchased}`);
    localStorage.removeItem('selectedCourse'); // Force reload fresh
    if (isPurchased) {
      navigate(`/student/course-page/${schoolName}/${id}`);
    } else {
      navigate(`/student/payment/${id}`);
    }
  };

  // Load student from localStorage (runs once)
  useEffect(() => {
    const stored = localStorage.getItem('student');
    if (stored) {
      setStudent(JSON.parse(stored));
    }
  }, [setStudent]);

  // Count videos (runs only when sections change)
  useEffect(() => {
    const totalVideos = sections.reduce((count, section) => {
      return count + (section.videos?.length || 0);
    }, 0);
    setVideoCount(totalVideos);
  }, [sections]);

  // Check purchase status (depends on stable IDs)
  useEffect(() => {
    const run = async () => {
      console.log(`Checking purchase - Student ID: ${student?._id}, Course ID: ${extractedCourseId}`);
      if (!student?._id || !extractedCourseId) {
        console.log('Purchase check skipped: Missing student or course ID');
        setIsPurchased(false);
        return;
      }
      try {
        const { hasPurchased } = await checkPreviousPurchase(extractedCourseId, student._id);
        setIsPurchased(hasPurchased);
        console.log(`Purchase status: ${hasPurchased ? 'Purchased' : 'Not purchased'}`);
      } catch (err) {
        console.error('Error checking purchase status:', err);
        setIsPurchased(false);
        console.log('Purchase status: Error occurred - assuming not purchased');
      }
    };
    run();
  }, [extractedCourseId, student?._id]);

  // Load course and sections (stabilized dependencies, no artificial timeout)
  useEffect(() => {
    const loadCourse = async () => {
      if (!extractedCourseId) {
        console.error('No courseId extracted from URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        let selectedCourse = null;

        // Try localStorage first
        const local = localStorage.getItem('selectedCourse');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed._id === extractedCourseId) {
            selectedCourse = parsed;
          }
        }

        // Fallback to context if needed
        if (!selectedCourse && course) {
          const parsed = JSON.parse(course);
          if (parsed._id === extractedCourseId) {
            selectedCourse = parsed;
            if (local !== course) {
              localStorage.setItem('selectedCourse', course);
            }
          }
        }

        // Only update if we have a valid course
        if (selectedCourse) {
          setParsedCourse(selectedCourse);
          const stringified = JSON.stringify(selectedCourse);
          if (stringified !== course) {
            setCourse(stringified);
          }
          if (selectedCourse.courseThumbnail) {
            setImgSrc(selectedCourse.courseThumbnail);
          }

          if (selectedCourse.school && selectedCourse._id) {
            const sectionList = await getSectionsByCourse(schoolName, selectedCourse._id);
            setSections(sectionList);
          } else {
            setSections([]);
          }
        }
      } catch (err) {
        console.error('Error loading course or sections:', err);
      } finally {
        setLoading(false); // Set immediately when done (no delay)
      }
    };

    loadCourse();
  }, [extractedCourseId, schoolName, setCourse, course]); // Added 'course' back safely with checks inside to prevent loops

  // Logout handler
  const handleLogout = () => {
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    localStorage.removeItem('student');
    setStudent(null);
    navigate('/studentlogin');
  };

  if (loading) return <CourseSkeleton />;

  if (!parsedCourse || !extractedCourseId)
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

            {/* Buy Now / Enroll / Open Course Button */}
            {isPurchased ? (
              <button
                onClick={() => handleClick(parsedCourse._id)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Open Course
              </button>
            ) : parsedCourse.fee === 0 ? (
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
            <h2 className="text-md font-semibold text-gray-700 mb-4">Curriculum</h2>
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
              <p className="text-sm text-gray-600">No sections available.</p>
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

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, Video, DollarSign, BookOpen } from 'lucide-react';
import StudentNavbar from './components/Layout/StudentNavbar';
import Cookies from 'js-cookie';
import Footer from './components/Layout/Footer';
import useStudentAuthGuard from './hooks/useStudentAuthGuard';
import { fetchPurchasedCourses } from './api/course.api';

type CourseData = {
  schoolName: string;
  course: {
    _id: string;
    courseName: string;
    fee: number;
    noOfLessons: number;
    courseThumbnail: string;
  };
};

const PurchasedCourses = () => {
  useStudentAuthGuard();
  const [student, setStudent] = useState<any>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('student');
    if (stored) {
      const parsed = JSON.parse(stored);
      setStudent(parsed);
      fetchCourses(parsed._id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCourses = async (studentId: string) => {
    try {
  const data = await fetchPurchasedCourses(studentId);
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    localStorage.removeItem('student');
    
    navigate('/studentlogin');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
        {/* Navbar */}
        <div className="shadow bg-white sticky top-0 z-50">
          <StudentNavbar student={student} handleLogout={handleLogout} />
        </div>

        {/* Heading */}
        <div className="text-center mt-10">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Your <span className="text-purple-600">Purchased Courses</span>
          </h1>
          <p className="text-gray-500 mt-2">Enjoy your learning journey 🎓</p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-12 px-4 pb-20">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 text-lg">
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 text-lg">
              You haven't purchased any courses yet. 🧐<br />
              Explore available courses and start learning today!
            </div>
          ) : (
            courses.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
              >
                <img
                  src={item.course.courseThumbnail}
                  alt={item.course.courseName}
                  className="h-40 w-full object-cover"
                />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
                      <School className="w-5 h-5 text-purple-600" />
                      {item.schoolName}
                    </h2>
                    <p className="flex items-center text-sm text-gray-600 mb-1">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                      {item.course.courseName}
                    </p>
                    <p className="flex items-center text-sm text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                      ₹{item.course.fee}
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <Video className="w-4 h-4 mr-2 text-red-500" />
                      {item.course.noOfLessons} videos
                    </p>
                  </div>
                  <Link
                    to={`/student/course-page/${item.schoolName}/${item.course._id}`}
                    className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-semibold transition"
                  >
                    ▶ Watch Now
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PurchasedCourses;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, Video, DollarSign, BookOpen } from 'lucide-react';
import SchoolMarketingNavbar from '../student/components/Layout/StudentNavbar'; // Adjust import path to match your project structure (using SchoolMarketingNavbar as in MarketingPage)
import Cookies from 'js-cookie';
import Footer from './components/Layout/Footer';
import useStudentAuthGuard from './hooks/useStudentAuthGuard';
import { fetchPurchasedCourses } from './api/course.api';
import { getSchoolBySubdomain } from '../school/api/school.api'; // Import from MarketingPage

// Embedded utility function to extract subdomain (from MarketingPage)
const getSubdomain = (url: string = window.location.href): string => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[parts.length - 2] === 'eduvia' && parts[parts.length - 1] === 'space') {
      return parts.slice(0, -2).join('.');
    }
    return '';
  } catch (error) {
    console.error('Error extracting subdomain:', error);
    return '';
  }
};

// Utility function to slugify school name for URL (from MarketingPage)
const slugify = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '');
};

// Interface for Student (from MarketingPage)
interface Student {
  fullName?: string;
  image: string;
}

// Define interface for course objects (adjusted from MarketingPage)
interface Course {
  _id: string;
  courseName: string;
  isPreliminaryRequired: boolean;
  courseThumbnail: string;
  fee: number;
  isDeleted: boolean;
  sections: any[]; // Adjust type as needed
  school: string;
  description: string;
  preliminaryExam: any; // Adjust type
  finalExam: any; // Adjust type
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // States from MarketingPage
  const [schoolData, setSchoolData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    foundedYear: '',
    studentsGraduated: '',
    successRate: '',
    subDomain: '', // Note: This is 'subDomain' to match API casing, but we'll use 'subdomain' for consistency
    experience: '',
    image: '',
    coverImage: '',
    coursesOffered: [] // Keep empty initially; will be set from API
  });

  // New state for subdomain (computed once on mount)
  const [subdomain, setSubdomain] = useState<string>(getSubdomain());

  // State to check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for tokens in localStorage (from MarketingPage)
    const accessToken = Cookies.get('studentAccessToken');
    const refreshToken = Cookies.get('studentRefreshToken');
    setIsLoggedIn(!!accessToken && !!refreshToken);
  }, []);

  // Fetch student data if logged in (from MarketingPage, adjusted)
  useEffect(() => {
    if (isLoggedIn) {
      const fetchStudent = async () => {
        try {
          const token = Cookies.get('studentAccessToken');
          if (token) {
            const response = localStorage.getItem('student'); // Assume this API returns { data: { student: { fullName, image } } }
            setStudent(JSON.parse(response || '{}'));
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
          setStudent(null); // Fallback
        }
      };
      fetchStudent();
    } else {
      setStudent(null);
    }
  }, [isLoggedIn]);

  // Fetch school data based on subdomain (from MarketingPage)
  useEffect(() => {
    if (subdomain) {
      const fetchSchoolData = async () => {
        try {
          // Replace with actual token retrieval (e.g., from auth context, localStorage, etc.)
          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGQ4YjI5NDRhMzg4N2E4MjJkNTg2YiIsImVtYWlsIjoieWljZXdhYjkzOUBsaXRlcGF4LmNvbSIsInJvbGUiOiJzY2hvb2wiLCJzdWJEb21haW4iOiJodHRwOi8vZ2FtZXJzY2x1Yi5lZHV2aWEuc3BhY2UiLCJpYXQiOjE3NTU5NjMyMjUsImV4cCI6MTc1NTk2MzI4NX0.1GcqFwkWRABUA6RvFdNjTZaRZHCQY-djW8SIeslT4es'; // Implement proper token handling
          console.log(subdomain, 'subdomain');

          const response = await getSchoolBySubdomain(subdomain, token);
          console.log(response.data.school, 'response');

          const data = response.data.school; // Adjust based on axios response structure

          // Check if school data exists; if not, redirect
          if (!data) {
            window.location.href = 'https://eduvia.space';
            return;
          }

          const updatedData = {
            id: data._id || '',
            name: data.name || '',
            email: data.email || '',
            phone: data.officialContact || '',
            address: data.address || '',
            description: data.description || '', // If not provided by API, remains empty
            foundedYear: data.createdAt ? new Date(data.createdAt).getFullYear().toString() : '',
            studentsGraduated: data.studentsGraduated || '', // If not provided, empty
            successRate: data.successRate || '', // If not provided, empty
            experience: data.experience || '',
            image: data.image || '',
            subDomain: data.subDomain || '', // API provides 'subDomain'
            coverImage: data.coverImage || '',
            coursesOffered: [] // Initialize empty; will be updated if needed
          };

          setSchoolData(updatedData);
          console.log(updatedData, 'data'); // Log after setting state (note: state update is async, use callback if needed for immediate logging)
        } catch (error) {
          console.error('Error fetching school data:', error);
          // Optionally handle error by redirecting as well
          window.location.href = 'https://eduvia.space';
        }
      };
      fetchSchoolData();
    } else {
      // If no subdomain, redirect
      window.location.href = 'https://eduvia.space';
    }
  }, [subdomain]); // Depend on subdomain state

  // Original fetch student data and courses
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = Cookies.get('studentAccessToken');
        if (token) {
          const response = localStorage.getItem('student'); // Assume this API returns { data: { student: { ... } } }
          const fetchedStudent = JSON.parse(response);
          setStudent(fetchedStudent);
          localStorage.setItem('student', JSON.stringify(fetchedStudent)); // Optional: cache in localStorage
          fetchCourses(fetchedStudent._id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudent(null);
        setLoading(false);
      }
    };
    fetchStudentData();
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

  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/studentLogin'; // Adjust the login URL as needed
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
        {/* Navbar (updated to use SchoolMarketingNavbar with all props from MarketingPage) */}
        <div className="shadow bg-white sticky top-0 z-50">
          <SchoolMarketingNavbar 
            schoolData={schoolData} 
            subdomain={subdomain} 
            student={student} 
            isLoggedIn={isLoggedIn} 
            handleLogout={handleLogout} 
            handleLogin={handleLogin} 
          />
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

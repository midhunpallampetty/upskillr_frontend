import React, { useEffect, useState } from 'react';
import { getSchoolBySubdomain } from './api/school.api'; // Adjust the import path to match your project structure (e.g., the api folder where this function exists)
import { getCoursesBySchool } from './api/course.api'; // Assuming this is the import for the new API function; adjust path accordingly
import Cookies from 'js-cookie';
import SchoolMarketingNavbar from '../student/components/Layout/StudentNavbar'; // Adjust the import path to where SchoolMarketingNavbar is located

// Embedded utility function to extract subdomain
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

// Utility function to slugify school name for URL
const slugify = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '');
};

// Define interface for course objects based on your API structure
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

// Interface for Student (matching StudentNavbar)
interface Student {
  fullName?: string;
  image: string;
}

const MarketingPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
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

  // State for student data (to display in navbar if logged in)
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    // Check for tokens in localStorage
    const accessToken = Cookies.get('studentAccessToken');
    const refreshToken = Cookies.get('studentRefreshToken');
    setIsLoggedIn(!!accessToken && !!refreshToken);
  }, []);

  // Fetch student data if logged in
  useEffect(() => {
    if (isLoggedIn) {
      const fetchStudent = async () => {
        try {
          const token = Cookies.get('studentAccessToken');
          if (token) {
            const response = localStorage.getItem('student')// Assume this API returns { data: { student: { fullName, image } } }
            
            setStudent(JSON.parse(response));
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
            coursesOffered: [] // Initialize empty; will be updated below
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

  // Separate useEffect to fetch courses after schoolData is updated
  useEffect(() => {
    if (schoolData.id && schoolData.name) {
      const fetchCourses = async () => {
        try {
          const schoolId = schoolData.id;
          console.log(schoolData.name, 'school name');
          const dbname = getSubdomain(schoolData.subDomain); // Use schoolData.subDomain as dbname (note casing)
          console.log(dbname, 'dbname');
          
          const coursesResponse = await getCoursesBySchool(schoolId, dbname);
          console.log(coursesResponse, 'courses response');

          // Set the full course objects
          const fetchedCourses = (coursesResponse?.data?.courses || coursesResponse || []).filter((course: Course) => course.courseName); // Filter out any invalid courses
          console.log(fetchedCourses, 'fetched courses');

          setCourses(fetchedCourses);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };
      fetchCourses();
    }
  }, [schoolData]); // Depend on schoolData to run after it's updated

  console.log(schoolData, 'school data');

  // SEO and meta tag updates
  useEffect(() => {
    if (schoolData.name) {
      document.title = `${schoolData.name} - Transform Your Career with Expert-Led Courses`;
    }
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && schoolData.description) {
      metaDescription.setAttribute('content', `${schoolData.description} Join ${schoolData.studentsGraduated || 'thousands of'} successful graduates. Flexible learning, industry certification, career support.`);
    } else if (schoolData.description) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = `${schoolData.description} Join ${schoolData.studentsGraduated || 'thousands of'} successful graduates.`;
      document.head.appendChild(meta);
    }

    const updateOrCreateMetaTag = (property: string, content: string) => {
      if (!content) return; // Skip if content is empty
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (metaTag) {
        metaTag.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMetaTag('og:title', `${schoolData.name} - Expert Learning Platform`);
    updateOrCreateMetaTag('og:description', schoolData.description);
    updateOrCreateMetaTag('og:url', 'https://eduvia.space');
    if (schoolData.image) {
      updateOrCreateMetaTag('og:image', schoolData.image);
    }
  }, [schoolData]);

  const handleLogout = () => {
    // Implement logout logic here, e.g., clear tokens, redirect, etc.
    console.log('Logging out...');
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    setIsLoggedIn(false);
    setStudent(null);
    window.location.href = '/studentLogin';
  };

  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/studentLogin'; // Adjust the login URL as needed
  };

  return (
    <div className="font-inter text-gray-800 leading-7 bg-gray-50 min-h-screen">
      {/* Use the separate Navbar component */}
      <SchoolMarketingNavbar 
        schoolData={schoolData} 
        subdomain={subdomain} 
        student={student} 
        isLoggedIn={isLoggedIn} 
        handleLogout={handleLogout} 
        handleLogin={handleLogin} 
      />

      {/* Enhanced Hero Section with Cover Image and Logo */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center text-white pt-16" // Added pt-16 to account for fixed navbar
        style={{
          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.85), rgba(147, 51, 234, 0.85)), url(${schoolData.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          {/* School Header with Logo */}
          <div className="text-center mb-12">
            {/* Logo Section */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src={schoolData.image || 'https://images7.alphacoders.com/463/463447.jpg'} 
                  alt={`${schoolData.name} Logo`} 
                  className="relative w-32 h-32 rounded-full border-4 border-white/40 shadow-2xl backdrop-blur-sm hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* School Name with Enhanced Typography */}
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 drop-shadow-lg">
                {schoolData.name || 'EduVia Academy'}
              </span>
            </h1>
            
            <div className="max-w-4xl mx-auto mb-8">
              {schoolData.description && (
                <p className="text-xl md:text-2xl font-light mb-8 text-blue-100 leading-relaxed line-clamp-2">
                  {schoolData.description}
                </p>
              )}
              
              {/* Enhanced Contact Information - Ensured all are displayed if available */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {schoolData.address && (
                  <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <span className="text-2xl">📍</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">Location</p>
                      <p className="text-blue-100 text-sm">{schoolData.address}</p>
                    </div>
                  </div>
                )}
                
                {schoolData.phone && (
                  <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <span className="text-2xl">📞</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">Call Us</p>
                      <p className="text-blue-100 text-sm">{schoolData.phone}</p>
                    </div>
                  </div>
                )}
                
                {schoolData.email && (
                  <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <span className="text-2xl">✉️</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">Email</p>
                      <p className="text-blue-100 text-sm">{schoolData.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - Added "Browse Courses" button */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              className="group bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-12 py-5 text-xl font-bold rounded-2xl hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => window.location.href = "#contact"}
            >
              <span className="flex items-center justify-center">
                💬 <span className="ml-2">Free Consultation</span>
              </span>
            </button>
            <button
              className="group bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-12 py-5 text-xl font-bold rounded-2xl hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => window.location.href = `/school/${slugify(subdomain)}/home`}
            >
              <span className="flex items-center justify-center">
                📚 <span className="ml-2">Browse Courses</span>
              </span>
            </button>
          </div>

          {/* Enhanced Trust Indicators (conditionally render based on available data) - Removed hardcoded one */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {schoolData.studentsGraduated && (
              <div className="text-center bg-gradient-to-br from-green-400 to-blue-500 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
                <div className="text-4xl mb-3 filter drop-shadow-lg">🎓</div>
                <div className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">{schoolData.studentsGraduated}</div>
                <div className="text-white/90 font-semibold text-sm">Successful Graduates</div>
              </div>
            )}
            {schoolData.successRate && (
              <div className="text-center bg-gradient-to-br from-purple-400 to-pink-500 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
                <div className="text-4xl mb-3 filter drop-shadow-lg">📈</div>
                <div className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">{schoolData.successRate}</div>
                <div className="text-white/90 font-semibold text-sm">Job Placement Rate</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Courses Section with API-provided courses - Removed dummy details */}
      {courses.length > 0 && (
        <section id="courses" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                  Our Premium Courses
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Master in-demand skills with our industry-aligned curriculum designed by experts from top companies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {courses.map((course, index) => {                
                const desc = course.description || '';
                
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-gradient-to-b from-purple-500 to-pink-500 hover:-translate-y-2 transform"
                    style={{
                      borderImage: 'linear-gradient(to bottom, #8B5CF6, #EC4899) 1'
                    }}
                  >
                    {/* Course Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-right">
                        <div className="text-gray-500 text-sm">Course {index + 1}</div>
                      </div>
                    </div>

                    {/* Course Thumbnail */}
                    {course.courseThumbnail && (
                      <img 
                        src={course.courseThumbnail} 
                        alt={course.courseName} 
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    )}

                    <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors leading-tight">
                      {course.courseName}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {desc.length > 20 ? desc.slice(0, 20) + "..." : desc}
                    </p>

                    {/* Additional Course Details */}
                    <div className="mb-6">
                      <p className="text-gray-700 font-semibold">Fee: ₹{course.fee}</p>
                      <p className="text-gray-500 text-sm">Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                      <p className="text-gray-500 text-sm">Last Updated: {new Date(course.updatedAt).toLocaleDateString()}</p>
                    </div>

                    {/* CTA Button - Updated to use subdomain and slugified schoolName */}
                    <button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 text-lg font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      onClick={() => window.location.href = `https://www.eduvia.space/${subdomain}/school/${slugify(schoolData.name)}/home`}
                    >
                      Start Learning Today →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced About Section - Removed dummy features */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Why Choose {schoolData.name || 'Us'}?
                </span>
              </h2>
              
              {(schoolData.experience || schoolData.foundedYear) && (
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  With <span className="font-bold text-blue-600">{schoolData.experience || 'many'}</span> years of experience since {schoolData.foundedYear || 'our founding'}, we've been transforming careers through cutting-edge education and practical skill development.
                </p>
              )}
            </div>

            {/* Right Column - Contact Card - Ensured logo, address, phone, email are prominently displayed */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-center mb-8">
                <img 
                  src={schoolData.image || 'https://images7.alphacoders.com/463/463447.jpg'} 
                  alt={`${schoolData.name || 'School'} Logo`} 
                  className="w-24 h-24 rounded-full border-4 border-white/30 mx-auto mb-4" 
                />
                <h3 className="text-3xl font-bold">Get In Touch</h3>
                <p className="text-blue-100 mt-2">Ready to start your journey?</p>
              </div>
              
              <div className="space-y-4">
                {schoolData.address && (
                  <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-blue-100 text-sm">{schoolData.address}</p>
                    </div>
                  </div>
                )}
                
                {schoolData.email && (
                  <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-blue-100">{schoolData.email}</p>
                    </div>
                  </div>
                )}
                
                {schoolData.phone && (
                  <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-blue-100">{schoolData.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="w-full mt-8 bg-white text-purple-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
                onClick={() => window.location.href = "#contact"}
              >
                Schedule a Call Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer - Removed social links and quick links */}
      <footer id="contact" className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={schoolData.image || 'https://images7.alphacoders.com/463/463447.jpg'} 
                  alt={`${schoolData.name || 'School'} Logo`} 
                  className="w-16 h-16 rounded-full border-2 border-purple-400" 
                />
                <h3 className="text-4xl font-black">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">
                    {schoolData.name || 'EduVia Academy'}
                  </span>
                </h3>
              </div>
              {schoolData.description && (
                <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                  {schoolData.description}
                </p>
              )}
              {(schoolData.studentsGraduated || schoolData.successRate || schoolData.foundedYear) && (
                <p className="text-lg text-purple-200">
                  🎯 {schoolData.studentsGraduated || 'Thousands of'} graduates • {schoolData.successRate || 'High'} success rate • Since {schoolData.foundedYear || '2015'}
                </p>
              )}
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-lg text-blue-200">
              © 2024 {schoolData.name || 'EduVia Academy'}. Empowering futures through education. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MarketingPage;

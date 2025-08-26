// Updated CoursePaymentPage.tsx
// Imports from the single courseApi.ts file for course-related helpers.
// Import checkEligibility from examApi.ts.
// Removed direct axios calls; using helpers instead.
// Assumed paths like '../../api/courseApi'; adjust based on your structure.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';
import { 
  Clock, 
  Users, 
  Award, 
  Play, 
  Download, 
  CheckCircle, 
  Star,
  BookOpen,
  Globe,
  Smartphone
} from 'lucide-react';

// Import helpers
import { fetchCourseData, initiateCheckout } from './api/course.api';
import { checkEligibility } from './api/exam.api';

// ⚠️ Use .env.local to store your public key securely
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

const CoursePaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const schoolName = localStorage.getItem('schoolname');
        if (!schoolName) {
          throw new Error('School name not found in localStorage.');
        }
        
        // Use helper for course data
        const response = await fetchCourseData(schoolName, courseId);
        setCourse(response);

        if (response.isPreliminaryRequired) {
          const studentStr = localStorage.getItem('student');
          const studentObj = studentStr ? JSON.parse(studentStr) : null;
          const studentId = studentObj?._id;

          if (!studentId) {
            throw new Error('Student ID not found in localStorage.');
          }

          // Use eligibility helper
          const eligResponse = await checkEligibility(studentId, courseId, 'final');

          if (eligResponse.success) {
            setEligibility(eligResponse.data);
          } else {
            throw new Error('Eligibility check failed.');
          }
        }
      } catch (err) {
        setError('Failed to fetch course data or check eligibility. Please try again.');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handlePayment = async () => {
    if (!course) {
      Swal.fire({
        title: 'Error',
        text: 'Course data is not available. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // 🧠 Get studentId from localStorage
    const studentStr = localStorage.getItem('student');
    const studentObj = studentStr ? JSON.parse(studentStr) : null;
    const studentId = studentObj?._id;

    if (!studentId) {
      Swal.fire({
        title: 'Error',
        text: 'Student ID not found. Please log in again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (course.isPreliminaryRequired === true) {
      if (eligibility.eligible) {
        Swal.fire({
          title: 'Preliminary Exam Required',
          text: 'You need to pass an exam before purchasing this course.',
          icon: 'info',
          confirmButtonText: 'Go to Exam',
          confirmButtonColor: '#3085d6',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/student/exam/take-exam?courseId=${courseId}`);
          }
        });
        return;
      } else if (eligibility.reason === 'lockout') {
        Swal.fire({
          title: 'Enrollment Locked',
          text: `You have exceeded the attempt limit. Please try again in ${eligibility.daysRemaining} days.`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
        return;
      }
      // If already_passed, proceed to payment
    }

    // ✅ Proceed to payment
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        Swal.fire({
          title: 'Error',
          text: 'Stripe failed to load. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      const schoolName = localStorage.getItem('schoolname');
      if (!schoolName) {
        Swal.fire({
          title: 'Error',
          text: 'School name not found. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      // Use checkout helper
      const response = await initiateCheckout(schoolName, courseId);

      const { url } = response;
      window.location.href = url;
    } catch (error) {
      console.error('Payment Error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Payment initiation failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">{error || 'Course not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Course Enrollment</h2>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Details - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-20 w-50 h-50">
                  <img
                    src={course.courseThumbnail || "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"}
                    alt="Course Thumbnail"
                    className="w-50 h-50 rounded-xl shadow-md"
                  />
                </div>
                <div className="md:w-2/3">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.courseName}</h1>
                  <p className="text-gray-600 text-lg mb-6">
                    {course.description?.split(' ').slice(0, 20).join(' ')}{course.description?.split(' ').length > 20 ? '...' : ''}
                  </p>
                  
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">{course.duration}</div>
                      <div className="text-xs text-gray-600">Duration</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Play className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">{course.lessons}</div>
                      <div className="text-xs text-gray-600">Lessons</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">{course.students?.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Students</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">{course.rating}</div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{course.rating}</span>
                    <span className="text-gray-600">({course.reviews?.toLocaleString()} reviews)</span>
                  </div>

                  {/* Course Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Level: </span>
                      <span className="font-semibold text-gray-900">{course.level}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Language: </span>
                      <span className="font-semibold text-gray-900">{course.language}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Updated: </span>
                      <span className="font-semibold text-gray-900">{course.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-World Projects */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Real-World Projects</h3>
              <div className="space-y-3">
                {course.projects?.map((project, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{project}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Course Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-gray-900">Total Lessons: </span>
                  {course.noOfLessons || 'N/A'}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Preliminary Required: </span>
                  {course.isPreliminaryRequired ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Deleted: </span>
                  {course.isDeleted ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-medium text-gray-900">School ID: </span>
                  {course.school}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Created At: </span>
                  {new Date(course.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Updated At: </span>
                  {new Date(course.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Card - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-3xl font-bold text-green-600">₹{course.fee}</span>
                  <span className="text-xl text-gray-500 line-through">₹{course.fee}</span>
                </div>
                <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {Math.round(((course.originalPrice - course.coursePrice) / course.originalPrice) * 100)}% OFF - Limited Time
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePayment}
                disabled={loading || (course.isPreliminaryRequired && eligibility?.reason === 'lockout')}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 transform ${
                  loading || (course.isPreliminaryRequired && eligibility?.reason === 'lockout')
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Enroll Now'
                )}
              </button>

              {course.isPreliminaryRequired && eligibility?.reason === 'lockout' && (
                <p className="text-center text-sm text-red-600 mt-3">
                  Enrollment locked. Please try again in {eligibility.daysRemaining} days.
                </p>
              )}

              <p className="text-center text-sm text-gray-500 mt-3">
                30-day money-back guarantee
              </p>

              {/* Features */}
              <div className="mt-8 space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg">This course includes:</h4>
                {course.features?.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Access Icons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-center space-x-6">
                  <div className="text-center">
                    <Smartphone className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Mobile</span>
                  </div>
                  <div className="text-center">
                    <Globe className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Desktop</span>
                  </div>
                  <div className="text-center">
                    <Download className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Offline</span>
                  </div>
                  <div className="text-center">
                    <Award className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Certificate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePaymentPage;

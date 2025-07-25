import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Course {
  id: string;
  courseName: string;
  courseDescription: string;
  courseThumbnail: string;
  coursePrice: number;
  isFree: boolean;
}

const DUMMY_COURSES: Course[] = [
  {
    id: 'abc123',
    courseName: 'React Mastery Bootcamp',
    courseDescription: 'Learn React from scratch to advanced level with projects.',
    courseThumbnail: 'https://via.placeholder.com/400x300.png?text=React+Course',
    coursePrice: 999,
    isFree: false,
  },
  {
    id: 'free456',
    courseName: 'Intro to HTML & CSS',
    courseDescription: 'A completely free course to get started with web development.',
    courseThumbnail: 'https://via.placeholder.com/400x300.png?text=HTML+%26+CSS',
    coursePrice: 0,
    isFree: true,
  },
];

const CoursePurchasePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  // 🧪 Simulate fetching course data
  useEffect(() => {
    const fetchCourse = () => {
      const found = DUMMY_COURSES.find((c) => c.id === courseId);
      if (!found) {
        toast.error('Course not found');
        navigate('/');
        return;
      }
      setCourse(found);
    };

    fetchCourse();
  }, [courseId, navigate]);

  // 🧪 Simulate purchase/enrollment
  const handlePurchase = async () => {
    if (!course) return;
    setLoading(true);

    setTimeout(() => {
      if (course.isFree) {
        toast.success('✅ Enrolled in the course!');
        navigate('/mycourses');
      } else {
        toast.info('💳 Redirecting to payment...');
        setTimeout(() => {
          toast.success('🎉 Payment successful!');
          navigate('/mycourses');
        }, 1000);
      }
      setLoading(false);
    }, 1500);
  };

  if (!course) return <div className="p-8 text-center">Loading course...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <img
          src={course.courseThumbnail}
          alt={course.courseName}
          className="w-full md:w-1/3 object-cover"
        />
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">{course.courseName}</h1>
            <p className="text-gray-600 mt-2">{course.courseDescription}</p>
            <p className="text-lg mt-4">
              {course.isFree ? (
                <span className="text-green-500 font-semibold">Free</span>
              ) : (
                <span className="text-indigo-600 font-semibold">₹{course.coursePrice}</span>
              )}
            </p>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className={`mt-6 ${
              loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white px-6 py-2 rounded transition`}
          >
            {loading
              ? 'Processing...'
              : course.isFree
              ? 'Enroll for Free'
              : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePurchasePage;

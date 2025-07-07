import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Course {
  _id: string;
  courseName: string;
  fee: number;
  courseThumbnail: string;
  noOfLessons: number;
  isPreliminaryRequired: boolean;
  sections: { title: string }[];
}

const SchoolCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const dbname = Cookies.get('dbname');
        const schoolId = JSON.parse(Cookies.get('schoolData') || '{}')._id;
        Cookies.set('id',schoolId);

        if (!dbname || !schoolId) {
          console.warn('School data missing.');
          return;
        }
        


let schoolID=Cookies.get('id');
console.log(schoolID,'hai')
   const response = await axios.get(
          `http://course.localhost:5000/api/${dbname}/courses?schoolId=${schoolID}`
        );

        setCourses(response.data.courses || []);
      } catch (err) {
        console.error('❌ Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-600">Loading courses...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🎓 Courses Offered</h2>
      {courses.length === 0 ? (
        <p className="text-gray-600">No courses added yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course._id} className="bg-white shadow rounded-lg p-4">
              <img
                src={course.courseThumbnail}
                alt={course.courseName}
                className="w-full h-32 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold">{course.courseName}</h3>
              <p className="text-gray-500">₹{course.fee} • {course.noOfLessons} Lessons</p>
              <p className="text-sm text-gray-600">
                {course.isPreliminaryRequired ? 'Preliminary Required' : 'Open to All'}
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                {course.sections.map((sec, idx) => (
                  <li key={idx}>{sec.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolCourses;

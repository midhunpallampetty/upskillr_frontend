import React, { useEffect, useState } from 'react';
import { getAllStudents, getPurchasedCoursesByStudent } from '../../api/student.api';
import PurchasedCoursesModal from './PurchasedCoursesModal';
import { fetchStudentProgress } from '../../../student/api/course.api';

type Student = {
  _id: string;
  fullName: string;
  email: string;
  createdAt?: string;
};

type School = {
  _id: string;
  name: string;
  subDomain?: string;
};

type Course = {
  _id: string;
  courseName: string;
  courseThumbnail: string;
  fee: number;
  createdAt: string;
};

const extractSubdomain = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    return parts.length > 2 ? parts[0] : '';
  } catch (error) {
    console.error('Invalid URL for subdomain extraction:', error);
    return '';
  }
};

interface StudentListProps {
  dbname: string;
  schoolData: School;
}

const StudentList: React.FC<StudentListProps> = ({ dbname, schoolData }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState<string>('');

  // Map of courseId to its student progress data
  const [studentProgressMap, setStudentProgressMap] = useState<Record<string, any>>({});
  const [progressError, setProgressError] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState(false);


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("Fetching students for DB:", schoolData);
        const schoolName = extractSubdomain(schoolData.subDomain || '') || schoolData.name;
        const data = await getAllStudents(schoolData._id, schoolName);
        console.log("Fetched students:", data);
        setStudents(data.students);
      } catch (err) {
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [dbname, schoolData]);

  const handleViewPurchasedCourses = async (studentId: string) => {
    if (!schoolData.subDomain && !schoolData.name) {
      setCoursesError("School info missing");
      return;
    }
    setIsModalOpen(true);
    setLoadingCourses(true);
    setCoursesError('');

    setStudentProgressMap({});
    setProgressError('');
    setLoadingProgress(true);

    const schoolName = extractSubdomain(schoolData.subDomain || '') || schoolData.name;

    try {
      const purchasedCoursesResponse = await getPurchasedCoursesByStudent(studentId, schoolName);
      const courses = purchasedCoursesResponse.courses;
      setPurchasedCourses(courses);

      const progressMap: Record<string, any> = {};

      // Fetch progress for each course
      await Promise.all(
        courses.map(async (course) => {
          const progressResponse = await fetchStudentProgress(schoolName, course._id, studentId);
          progressMap[course._id] = {
            videos: progressResponse.videos,
            passedSections: progressResponse.passedSections,
            finalExam: progressResponse.finalExam,
          };
        })
      );

      setStudentProgressMap(progressMap);
    } catch (err) {
      setCoursesError('Failed to load purchased courses');
      setProgressError('Failed to load student progress');
    } finally {
      setLoadingCourses(false);
      setLoadingProgress(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading students...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (students.length === 0) return <p className="text-center text-gray-500">No students enrolled yet.</p>;

  return (
    <>
      <div className="mt-8 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Enrolled Students</h2>
        <table className="w-full border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Full Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-t">
                <td className="px-4 py-2">{student.fullName}</td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleViewPurchasedCourses(student._id)}
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loadingCourses && <p className="text-center text-gray-600 mt-2">Loading purchased courses...</p>}
      {loadingProgress && <p className="text-center text-gray-600 mt-2">Loading student progress...</p>}

      {coursesError && <p className="text-center text-red-500 mt-2">{coursesError}</p>}
      {progressError && <p className="text-center text-red-500 mt-2">{progressError}</p>}

      <PurchasedCoursesModal
        isOpen={isModalOpen}
        courses={purchasedCourses}
        studentProgressMap={studentProgressMap}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default StudentList;

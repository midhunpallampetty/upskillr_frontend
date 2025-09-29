import React, { useState, useEffect } from 'react';
import { getAllStudents, getPurchasedCoursesByStudent } from '../../api/student.api';
import { fetchCourseData } from '../../../student/api/course.api';
import { fetchStudentProgress } from '../../../student/api/course.api';
import PurchasedCoursesModal from './PurchasedCoursesModal';

interface Student {
  _id: string;
  fullName: string;
  email: string;
}

interface School {
  _id: string;
  name: string;
  subDomain?: string;
}

interface Course {
  _id: string;
  courseName: string;
  courseThumbnail: string;
  fee: number;
  createdAt: string;
  sections?: Array<any>;
}

interface StudentListProps {
  dbname: string;
  schoolData: School;
}

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

const StudentList: React.FC<StudentListProps> = ({ dbname, schoolData }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [studentProgressMap, setStudentProgressMap] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const schoolName = extractSubdomain(schoolData.subDomain || '') || schoolData.name;
        const data = await getAllStudents(schoolData._id, schoolName);
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
      setError("School info missing");
      return;
    }
    setSelectedStudentId(studentId);
    setIsModalOpen(true);

    try {
      const schoolName = extractSubdomain(schoolData.subDomain || '') || schoolData.name;
      // Step 1: fetch purchased courses
      const purchasedResponse = await getPurchasedCoursesByStudent(studentId, schoolName);
      const courses = purchasedResponse.courses;

      // Step 2: Enrich each course with detailed sections and videos
      const detailedCourses = await Promise.all(
        courses.map(async (course: Course) => {
          const courseDetails = await fetchCourseData(schoolName, course._id);
          return {
            ...course,
            sections: courseDetails.sections || [],
            totalVideos: courseDetails.sections.reduce(
              (acc: number, sec: any) => acc + (sec.videos ? sec.videos.length : 0),
              0
            ),
            totalSections: courseDetails.sections.length,
          };
        })
      );

      // Step 3: Build progress map
      const newProgressMap: Record<string, any> = {};
      await Promise.all(
        detailedCourses.map(async (course) => {
          const progress = await fetchStudentProgress(schoolName, course._id, studentId);
          newProgressMap[course._id] = {
            videos: progress.videos || {},
            passedSections: progress.passedSections || [],
            finalExam: progress.finalExam || { passed: false, score: 0 },
            totalVideos: course.totalVideos,
            totalSections: course.totalSections,
          };
        })
      );

      setPurchasedCourses(detailedCourses);
      setStudentProgressMap(newProgressMap);
    } catch (error) {
      setError('Failed to load purchased courses or progress');
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

      <PurchasedCoursesModal
        isOpen={isModalOpen}
        courses={purchasedCourses}
        studentProgressMap={studentProgressMap}
        studentId={selectedStudentId || ''}
        schoolName={extractSubdomain(schoolData.subDomain || '') || schoolData.name}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default StudentList;

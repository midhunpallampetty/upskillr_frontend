import React, { useEffect, useState } from 'react';
import { getAllStudents } from '../../api/student.api';

type Student = {
  _id: string;
  fullName: string;
  email: string;
  createdAt?: string;
};

// Define type for schoolData (replace `any` with your actual school type)
type School = {
  _id: string;
  name: string;
  subDomain?: string;
  // add other fields if needed
};

interface StudentListProps {
  dbname: string;
  schoolData: School; // 🔹 new prop
}

const StudentList: React.FC<StudentListProps> = ({ dbname, schoolData }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("Fetching students for DB:", schoolData );
        // 🔹 Pass dbname and/or schoolData to API if needed
        const data = await getAllStudents( schoolData._id);
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

  if (loading) return <p className="text-center text-gray-600">Loading students...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (students.length === 0) return <p className="text-center text-gray-500">No students enrolled yet.</p>;

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Enrolled Students</h2>
      <table className="w-full border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Full Name</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Joined On</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-t">
              <td className="px-4 py-2">{student.fullName}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2">
                {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;

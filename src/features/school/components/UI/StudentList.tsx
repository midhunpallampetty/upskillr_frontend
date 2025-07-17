import React, { useEffect, useState } from 'react';
import { getAllStudents } from '../../api/student.api';

type Student = {
  _id: string;
  fullName: string;
  email: string;
  createdAt?: string;
};

const StudentList: React.FC<{ dbname: string }> = ({ dbname }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data.students);
      } catch (err) {
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [dbname]);

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
              <td className="px-4 py-2">{new Date(student.createdAt || '').toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;

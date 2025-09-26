import React from 'react';

type Course = {
  _id: string;
  courseName: string;
  courseThumbnail: string;
  fee: number;
  createdAt: string;
};

interface PurchasedCoursesModalProps {
  isOpen: boolean;
  courses: Course[];
  onClose: () => void;
}

const PurchasedCoursesModal: React.FC<PurchasedCoursesModalProps> = ({ isOpen, courses, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl mb-4 font-semibold">Purchased Courses</h3>
        <button onClick={onClose} className="mb-4 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">Close</button>
        {courses.length === 0 ? (
          <p>No courses purchased yet.</p>
        ) : (
          <ul>
            {courses.map(course => (
              <li key={course._id} className="flex items-center gap-4 mb-4 border-b pb-2">
                <img src={course.courseThumbnail} alt={course.courseName} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h4 className="font-bold">{course.courseName}</h4>
                  <p>Fee: ₹{course.fee}</p>
                  <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PurchasedCoursesModal;

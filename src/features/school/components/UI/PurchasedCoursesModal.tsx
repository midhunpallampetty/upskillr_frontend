import React from 'react';

type Course = {
  _id: string;
  courseName: string;
  courseThumbnail: string;
  fee: number;
  createdAt: string;
};

type VideoProgress = {
  completed: boolean;
  lastPosition: number;
  _id: string;
};

type PassedSection = {
  sectionId: string;
  score: number | null;
  passedAt: string;
  _id: string;
};

type FinalExam = {
  passed: boolean;
  score: number;
  passedAt: string;
};

interface PurchasedCoursesModalProps {
  isOpen: boolean;
  courses: Course[];
  studentProgress?: {
    videos: Record<string, VideoProgress>;
    passedSections: PassedSection[];
    finalExam: FinalExam;
  };
  onClose: () => void;
}

const PurchasedCoursesModal: React.FC<PurchasedCoursesModalProps> = ({ isOpen, courses, studentProgress, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl mb-4 font-semibold">Purchased Courses & Progress</h3>
        <button onClick={onClose} className="mb-4 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">Close</button>

        {courses.length === 0 ? (
          <p>No courses purchased yet.</p>
        ) : (
          <ul>
            {courses.map(course => {
              // Calculate video progress count and sections passed count for this course
              const videosOfCourse = studentProgress?.videos || {};
              const completedVideoCount = Object.values(videosOfCourse).filter(v => v.completed).length;
              const totalVideos = Object.keys(videosOfCourse).length;

              const passedSectionsCount = studentProgress?.passedSections?.length ?? 0;

              return (
                <li key={course._id} className="flex flex-col gap-2 mb-6 border-b pb-2">
                  <div className="flex items-center gap-4">
                    <img src={course.courseThumbnail} alt={course.courseName} className="w-20 h-20 object-cover rounded" />
                    <div>
                      <h4 className="font-bold">{course.courseName}</h4>
                      <p>Fee: ₹{course.fee}</p>
                      <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="ml-24 mt-2">
                    <p>Videos completed: {completedVideoCount} / {totalVideos}</p>
                    <p>Sections passed: {passedSectionsCount}</p>
                    {studentProgress?.finalExam && (
                      <p>
                        Final Exam: {studentProgress.finalExam.passed ? 'Passed' : 'Not Passed'} (
                        Score: {studentProgress.finalExam.score.toFixed(2)})
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PurchasedCoursesModal;

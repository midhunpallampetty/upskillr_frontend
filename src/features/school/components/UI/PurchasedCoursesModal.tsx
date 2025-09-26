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

const Step: React.FC<{ label: string; completed: boolean }> = ({ label, completed }) => (
  <div className="flex items-center gap-2">
    <div
      className={`rounded-full w-6 h-6 flex items-center justify-center border-2 ${completed ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'}`}
    >
      {completed ? (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <div className="w-2 h-2 rounded-full bg-gray-300" />
      )}
    </div>
    <span className={`text-sm ${completed ? 'text-green-700' : 'text-gray-400'}`}>{label}</span>
  </div>
);

const PurchasedCoursesModal: React.FC<PurchasedCoursesModalProps> = ({ isOpen, courses, studentProgress, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl mb-4 font-semibold">Purchased Courses & Progress</h3>
        <button onClick={onClose} className="mb-6 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">Close</button>

        {courses.length === 0 ? (
          <p>No courses purchased yet.</p>
        ) : (
          <ul>
            {courses.map(course => {
              const videosOfCourse = studentProgress?.videos || {};
              const completedVideoCount = Object.values(videosOfCourse).filter(v => v.completed).length;
              const totalVideos = Object.keys(videosOfCourse).length || 1;

              const passedSectionsCount = studentProgress?.passedSections?.length ?? 0;
              const totalSections = 5; // Assume or fetch real total, or adapt UI accordingly

              const finalExamPassed = studentProgress?.finalExam?.passed ?? false;

              return (
                <li key={course._id} className="flex flex-col gap-3 mb-8 border-b pb-4">
                  <div className="flex items-center gap-4">
                    <img src={course.courseThumbnail} alt={course.courseName} className="w-20 h-20 object-cover rounded" />
                    <div>
                      <h4 className="font-bold text-lg">{course.courseName}</h4>
                      <p>Fee: ₹{course.fee}</p>
                      <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-2 text-center text-gray-600 font-semibold text-sm">
                      <span>Videos Completed</span>
                      <span>Sections Passed</span>
                      <span>Final Exam</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Step
                        label={`${completedVideoCount} / ${totalVideos}`}
                        completed={completedVideoCount === totalVideos}
                      />
                      <Step
                        label={`${passedSectionsCount} / ${totalSections}`}
                        completed={passedSectionsCount === totalSections}
                      />
                      <Step label={finalExamPassed ? 'Passed' : 'Pending'} completed={finalExamPassed} />
                    </div>
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

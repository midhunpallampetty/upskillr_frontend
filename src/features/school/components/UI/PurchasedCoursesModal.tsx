import React, { useState } from 'react';
import { X, Play, BookOpen, Award, CheckCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { getCertificate } from '../../../student/api/course.api';

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
  studentProgressMap?: Record<
    string,
    {
      videos: Record<string, VideoProgress>;
      passedSections: PassedSection[];
      finalExam: FinalExam;
      totalVideos: number;
      totalSections: number;
      sections?: Array<{ // Assuming sections data is fetched and added to progress map
        _id: string;
        title: string;
        videos: Array<{ _id: string; videoName: string; duration: string }>;
      }>; // Add detailed sections for mirroring student view
    }
  >;
  studentId: string;
  schoolName: string;
  onClose: () => void;
}

const ProgressBar: React.FC<{
  progress: number;
  color: string;
  height?: string;
  showPercentage?: boolean;
}> = ({ progress, color, height = 'h-2', showPercentage = false }) => (
  <div className="w-full">
    <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
      <div
        className={`${height} rounded-full transition-all duration-500 ease-out ${color}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
    {showPercentage && (
      <span className="text-xs text-gray-600 mt-1 block">
        {Math.round(progress)}%
      </span>
    )}
  </div>
);

const ProgressCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  current: number;
  total: number;
  color: string;
  bgColor: string;
  completed: boolean;
}> = ({ icon, title, current, total, color, bgColor, completed }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        completed
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>{icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
          <p className="text-xs text-gray-600">
            {current} out of {total} {completed && '✓'}
          </p>
        </div>
        {completed && <CheckCircle className="w-5 h-5 text-green-600" />}
      </div>
      <ProgressBar
        progress={percentage}
        color={color}
        height="h-3"
        showPercentage={true}
      />
    </div>
  );
};

const ExamStatusCard: React.FC<{
  passed: boolean;
  score?: number;
}> = ({ passed, score }) => (
  <div
    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
      passed
        ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100'
        : 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100'
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`p-2 rounded-lg ${
          passed ? 'bg-green-200' : 'bg-orange-200'
        }`}
      >
        {passed ? (
          <Award className="w-5 h-5 text-green-700" />
        ) : (
          <Clock className="w-5 h-5 text-orange-700" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 text-sm">Final Exam</h4>
        <p className="text-xs text-gray-600">
          {passed ? `Passed${score ? ` (${score}%)` : ''}` : 'Pending'}
        </p>
      </div>
      {passed && <CheckCircle className="w-5 h-5 text-green-600" />}
    </div>
    <div
      className={`w-full h-3 rounded-full ${
        passed ? 'bg-green-300' : 'bg-orange-300'
      }`}
    >
      <div
        className={`h-3 rounded-full transition-all duration-500 ${
          passed
            ? 'bg-gradient-to-r from-green-500 to-green-600'
            : 'bg-gradient-to-r from-orange-400 to-orange-500'
        }`}
        style={{ width: passed ? '100%' : '0%' }}
      />
    </div>
    <span className="text-xs text-gray-600 mt-1 block">
      {passed ? '100%' : '0%'}
    </span>
  </div>
);

type CourseCardProps = {
  course: Course;
  studentProgress?: {
    videos: Record<string, VideoProgress>;
    passedSections: PassedSection[];
    finalExam: FinalExam;
    totalVideos: number;
    totalSections: number;
    sections?: Array<{ // Detailed sections for mirroring
      _id: string;
      title: string;
      videos: Array<{ _id: string; videoName: string; duration: string }>;
      exam?: { _id: string; title: string }; // Optional exam
    }>;
  };
  studentId: string;
  schoolName: string;
  onViewCertificate: (url: string) => void;
};

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  studentProgress,
  studentId,
  schoolName,
  onViewCertificate,
}) => {
  const [loadingCert, setLoadingCert] = useState(false);
  const [certificateUnavailable, setCertificateUnavailable] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const videosOfCourse = studentProgress?.videos || {};
  const completedVideoCount = Object.values(videosOfCourse).filter(
    (v) => v.completed
  ).length;
  const totalVideos = studentProgress?.totalVideos || Object.keys(videosOfCourse).length || 1;

  const passedSectionsCount = studentProgress?.passedSections?.length ?? 0;
  const totalSections = studentProgress?.totalSections || passedSectionsCount || 1;

  const finalExamPassed = studentProgress?.finalExam?.passed ?? false;
  const finalExamScore = studentProgress?.finalExam?.score;

  const overallProgress =
    ((completedVideoCount / totalVideos) +
      (passedSectionsCount / totalSections) +
      (finalExamPassed ? 1 : 0)) /
    3 *
    100;

  const canGetCertificate = overallProgress === 100 && finalExamPassed && !certificateUnavailable;

  // Determine current video: the first incomplete with lastPosition > 0, or first incomplete
  const currentVideoId = Object.keys(videosOfCourse).find(
    (id) => !videosOfCourse[id].completed && videosOfCourse[id].lastPosition > 0
  ) || Object.keys(videosOfCourse).find((id) => !videosOfCourse[id].completed);

  const currentVideo = studentProgress?.sections?.flatMap(s => s.videos).find(v => v._id === currentVideoId);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine current exam: the first section with exam not passed
  const currentExamSection = studentProgress?.sections?.find(
    s => s.exam && !studentProgress.passedSections.some(ps => ps.sectionId === s._id)
  );

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  const handleGetCertificate = async () => {
    setLoadingCert(true);
    try {
      const res = await getCertificate(schoolName, course._id, studentId);
      const certificateUrl = res.certificateUrl;
      onViewCertificate(certificateUrl);
    } catch (error: any) {
      if (
        error?.message === '❌ Certificate not found or not yet issued' ||
        error?.response?.data?.message === '❌ Certificate not found or not yet issued'
      ) {
        setCertificateUnavailable(true);
      } else {
        alert('Failed to get certificate');
      }
    } finally {
      setLoadingCert(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={course.courseThumbnail}
          alt={course.courseName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold mb-1">{course.courseName}</h3>
          <p className="text-sm opacity-90">
            ₹{course.fee} •{' '}
            {new Date(course.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-sm font-semibold text-gray-800">
            {Math.round(overallProgress)}% Complete
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Overall progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-gray-800">
              Overall Progress
            </h4>
            <span className="text-sm text-gray-600 font-medium">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <ProgressBar
            progress={overallProgress}
            color="bg-gradient-to-r from-blue-500 to-purple-600"
            height="h-4"
          />
        </div>

        {/* Detailed progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ProgressCard
            icon={<Play className="w-5 h-5 text-blue-700" />}
            title="Videos"
            current={completedVideoCount}
            total={totalVideos}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            bgColor="bg-blue-100"
            completed={completedVideoCount === totalVideos}
          />

          <ProgressCard
            icon={<BookOpen className="w-5 h-5 text-purple-700" />}
            title="Sections"
            current={passedSectionsCount}
            total={totalSections}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            bgColor="bg-purple-100"
            completed={passedSectionsCount === totalSections}
          />

          <ExamStatusCard passed={finalExamPassed} score={finalExamScore} />
        </div>

        {/* Current Activity Highlights */}
        {currentVideo && (
          <div className="mt-3 flex items-center bg-blue-50 p-3 rounded-xl mb-4">
            <Play className="text-blue-500 mr-2 w-5 h-5" />
            <span className="text-sm">
              Currently watching: <b>{currentVideo.videoName}</b> (at {formatTime(videosOfCourse[currentVideoId!].lastPosition)})
            </span>
          </div>
        )}
        {currentExamSection && (
          <div className="mt-3 flex items-center bg-purple-50 p-3 rounded-xl mb-4">
            <BookOpen className="text-purple-500 mr-2 w-5 h-5" />
            <span className="text-sm">
              Currently attending: <b>{currentExamSection.exam?.title}</b> in section "{currentExamSection.title}"
            </span>
          </div>
        )}

        {/* Detailed Sections View (Expandable like student side) */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Section Details</h4>
          {studentProgress?.sections?.map((section) => {
            const sectionCompleted = studentProgress.passedSections.some(ps => ps.sectionId === section._id);
            const sectionVideosCompleted = section.videos.every(v => videosOfCourse[v._id]?.completed);
            const sectionExamPassed = !section.exam || sectionCompleted;

            return (
              <div key={section._id} className="mb-4">
                <button
                  onClick={() => toggleSection(section._id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <span className="font-medium">{section.title}</span>
                  <div className="flex items-center gap-2">
                    {sectionCompleted ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Lock className="w-5 h-5 text-gray-500" />}
                    {expandedSection === section._id ? <ChevronDown /> : <ChevronRight />}
                  </div>
                </button>
                {expandedSection === section._id && (
                  <div className="mt-2 pl-4">
                    {/* Videos in Section */}
                    <div className="mb-3">
                      <h5 className="text-sm font-semibold mb-2">Videos</h5>
                      <ul className="space-y-2">
                        {section.videos.map((video) => {
                          const progress = videosOfCourse[video._id];
                          const isCurrent = video._id === currentVideoId;
                          return (
                            <li key={video._id} className={`text-sm flex items-center gap-2 ${isCurrent ? 'font-bold text-blue-600' : ''}`}>
                              <Play className="w-4 h-4" />
                              {video.videoName} ({video.duration})
                              {progress?.completed ? ' ✓' : ''}
                              {isCurrent ? ' (Currently watching)' : ''}
                              {progress && !progress.completed && progress.lastPosition > 0 ? ` — at ${formatTime(progress.lastPosition)}` : ''}
                            </li>
                          );
                        })}
                      </ul>
                      <ProgressBar
                        progress={(section.videos.filter(v => videosOfCourse[v._id]?.completed).length / section.videos.length) * 100}
                        color="bg-blue-500"
                        height="h-2"
                        showPercentage={true}
                      />
                    </div>

                    {/* Exam in Section */}
                    {section.exam && (
                      <div className="mb-3">
                        <h5 className="text-sm font-semibold mb-2">Exam: {section.exam.title}</h5>
                        <p className="text-sm">
                          Status: {sectionExamPassed ? 'Passed' : currentExamSection?._id === section._id ? 'In progress' : 'Pending'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }) || <p className="text-sm text-gray-600">No detailed section data available.</p>}
        </div>

        {/* Certificate button only if completed and available */}
        {canGetCertificate && (
          <button
            onClick={handleGetCertificate}
            disabled={loadingCert}
            className="mt-6 w-full bg-green-600 text-white rounded px-4 py-3 hover:bg-green-700 transition disabled:opacity-60"
          >
            {loadingCert ? 'Loading Certificate...' : 'Get Certificate'}
          </button>
        )}

        {/* Show message if certificate unavailable */}
        {certificateUnavailable && (
          <p className="mt-4 text-red-600 text-sm font-medium">
            Certificate not found or not yet issued.
          </p>
        )}

        {/* Completion message */}
        {overallProgress === 100 && !certificateUnavailable && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h5 className="font-semibold text-green-800">
                  Course Completed!
                </h5>
                <p className="text-sm text-green-700">
                  All requirements met.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PurchasedCoursesModal: React.FC<PurchasedCoursesModalProps> = ({
  isOpen,
  courses,
  studentProgressMap,
  studentId,
  schoolName,
  onClose,
}) => {
  const [viewingCertificateUrl, setViewingCertificateUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  // Back handler for certificate view
  const handleBackToCourses = () => {
    setViewingCertificateUrl(null);
  };

  // Handler to show certificate url
  const handleViewCertificate = (url: string) => {
    setViewingCertificateUrl(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-50 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-200 flex items-center justify-between">
          {!viewingCertificateUrl ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Student Learning Progress
                </h2>
                <p className="text-gray-600 mt-1">
                  Track progress across all purchased courses
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
              >
                <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBackToCourses}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </button>
              <div className="flex-1 text-center font-semibold text-gray-800">
                Certificate View
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
              >
                <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] flex-1">
          {!viewingCertificateUrl ? (
            courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Courses Yet
                </h3>
                <p className="text-gray-600">
                  No courses purchased yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    studentProgress={
                      studentProgressMap ? studentProgressMap[course._id] : undefined
                    }
                    studentId={studentId}
                    schoolName={schoolName}
                    onViewCertificate={handleViewCertificate}
                  />
                ))}
              </div>
            )
          ) : (
            <iframe
              src={viewingCertificateUrl}
              title="Certificate"
              className="w-full h-full rounded-xl border border-gray-300"
              style={{ minHeight: '600px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasedCoursesModal;

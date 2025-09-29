import React, { useState } from 'react';
import { X, Play, BookOpen, Award, CheckCircle, Clock, ChevronDown, ChevronRight, Lock, Star, Calendar, Users, Video, Target, TrendingUp, Download, Eye, ArrowRight } from 'lucide-react';
import { getCertificate } from '../../../student/api/course.api';

type Course = {
  _id: string;
  courseName: string;
  courseThumbnail: string;
  fee: number;
  createdAt: string;
  sections?: Array<{
    _id: string;
    sectionName: string;
    videos: Array<{
      _id: string;
      videoName: string;
      duration: string;
      url: string;
    }>;
    exam?: {
      _id: string;
      title: string;
    };
  }>;
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
    }
  >;
  studentId: string;
  schoolName: string;
  onClose: () => void;
}

const AnimatedProgressBar: React.FC<{
  progress: number;
  color: string;
  height?: string;
  showPercentage?: boolean;
  animated?: boolean;
}> = ({ progress, color, height = 'h-2', showPercentage = false, animated = true }) => (
  <div className="w-full">
    <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden relative`}>
      <div
        className={`${height} rounded-full transition-all duration-1000 ease-out ${color} ${
          animated ? 'animate-pulse' : ''
        } relative overflow-hidden`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      >
        {animated && progress > 0 && (
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        )}
      </div>
    </div>
    {showPercentage && (
      <span className="text-xs font-medium text-gray-700 mt-1 block">
        {Math.round(progress)}% Complete
      </span>
    )}
  </div>
);

const DetailedProgressCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  current: number;
  total: number;
  color: string;
  bgColor: string;
  completed: boolean;
  subtitle?: string;
  onClick?: () => void;
}> = ({ icon, title, current, total, color, bgColor, completed, subtitle, onClick }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      className={`group relative p-5 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 cursor-pointer ${
        completed
          ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 shadow-emerald-100'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl'
      } shadow-lg`}
      onClick={onClick}
    >
      {/* Completion Badge */}
      {completed && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl ${bgColor} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-base group-hover:text-gray-800 transition-colors">
            {title}
          </h4>
          <p className="text-sm text-gray-600 font-medium">
            {current} of {total} {completed && '🎉'}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(percentage)}%
          </div>
          <div className="text-xs text-gray-500">
            Progress
          </div>
        </div>
      </div>
      
      <AnimatedProgressBar
        progress={percentage}
        color={color}
        height="h-3"
        animated={percentage > 0 && percentage < 100}
      />
      
      {/* Hover indicator */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  );
};

const ExamStatusCard: React.FC<{
  passed: boolean;
  score?: number;
  onClick?: () => void;
}> = ({ passed, score, onClick }) => (
  <div
    className={`group relative p-5 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 cursor-pointer shadow-lg ${
      passed
        ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100'
        : 'border-blue-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100'
    }`}
    onClick={onClick}
  >
    {passed && (
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
        <Award className="w-4 h-4 text-white" />
      </div>
    )}
    
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-xl ${passed ? 'bg-amber-200' : 'bg-blue-200'} group-hover:scale-110 transition-transform duration-300`}>
        {passed ? (
          <Award className="w-6 h-6 text-amber-700" />
        ) : (
          <Target className="w-6 h-6 text-blue-700" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-base">Final Exam</h4>
        <p className="text-sm text-gray-600 font-medium">
          {passed ? `Completed${score ? ` • ${score}%` : ''}` : 'Ready to take'}
        </p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-800">
          {passed ? '100%' : '0%'}
        </div>
        <div className="text-xs text-gray-500">
          Status
        </div>
      </div>
    </div>
    
    <div className={`w-full h-3 rounded-full ${passed ? 'bg-amber-200' : 'bg-blue-200'} overflow-hidden`}>
      <div
        className={`h-3 rounded-full transition-all duration-1000 ${
          passed
            ? 'bg-gradient-to-r from-amber-400 to-amber-600'
            : 'bg-gradient-to-r from-blue-400 to-blue-600'
        }`}
        style={{ width: passed ? '100%' : '0%' }}
      />
    </div>
  </div>
);

const VideoItem: React.FC<{
  video: any;
  progress?: VideoProgress;
  isCurrent: boolean;
  isUnlocked: boolean;
}> = ({ video, progress, isCurrent, isUnlocked }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      isCurrent 
        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 shadow-md' 
        : isUnlocked 
          ? 'bg-gray-50 hover:bg-gray-100' 
          : 'bg-gray-100 opacity-60'
    }`}>
      <div className={`p-2 rounded-lg ${
        progress?.completed 
          ? 'bg-emerald-100 text-emerald-600' 
          : isCurrent 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gray-200 text-gray-500'
      }`}>
        {progress?.completed ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </div>
      
      <div className="flex-1">
        <h6 className={`font-semibold text-sm ${
          isCurrent ? 'text-blue-900' : 'text-gray-800'
        }`}>
          {video.videoName}
        </h6>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{video.duration}</span>
          {progress && !progress.completed && progress.lastPosition > 0 && (
            <span className="text-blue-600 font-medium">
              • Resume at {formatTime(progress.lastPosition)}
            </span>
          )}
        </div>
      </div>
      
      {isCurrent && (
        <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          <Play className="w-3 h-3" />
          Now Playing
        </div>
      )}
      
      {progress?.completed && (
        <div className="text-emerald-600 text-xs font-medium">
          ✓ Complete
        </div>
      )}
    </div>
  );
};

type CourseCardProps = {
  course: Course;
  studentProgress?: {
    videos: Record<string, VideoProgress>;
    passedSections: PassedSection[];
    finalExam: FinalExam;
    totalVideos: number;
    totalSections: number;
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
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const videosOfCourse = studentProgress?.videos || {};
  const completedVideoCount = Object.values(videosOfCourse).filter(
    (v) => v.completed
  ).length;
  const totalVideos = studentProgress?.totalVideos || Object.keys(videosOfCourse).length || 1;

  const passedSections = new Set(studentProgress?.passedSections.map(ps => ps.sectionId) ?? []);

  const isSectionPassed = (section: any): boolean => {
    const allVideosCompleted = section.videos.every((v: any) => videosOfCourse[v._id]?.completed);
    if (section.exam) {
      return allVideosCompleted && passedSections.has(section._id);
    } else {
      return allVideosCompleted;
    }
  };

  const passedSectionsCount = course.sections?.filter(isSectionPassed).length ?? 0;
  const totalSections = studentProgress?.totalSections || course.sections?.length || 1;

  const finalExamPassed = studentProgress?.finalExam?.passed ?? false;
  const finalExamScore = studentProgress?.finalExam?.score;

  const overallProgress = ((completedVideoCount / totalVideos) + (passedSectionsCount / totalSections) + (finalExamPassed ? 1 : 0)) / 3 * 100;

  const canGetCertificate = overallProgress === 100 && finalExamPassed && !certificateUnavailable;

  const currentVideoId = Object.keys(videosOfCourse).find(
    (id) => !videosOfCourse[id].completed && videosOfCourse[id].lastPosition > 0
  ) || Object.keys(videosOfCourse).find((id) => !videosOfCourse[id].completed);

  const currentVideo = course.sections?.flatMap(s => s.videos).find(v => v._id === currentVideoId);
  const currentExamSection = course.sections?.find(s => s.exam && !isSectionPassed(s));

  const isSectionUnlocked = (sectionIndex: number): boolean => {
    if (sectionIndex === 0) return true;
    const prevSection = course.sections?.[sectionIndex - 1];
    if (!prevSection) return false;
    return isSectionPassed(prevSection);
  };

  const toggleSection = (id: string) => {
    const sectionIndex = course.sections?.findIndex(s => s._id === id) ?? -1;
    if (sectionIndex < 0) return;
    if (!isSectionUnlocked(sectionIndex)) {
      alert('Complete the previous section to unlock this one');
      return;
    }
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
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
      {/* Enhanced Header with Gradient Overlay */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={course.courseThumbnail}
          alt={course.courseName}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Course Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-start justify-between">
            <div className="text-white flex-1">
              <h3 className="text-2xl font-bold mb-2 leading-tight">{course.courseName}</h3>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>₹{course.fee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 text-center min-w-[100px]">
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(overallProgress)}%
              </div>
              <div className="text-xs text-gray-600 font-medium">Complete</div>
            </div>
          </div>
        </div>

        {/* Completion Badge */}
        {overallProgress === 100 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-2 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
            <Award className="w-5 h-5" />
            <span className="font-bold text-sm">Completed!</span>
          </div>
        )}
      </div>

      <div className="p-8">
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8 max-w-sm mx-auto">
          <button
            onClick={() => setViewMode('overview')}
            className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
              viewMode === 'overview'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
              viewMode === 'detailed'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Detailed View
          </button>
        </div>

        {viewMode === 'overview' ? (
          <>
            {/* Overall Progress with enhanced styling */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Learning Progress
                </h4>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-blue-700">
                    {Math.round(overallProgress)}% Complete
                  </span>
                </div>
              </div>
              <AnimatedProgressBar
                progress={overallProgress}
                color="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                height="h-6"
                animated={overallProgress > 0 && overallProgress < 100}
              />
            </div>

            {/* Enhanced Progress Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <DetailedProgressCard
                icon={<Video className="w-6 h-6 text-blue-700" />}
                title="Video Lessons"
                current={completedVideoCount}
                total={totalVideos}
                color="bg-gradient-to-r from-blue-500 to-cyan-600"
                bgColor="bg-blue-100"
                completed={completedVideoCount === totalVideos}
                subtitle={`${totalVideos} total videos`}
              />

              <DetailedProgressCard
                icon={<BookOpen className="w-6 h-6 text-purple-700" />}
                title="Course Sections"
                current={passedSectionsCount}
                total={totalSections}
                color="bg-gradient-to-r from-purple-500 to-pink-600"
                bgColor="bg-purple-100"
                completed={passedSectionsCount === totalSections}
                subtitle={`${totalSections} sections to master`}
              />

              <ExamStatusCard 
                passed={finalExamPassed} 
                score={finalExamScore}
              />
            </div>

            {/* Current Activity Highlights */}
            <div className="space-y-4 mb-8">
              {currentVideo && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Play className="text-blue-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-blue-900 mb-1">Continue Learning</h5>
                      <p className="text-blue-700 font-medium">
                        {currentVideo.videoName}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Resume from {Math.floor((videosOfCourse[currentVideoId!]?.lastPosition || 0) / 60)}:
                        {Math.floor((videosOfCourse[currentVideoId!]?.lastPosition || 0) % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              )}

              {currentExamSection && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Target className="text-purple-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-purple-900 mb-1">Ready for Assessment</h5>
                      <p className="text-purple-700 font-medium">
                        {currentExamSection.exam?.title}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        Section: {currentExamSection.sectionName}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Detailed View */
          <div className="space-y-6">
            <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Course Structure
            </h4>
            
            {course.sections?.map((section, index) => {
              const sectionPassed = isSectionPassed(section);
              const sectionVideosCompleted = section.videos.filter(v => videosOfCourse[v._id]?.completed).length;
              const unlocked = isSectionUnlocked(index);

              return (
                <div key={section._id} className={`border-2 rounded-2xl transition-all duration-300 ${
                  sectionPassed 
                    ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50' 
                    : unlocked 
                      ? 'border-gray-200 bg-white hover:border-blue-200' 
                      : 'border-gray-200 bg-gray-50 opacity-75'
                }`}>
                  <button
                    onClick={() => toggleSection(section._id)}
                    disabled={!unlocked}
                    className={`w-full p-6 flex items-center justify-between transition-all duration-300 ${
                      unlocked ? 'hover:bg-gray-50/50' : 'cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        sectionPassed ? 'bg-emerald-100' : unlocked ? 'bg-blue-100' : 'bg-gray-200'
                      }`}>
                        {!unlocked ? (
                          <Lock className="w-6 h-6 text-gray-500" />
                        ) : sectionPassed ? (
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-lg text-gray-900">
                          Section {index + 1}: {section.sectionName}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {sectionVideosCompleted}/{section.videos.length} videos • 
                          {section.exam ? ' 1 exam' : ' No exam'}
                          {sectionPassed && ' • ✓ Completed'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {sectionPassed && (
                        <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Complete
                        </div>
                      )}
                      {expandedSection === section._id ? (
                        <ChevronDown className="w-6 h-6 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {expandedSection === section._id && unlocked && (
                    <div className="px-6 pb-6 space-y-4">
                      {/* Section Progress */}
                      <div className="bg-white p-4 rounded-xl border">
                        <h6 className="font-semibold text-gray-800 mb-3">Section Progress</h6>
                        <AnimatedProgressBar
                          progress={(sectionVideosCompleted / section.videos.length) * 100}
                          color="bg-gradient-to-r from-blue-500 to-blue-600"
                          height="h-3"
                          showPercentage={true}
                        />
                      </div>
                      
                      {/* Videos */}
                      <div className="space-y-3">
                        <h6 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Video className="w-5 h-5 text-blue-600" />
                          Video Lessons ({section.videos.length})
                        </h6>
                        {section.videos.map((video, videoIndex) => (
                          <VideoItem
                            key={video._id}
                            video={video}
                            progress={videosOfCourse[video._id]}
                            isCurrent={video._id === currentVideoId}
                            isUnlocked={videoIndex === 0 || videosOfCourse[section.videos[videoIndex - 1]._id]?.completed}
                          />
                        ))}
                      </div>

                      {/* Exam */}
                      {section.exam && (
                        <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl">
                          <h6 className="font-semibold text-purple-900 flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            {section.exam.title}
                          </h6>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            sectionPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : section.videos.every(v => videosOfCourse[v._id]?.completed)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {sectionPassed ? '✓ Passed' : 
                             section.videos.every(v => videosOfCourse[v._id]?.completed) ? 'Ready to take' : 'Complete videos first'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }) || (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No detailed section data available.</p>
              </div>
            )}
          </div>
        )}

        {/* Certificate Section */}
        {canGetCertificate && (
          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-yellow-900">
                    Certificate Available!
                  </h5>
                  <p className="text-yellow-700 mt-1">
                    Congratulations on completing the course
                  </p>
                </div>
              </div>
              <button
                onClick={handleGetCertificate}
                disabled={loadingCert}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 disabled:opacity-60 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loadingCert ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Get Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Certificate Unavailable Message */}
        {certificateUnavailable && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-800 font-semibold">
                Certificate not found or not yet issued.
              </p>
            </div>
          </div>
        )}

        {/* Completion Celebration */}
        {overallProgress === 100 && !certificateUnavailable && (
          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-emerald-100 rounded-full">
                <Award className="w-12 h-12 text-emerald-600" />
              </div>
              <div>
                <h5 className="text-2xl font-bold text-emerald-900 mb-2">
                  🎉 Course Completed!
                </h5>
                <p className="text-emerald-700 text-lg">
                  You've mastered all the requirements. Well done!
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

  const handleBackToCourses = () => {
    setViewingCertificateUrl(null);
  };

  const handleViewCertificate = (url: string) => {
    setViewingCertificateUrl(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col border border-gray-200">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
            <div className="absolute top-8 right-8 w-12 h-12 bg-white/60 rounded-full" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/30 rounded-full" />
          </div>
          
          {!viewingCertificateUrl ? (
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Learning Progress Dashboard
                  </h2>
                  <p className="text-white/90 text-lg">
                    Track your journey across all enrolled courses
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 group backdrop-blur-sm"
              >
                <X className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          ) : (
            <div className="relative flex items-center justify-between">
              <button
                onClick={handleBackToCourses}
                className="flex items-center gap-3 p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
                <span className="font-semibold">Back to Courses</span>
              </button>
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6" />
                <span className="text-xl font-bold">Certificate Viewer</span>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 group backdrop-blur-sm"
              >
                <X className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1">
          {!viewingCertificateUrl ? (
            courses.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <BookOpen className="w-16 h-16 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No Courses Enrolled Yet
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Start your learning journey by enrolling in courses that interest you.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
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
            <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden">
              <iframe
                src={viewingCertificateUrl}
                title="Certificate"
                className="w-full h-full rounded-3xl"
                style={{ minHeight: '700px' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasedCoursesModal;
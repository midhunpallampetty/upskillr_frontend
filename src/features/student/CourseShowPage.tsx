import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Video,
  ChevronRight,
  ChevronDown,
  LogOut,
  GraduationCap,
  CheckCircle,
  Lock,
  Play,
  Trophy,
  Star
} from 'lucide-react';
import Cookies from 'js-cookie';
import CommentComponent from './components/Layout/Comment';
import useStudentAuthGuard from './hooks/useStudentAuthGuard';
import { fetchCourseData } from './api/course.api';

const CourseShowPage = () => {
  useStudentAuthGuard();
  const { courseId, schoolName } = useParams<{ courseId: string, schoolName: string }>();
  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');
  const [showCourseCompletion, setShowCourseCompletion] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      if (!schoolName || !courseId) {
        setError('Missing schoolName or courseId');
        return;
      }

      setLoading(true);
      try {
        const courseData = await fetchCourseData(schoolName, courseId);
        setCourse(courseData);
        setError(null);
      } catch (err) {
        setError('Error fetching course details');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [schoolName, courseId]);

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  const handleLogout = () => {
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    localStorage.removeItem('student');
    window.location.href = '/studentLogin';
  };

  const markVideoComplete = (videoId: string) => {
    setCompletedVideos(prev => new Set([...prev, videoId]));
  };

  const isSectionUnlocked = (sectionIndex: number): boolean => {
    if (sectionIndex === 0) return true;
    const previousSection = course?.sections[sectionIndex - 1];
    if (!previousSection) return false;
    return previousSection.videos.every(video => completedVideos.has(video._id));
  };

  const isSectionCompleted = (section: any): boolean => {
    return section.videos.length > 0 && section.videos.every(video => completedVideos.has(video._id));
  };

  const getCompletionPercentage = (): number => {
    if (!course) return 0;
    const totalVideos = course.sections.reduce((acc, section) => acc + section.videos.length, 0);
    if (totalVideos === 0) return 0;
    return Math.round((completedVideos.size / totalVideos) * 100);
  };

  const checkCourseCompletion = () => {
    if (!course) return false;
    const allVideos = course.sections.flatMap(section => section.videos);
    return allVideos.length > 0 && allVideos.every(video => completedVideos.has(video._id));
  };

  useEffect(() => {
    if (checkCourseCompletion()) {
      setShowCourseCompletion(true);
    }
  }, [completedVideos, course]);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">{error}</div>;
  }

  if (showCourseCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="mb-8">
            <Trophy className="w-24 h-24 mx-auto text-yellow-300 mb-4" />
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-yellow-300 text-yellow-300" />
              ))}
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Congratulations!</h1>
          <h2 className="text-2xl mb-6">You've completed the course:</h2>
          <h3 className="text-3xl font-semibold mb-8 text-yellow-200">{course?.courseName}</h3>
          <p className="text-xl mb-8 opacity-90">
            You've successfully completed all sections and videos in this course.
            Great job on your learning journey!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/student/dashboard"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => setShowCourseCompletion(false)}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Review Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white text-lg">
          <div className="flex items-center gap-3 text-2xl font-semibold">
            <GraduationCap className="w-8 h-8" />
            <Link to="/student/dashboard">Student Portal</Link>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100 text-base flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 shadow-md">
        <div className="flex items-center gap-6 mb-4">
          <img
            src={course?.courseThumbnail || 'https://via.placeholder.com/120x120?text=Banner'}
            alt="Course Thumbnail"
            className="w-28 h-28 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{course?.courseName || 'Course Title'}</h1>
            <p className="text-lg mb-3">
              Subdomain: <span className="italic">{schoolName}</span>
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white/20 rounded-full h-3">
                <div
                  className="bg-yellow-300 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
              <span className="text-lg font-semibold">{getCompletionPercentage()}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      {currentVideoUrl && (
        <div className="max-w-4xl mx-auto mt-6 p-4">
          <div className="bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              controls
              className="w-full h-96"
              src={currentVideoUrl}
              onEnded={() => {
                const currentVideo = course?.sections
                  .flatMap(s => s.videos)
                  .find(v => v.url === currentVideoUrl);
                if (currentVideo) {
                  markVideoComplete(currentVideo._id);
                }
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-10 p-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <BookOpen className="text-purple-600" /> Course Content
        </h2>
        <p className="text-gray-600 mb-8 whitespace-pre-line">{course?.description}</p>

        {course?.sections.length ? (
          course.sections.map((section, sectionIndex) => {
            const isUnlocked = isSectionUnlocked(sectionIndex);
            const isCompleted = isSectionCompleted(section);

            return (
              <div
                key={section._id}
                className={`mb-4 border rounded-lg shadow-sm ${isUnlocked ? 'bg-white' : 'bg-gray-50'
                  } ${isCompleted ? 'ring-2 ring-green-200' : ''}`}
              >
                <button
                  onClick={() => isUnlocked && toggleSection(section._id)}
                  disabled={!isUnlocked}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between ${isUnlocked ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {!isUnlocked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`font-medium text-lg ${isUnlocked ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                      {section.sectionName}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({section.videos.filter(v => completedVideos.has(v._id)).length}/{section.videos.length} completed)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : (
                      expandedSection === section._id ? <ChevronDown /> : <ChevronRight />
                    )}
                  </div>
                </button>

                {expandedSection === section._id && isUnlocked && (
                  <div className="pl-6 pr-4 pb-4">
                    {section.videos.length > 0 ? (
                      section.videos.map(video => {
                        const isVideoCompleted = completedVideos.has(video._id);
                        const isCurrentVideo = currentVideoUrl === video.url;

                        return (
                          <div
                            key={video._id}
                            className={`flex items-center justify-between py-3 border-b last:border-none hover:bg-gray-50 px-3 rounded-md cursor-pointer transition-colors ${isCurrentVideo ? 'bg-indigo-50 border-indigo-200' : ''
                              }`}
                            onClick={() => setCurrentVideoUrl(video.url)}
                          >
                            <div className="flex items-center gap-3">
                              {isVideoCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : isCurrentVideo ? (
                                <Play className="w-5 h-5 text-indigo-500" />
                              ) : (
                                <Video className="w-5 h-5 text-gray-500" />
                              )}
                              <span className={`${isVideoCompleted ? 'text-green-700 line-through' : 'text-gray-900'
                                }`}>
                                {video.videoName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-400">
                                {video.duration || '—'}
                              </span>
                              {!isVideoCompleted && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markVideoComplete(video._id);
                                  }}
                                  className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors"
                                >
                                  Mark Complete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-400 italic mt-2">No videos available</p>
                    )}
                  </div>
                )}

                {!isUnlocked && (
                  <div className="px-6 pb-4 text-sm text-gray-500 italic">
                    Complete the previous section to unlock this content
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-10">No course sections available.</p>
        )}
      </div>
      <CommentComponent
        courseId={courseId!}
        schoolName={schoolName!}
      />
    </div>
  );
};

export default CourseShowPage;
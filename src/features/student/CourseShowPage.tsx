import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Star,
  Download,
  Clock,
  Users,
  Award,
  Target,
  Zap
} from 'lucide-react';
import Cookies from 'js-cookie';
import VideoPlayer from './components/UI/VideoPlayer';
import CourseSidebar from './components/UI/CourseSideBar';
import CompletionCelebration from './components/UI/CompletionCelebration';
import LoadingSkeleton from './components/UI/LoadingSkelton';
import ToastNotification from './components/UI/ToastNotification';
import CourseHeader from './components/UI/CourseHeader';
import CommentComponent from './components/Layout/Comment';
import FinalExamComponent from './components/UI/FinalExam';  // NEW: Import
import useStudentAuthGuard from './hooks/useStudentAuthGuard';
import { 
  addCertificate, 
  updateCertificate,
  fetchCourseData, 
  fetchStudentProgress, 
  saveVideoProgress, 
  issueCertificate, 
  checkSectionExamCompletionApi, 
  saveExamProgress,
  saveFinalExamProgress, 
  checkFinalExamStatus   
} from './api/course.api'; 

interface ExamType {
  _id: string;
  title: string;
  questions: Array<{
    _id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    marks?: number;  // Optional, as per your calculateScore logic
  }>;
}

// Update SectionType to include 'exam' as optional
interface SectionType {
  _id: string;
  title: string;
  videos: Array<{
    _id: string;
    url: string;
    videoName: string;
    duration: string;  // e.g., '5:30'
    // Add other video properties if needed
  }>;
  exam?: ExamType | null;  // Make it optional to handle sections without exams
}

const ExamComponent = ({ exam, onSubmit, onCancel }: { exam: any; onSubmit: (passed: boolean, score: number, total: number) => void; onCancel: () => void }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  console.log(exam,'exam');
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const calculateScore = () => {
    let score = 0;
    let totalMarks = 0;
    exam.questions.forEach((q: any) => {
      const mark = q.marks || 1;
      totalMarks += mark;
      if (selectedAnswers[q._id] === q.correctAnswer) {
        score += mark;
      }
    });
    return { score, totalMarks, percentage: (score / totalMarks) * 100 };
  };
  
  const handleSubmit = () => {
    const { score, totalMarks, percentage } = calculateScore();
    onSubmit(percentage >= 50, score, totalMarks);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Award className="text-indigo-600" />
        {exam.title}
      </h2>
      {exam.questions.map((q: any, index: number) => (
        <div key={q._id} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3">{index + 1}. {q.questionText}</h3>
          <div className="grid gap-2">
            {q.options.map((opt: string, optIndex: number) => (
              <button 
                key={optIndex}
                onClick={() => handleAnswerSelect(q._id, opt)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedAnswers[q._id] === opt 
                    ? 'bg-indigo-100 border-indigo-500' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-4 mt-6">
        <button 
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          disabled={Object.keys(selectedAnswers).length < exam.questions.length}
        >
          <CheckCircle size={18} /> Submit Exam
        </button>
        <button 
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

const CourseShowPage = () => {
  useStudentAuthGuard();
  const { courseId, schoolName } = useParams<{ courseId: string; schoolName: string }>();
  // Core state
  const [course, setCourse] = useState<any | null>(null);
  console.log(course, 'course');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [videoPositions, setVideoPositions] = useState<Record<string, number>>({});
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');
  const [showCourseCompletion, setShowCourseCompletion] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);
  const [lastProgressUpdates, setLastProgressUpdates] = useState<Record<string, number>>({});
  const [passedSections, setPassedSections] = useState<Set<string>>(new Set());
  const [currentExamSection, setCurrentExamSection] = useState<string | null>(null);
  // NEW: State for final exam
  const [finalExamPassed, setFinalExamPassed] = useState(false);
  const [showFinalExam, setShowFinalExam] = useState(false);
  // Interactive state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>>([]);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const examRef = useRef<HTMLDivElement>(null);
  // NEW: Ref for final exam
  const finalExamRef = useRef<HTMLDivElement>(null);
  
  // Toast management
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  // Get student ID from localStorage or cookies
  const getStudentId = () => {
    const student = localStorage.getItem('student');
    return student ? JSON.parse(student).id || JSON.parse(student)._id : null;
  };

  // NEW: Function to check if a section's exam is completed via API
  // (Assumes the API returns { isCompleted: boolean } for the section's exam status;
  // Adjust if your API response is different)
  const checkSectionExamCompletion = async (sectionId: string) => {
    const studentId = getStudentId();
    if (!studentId || !schoolName || !courseId) return false;
    try {
      const data = await checkSectionExamCompletionApi(schoolName, courseId, studentId, sectionId);
      return data.isCompleted || false;  // Assume API returns { isCompleted: boolean } for the section
    } catch (apiError) {
      console.error('Error checking section exam completion:', apiError);
      addToast('error', 'Failed to verify section completion. Using local check.');
      return false;
    }
  };

  useEffect(() => {
    const loadCourseAndProgress = async () => {
      if (!schoolName || !courseId) {
        setError('Missing schoolName or courseId');
        return;
      }
      const studentId = getStudentId();
      if (!studentId) {
        setError('Student not authenticated');
        return;
      }
      setLoading(true);
      try {
        // Load course data
        const courseData = await fetchCourseData(schoolName, courseId);
        setCourse(courseData);
        // Auto-expand first section
        if (courseData?.sections?.length > 0) {
          setExpandedSection(courseData.sections[0]._id);
        }
        // Load student progress
        try {
          const progressData = await fetchStudentProgress(schoolName, courseId, studentId);
          const videosProgress = progressData?.videos || {};
          
          const completedVideoIds: string[] = [];
          const positions: Record<string, number> = {};
          Object.entries(videosProgress).forEach(([videoId, prog]) => {
            if (prog) {
              if (prog.completed === true) {
                completedVideoIds.push(videoId);
              }
              positions[videoId] = prog.lastPosition || 0;
            }
          });
          
          setCompletedVideos(new Set(completedVideoIds));
          setVideoPositions(positions);
          const passedSectionIds: string[] = progressData?.passedSections || [];
          setPassedSections(new Set(passedSectionIds));
          
          if (completedVideoIds.length > 0) {
            addToast('info', `Welcome back! You've completed ${completedVideoIds.length} videos.`);
          }
          // NEW: After loading progress, verify exam completion for sections with exams via API
          const updatedPassedSections = new Set(passedSectionIds);
          for (const section of courseData.sections) {
            if (section.exam) {  // Only for sections where exam is not null
              const isExamCompleted = await checkSectionExamCompletion(section._id);
              if (isExamCompleted) {
                updatedPassedSections.add(section._id);
              }
            }
          }
          setPassedSections(updatedPassedSections);
          // NEW: Load final exam status from API
          const finalExamStatus = await checkFinalExamStatus(schoolName, courseId, studentId);
          setFinalExamPassed(finalExamStatus.passed || false);
        } catch (progressError) {
          console.warn('Failed to load progress, starting with empty progress:', progressError);
          setCompletedVideos(new Set());
          setVideoPositions({});
          setPassedSections(new Set());
          setFinalExamPassed(false);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading course data:', err);
        setError('Error fetching course details');
        addToast('error', 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };
    loadCourseAndProgress();
  }, [schoolName, courseId]);

  // Resume video from last position when currentVideoUrl changes
  useEffect(() => {
    if (currentVideoUrl && videoRef.current) {
      const currentVideo = course?.sections
        .flatMap(s => s.videos)
        .find(v => v.url === currentVideoUrl);
      
      if (currentVideo) {
        const lastPos = videoPositions[currentVideo._id] || 0;
        if (lastPos > 0) {
          videoRef.current.currentTime = lastPos;
          addToast('info', `Resuming from ${Math.floor(lastPos / 60)}:${String(Math.floor(lastPos % 60)).padStart(2, '0')}`);
        }
      }
    }
  }, [currentVideoUrl, videoPositions, course]);

  // NEW: Effect to automatically show final exam if all sections are completed but final not passed
  useEffect(() => {
    if (course && course.finalExam && !finalExamPassed) {
      const allSectionsCompleted = course.sections.every(section => isSectionCompleted(section));
      if (allSectionsCompleted) {
        setShowFinalExam(true);
        addToast('info', 'All sections completed! Time to take the final exam.');
        // Scroll to final exam after a short delay
        setTimeout(() => {
          finalExamRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      } else {
        setShowFinalExam(false);
      }
    }
  }, [course, finalExamPassed, completedVideos, passedSections]);

  // NEW: Effect to automatically set currentExamSection for the active (expanded) section if videos are completed and exam not passed
  useEffect(() => {
    if (expandedSection && course) {
      const section = course.sections.find(s => s._id === expandedSection);
      if (section) {
        const allVideosCompleted = section.videos.every(v => completedVideos.has(v._id));
        const examNotPassed = section.exam && !passedSections.has(section._id);
        if (allVideosCompleted && examNotPassed) {
          setCurrentExamSection(expandedSection);
          // Scroll to exam after a short delay to ensure it's rendered
          setTimeout(() => {
            examRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        } else if (!examNotPassed) {
          setCurrentExamSection(null);
        }
      }
    }
  }, [expandedSection, completedVideos, passedSections, course]);

  const toggleSection = (id: string) => {
    const sectionIndex = course?.sections.findIndex(s => s._id === id);
    if (sectionIndex === undefined || sectionIndex < 0) return;
    if (!isSectionUnlocked(sectionIndex)) {
      // Find the previous section that is blocking
      const prevSection = course.sections[sectionIndex - 1];
      if (prevSection.exam && !passedSections.has(prevSection._id)) {
        addToast('info', 'You need to pass the exam in the previous section to unlock this one.');
        setCurrentExamSection(prevSection._id);  // Render the exam for the previous section
      } else {
        addToast('info', 'Complete the previous section to unlock this one.');
      }
      return;
    }
    setExpandedSection(prev => (prev === id ? null : id));
  };

  const handleLogout = () => {
    Cookies.remove('studentAccessToken');
    Cookies.remove('studentRefreshToken');
    localStorage.removeItem('student');
    window.location.href = '/studentLogin';
  };

  const markVideoComplete = async (videoId: string) => {
    const studentId = getStudentId();
    if (!studentId || !schoolName || !courseId) return;
    try {
      setProgressLoading(true);
      
      await saveVideoProgress(schoolName, courseId, videoId, {
        studentId,
        completed: true,
        lastPosition: 0
      });
      setCompletedVideos(prev => new Set([...prev, videoId]));
      setVideoPositions(prev => ({ ...prev, [videoId]: 0 }));
      
      const currentVideo = course?.sections
        .flatMap(s => s.videos)
        .find(v => v._id === videoId);
      
      if (currentVideo) {
        addToast('success', `${currentVideo.videoName} completed! 🎉`);
      }
      // NEW: Check if all videos in the section are now completed, and if so, render exam if present (handled in useEffect now)
      const section = course?.sections.find(s => s.videos.some(v => v._id === videoId));
      if (section) {
        const allVideosCompleted = section.videos.every(v => completedVideos.has(v._id) || v._id === videoId);  // Include the just-completed one
        if (allVideosCompleted && section.exam && !passedSections.has(section._id)) {
          addToast('info', 'All videos completed! Time to take the exam for this section.');
          setCurrentExamSection(section._id);  // Render the exam
          // Scroll to exam after a short delay to ensure it's rendered
          setTimeout(() => {
            examRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    } catch (error) {
      console.error('Error saving video progress:', error);
      addToast('error', 'Failed to save progress. Please try again.');
    } finally {
      setProgressLoading(false);
    }
  };

  const handleVideoProgress = async (videoId: string, lastPosition: number) => {
    const studentId = getStudentId();
    if (!studentId || !schoolName || !courseId) return;
    try {
      await saveVideoProgress(schoolName, courseId, videoId, {
        studentId,
        lastPosition,
        completed: false
      });
      setVideoPositions(prev => ({ ...prev, [videoId]: lastPosition }));
    } catch (error) {
      console.error('Error saving video position:', error);
    }
  };

  const handleExamSubmit = async (sectionId: string, passed: boolean, score: number, total: number) => {
    const studentId = getStudentId();
    if (!studentId || !schoolName || !courseId) return;
    // Frontend validation: Check passing score (50% threshold)
    const percentage = (score / total) * 100;
    if (percentage < 50) {
      addToast('info', `Exam score: ${score}/${total}. Need 50% to pass. Try again!`);
      setCurrentExamSection(null);
      return;
    }
    // Check if section has an exam (local validation before API call)
    const section = course?.sections.find(s => s._id === sectionId);
    if (!section?.exam) {
      addToast('error', 'This section does not have an exam assigned.');
      setCurrentExamSection(null);
      return;
    }
    try {
      await saveExamProgress(schoolName, courseId, sectionId, studentId, percentage);
      // Update local state only after success
      setPassedSections(prev => new Set([...prev, sectionId]));
      addToast('success', `Exam passed! Score: ${score}/${total} 🎉`);
      // Auto-mark videos as completed
      if (section.videos.length > 0) {
        for (const video of section.videos) {
          if (!completedVideos.has(video._id)) {
            await markVideoComplete(video._id);
          }
        }
        addToast('info', 'All videos in this section marked as completed since exam passed.');
      }
      // NEW: After passing exam, automatically move to the next section (expand it and set first video if available)
      const currentSectionIndex = course.sections.findIndex(s => s._id === sectionId);
      const nextSectionIndex = currentSectionIndex + 1;
      if (nextSectionIndex < course.sections.length) {
        const nextSection = course.sections[nextSectionIndex];
        if (isSectionUnlocked(nextSectionIndex)) {
          setExpandedSection(nextSection._id);
          // Optionally auto-play the first video in the next section
          if (nextSection.videos.length > 0) {
            setCurrentVideoUrl(nextSection.videos[0].url);
            addToast('info', `Moving to next section: ${nextSection.title}`);
          }
        }
      }
    } catch (apiError: any) {
      console.error('Error saving exam progress:', apiError);
      addToast('error', apiError.message || 'Failed to save exam progress. Please try again.');
    }
    setCurrentExamSection(null);
  };

  // NEW: Handler for final exam submit (now with backend save)
  const handleFinalExamSubmit = async (passed: boolean, score: number, total: number) => {
    const studentId = getStudentId();
    if (!studentId || !schoolName || !courseId) return;
    const percentage = (score / total) * 100;
    if (percentage < 50) {
      addToast('info', `Final exam score: ${score}/${total}. Need 50% to pass. Try again!`);
      return;  // Allow retry without closing
    }
    try {
      // Call backend to save progress
      await saveFinalExamProgress(schoolName, courseId, studentId, percentage);
      // Update local state
      setFinalExamPassed(true);
      setShowFinalExam(false);
      addToast('success', `Final exam passed! Score: ${score}/${total} 🎉`);
      // Trigger completion celebration
      setShowCourseCompletion(true);
    } catch (error) {
      console.error('Error saving final exam progress:', error);
      addToast('error', 'Failed to save final exam progress. Please try again.');
    }
  };

  const handleCertificateRequest = async () => {
    const studentId = getStudentId();
    if (!studentId || !schoolName || !courseId) return;
    try {
      setProgressLoading(true);
      const response = await issueCertificate(schoolName, courseId, studentId);
      setCertificateUrl(response.certificateUrl);
      addToast('success', 'Certificate generated successfully!');
    } catch (error) {
      console.error('Error issuing certificate:', error);
      addToast('error', 'Failed to generate certificate');
    } finally {
      setProgressLoading(false);
    }
  };

  // NEW: Handler for adding a new certificate
  const handleAddCertificate = async () => {
    const studentId = getStudentId();
    if (!studentId || !schoolName || !courseId) return;
    try {
      setProgressLoading(true);
      const newCertificateUrl = await addCertificate(schoolName, courseId, studentId);
      setCertificateUrl(newCertificateUrl);
      addToast('success', 'New certificate added successfully!');
    } catch (error) {
      console.error('Error adding certificate:', error);
      addToast('error', 'Failed to add certificate');
    } finally {
      setProgressLoading(false);
    }
  };

  // NEW: Handler for updating an existing certificate
  const handleUpdateCertificate = async (dateIssued: string) => {
    const studentId = getStudentId();
    if (!studentId || !schoolName || !courseId) return;
    try {
      setProgressLoading(true);
      const updatedCertificateUrl = await updateCertificate(schoolName, courseId, studentId, dateIssued);
      setCertificateUrl(updatedCertificateUrl);
      addToast('success', 'Certificate updated successfully!');
    } catch (error) {
      console.error('Error updating certificate:', error);
      addToast('error', 'Failed to update certificate');
    } finally {
      setProgressLoading(false);
    }
  };

  const isSectionUnlocked = (sectionIndex: number): boolean => {
    if (sectionIndex === 0) return true;
    const prevSection = course?.sections[sectionIndex - 1];
    if (!prevSection) return false;
    const videosCompleted = prevSection.videos.every(video => completedVideos.has(video._id));
    const examPassed = passedSections.has(prevSection._id);
    // UPDATED: To unlock next section, previous must be fully completed
    // If previous has exam, require BOTH videos completed AND exam passed
    if (prevSection.exam) {
      return videosCompleted && examPassed;
    }
    // For non-exam sections, require videos completed
    return videosCompleted;
  };

  const isSectionCompleted = (section: any): boolean => {
    const videosCompleted = section.videos.length > 0 && section.videos.every(video => completedVideos.has(video._id));
    const examPassed = !section.exam || passedSections.has(section._id);
    // UPDATED: Section is completed only if videos are done AND exam is passed (if present)
    return videosCompleted && examPassed;
  };

  const getCompletionPercentage = (): number => {
    if (!course) return 0;
    const totalVideos = course.sections.reduce((acc, section) => acc + section.videos.length, 0);
    if (totalVideos === 0) return 0;
    return Math.round((completedVideos.size / totalVideos) * 100);
  };

  const getTotalDuration = (): string => {
    if (!course) return '0 min';
    const totalMinutes = course.sections.reduce((acc, section) => {
      return acc + section.videos.reduce((videoAcc, video) => {
        const duration = video.duration || '0:00';
        const [mins, secs] = duration.split(':').map(Number);
        return videoAcc + mins + (secs / 60);
      }, 0);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const checkCourseCompletion = () => {
    if (!course) return false;
    const allSections = course.sections;
    const allSectionsCompleted = allSections.every(section => isSectionCompleted(section));
    // NEW: Require final exam passed if it exists
    if (course.finalExam) {
      return allSectionsCompleted && finalExamPassed;
    }
    return allSectionsCompleted;
  };

  useEffect(() => {
    if (checkCourseCompletion() && !showCourseCompletion) {
      setShowCourseCompletion(true);
      addToast('success', 'Congratulations! Course completed! 🎊');
    }
  }, [completedVideos, passedSections, finalExamPassed, course]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            to="/student/purchased-courses"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (showCourseCompletion) {
    return (
      <CompletionCelebration
        course={course}
        onCertificateRequest={handleCertificateRequest}
        onAddCertificate={handleAddCertificate}  // NEW
        onUpdateCertificate={handleUpdateCertificate}  // NEW
        certificateUrl={certificateUrl}
        progressLoading={progressLoading}
        onReviewCourse={() => setShowCourseCompletion(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-indigo-600"
            >
              <GraduationCap className="w-8 h-8" />
            </motion.div>
            <Link 
              to="/student/purchased-courses"
              className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
            >
              Course Progress
            </Link>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <CourseSidebar
          course={course}
          expandedSection={expandedSection}
          completedVideos={completedVideos}
          currentVideoUrl={currentVideoUrl}
          collapsed={sidebarCollapsed}
          onToggleSection={toggleSection}
          onSelectVideo={setCurrentVideoUrl}
          onMarkComplete={markVideoComplete}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSectionUnlocked={isSectionUnlocked}
          isSectionCompleted={isSectionCompleted}
          progressLoading={progressLoading}
          hoveredVideo={hoveredVideo}
          onVideoHover={setHoveredVideo}
          passedSections={passedSections}
          onTakeExam={setCurrentExamSection}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
          {/* Course Header */}
          <CourseHeader
            course={course}
            schoolName={schoolName}
            completionPercentage={getCompletionPercentage()}
            totalDuration={getTotalDuration()}
            completedVideos={completedVideos.size}
            totalVideos={course?.sections.reduce((acc, section) => acc + section.videos.length, 0) || 0}
          />

          {/* Video Player */}
          {currentVideoUrl && (
            <div className="p-6">
              <VideoPlayer
                videoRef={videoRef}
                videoUrl={currentVideoUrl}
                course={course}
                onTimeUpdate={handleVideoProgress}
                onVideoEnd={markVideoComplete}
                lastProgressUpdates={lastProgressUpdates}
                setLastProgressUpdates={setLastProgressUpdates}
                playbackSpeed={playbackSpeed}
                onSpeedChange={setPlaybackSpeed}
                isFullscreen={isFullscreen}
                onFullscreenChange={setIsFullscreen}
              />
            </div>
          )}

          {/* Section Exam Component */}
          {currentExamSection && course?.sections.find(s => s._id === currentExamSection)?.exam && (
            <div ref={examRef} className="p-6">
              <ExamComponent 
                exam={course.sections.find(s => s._id === currentExamSection).exam}
                onSubmit={(passed, score, total) => handleExamSubmit(currentExamSection, passed, score, total)}
                onCancel={() => setCurrentExamSection(null)}
              />
            </div>
          )}

          {/* NEW: Final Exam Component */}
          {showFinalExam && course?.finalExam && (
            <div ref={finalExamRef} className="p-6">
              <FinalExamComponent 
                exam={course.finalExam}
                onSubmit={handleFinalExamSubmit}
                onCancel={() => setShowFinalExam(false)}  // Optional cancel to hide
              />
            </div>
          )}

          {/* Course Description */}
          {!currentVideoUrl && !currentExamSection && !showFinalExam && (
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="text-indigo-600" />
                  About This Course
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {course?.description || 'No description available.'}
                </p>
                
                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{course?.sections?.length || 0}</div>
                    <div className="text-sm text-gray-500">Sections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {course?.sections.reduce((acc, section) => acc + section.videos.length, 0) || 0}
                    </div>
                    <div className="text-sm text-gray-500">Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{getTotalDuration()}</div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{getCompletionPercentage()}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Comments */}
          <div className="p-6">
            <CommentComponent
              courseId={courseId!}
              schoolName={schoolName!}
            />
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CourseShowPage;

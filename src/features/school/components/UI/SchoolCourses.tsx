import React, { useEffect, useState } from 'react';
import { Course } from '../../types/Course';
import { Props } from '../../types/Props';
import { useNavigate } from 'react-router-dom';
import VideoModal from '../../components/UI/VideoModal';
import Section from '../../../course/types/Section';
import EditCourseModal from './EditCourseModal';
import { Video } from '../../types/Video';
import { getCoursesBySchool, getSectionsByCourse, getVideoById, updateCourseById, deleteCourseById, softDeleteSectionById, softDeleteVideoById } from '../../api/course.api';
import Swal from 'sweetalert2';
import ModalExamSelector from '../Layout/ModalExamSelector';
import AddExamToSectionModal from '../Layout/AddExamSection';

const SchoolCourses: React.FC<Props> = ({ schoolId, dbname }) => {
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examModalCourseId, setExamModalCourseId] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // New state for add exam modal
  const [addExamModalOpen, setAddExamModalOpen] = useState(false);
  const [selectedSectionIdForExam, setSelectedSectionIdForExam] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleOpenExamModal = (courseId: string) => {
    setExamModalCourseId(courseId);
    setExamModalOpen(true);
  };

  const handleCloseExamModal = () => {
    setExamModalCourseId(null);
    setExamModalOpen(false);
  };

  const handleOpenAddExamModal = (sectionId: string) => {
    setSelectedSectionIdForExam(sectionId);
    setAddExamModalOpen(true);
  };

  // Load courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await getCoursesBySchool(schoolId, dbname);
        setCourses(courseList);
      } catch (err) {
        console.error('❌ Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId && dbname) {
      fetchCourses();
    }
  }, [schoolId, dbname]);

  // Load sections (refactored to be reusable for refresh after adding exam)
  const fetchSections = async (courseId: string) => {
    setLoadingSections(true);
    try {
      const fetchedSections = await getSectionsByCourse(dbname, courseId);
      setSections(fetchedSections);
    } catch (err) {
      console.error('❌ Failed to fetch sections:', err);
    } finally {
      setLoadingSections(false);
    }
  };

  const handleCourseClick = async (course: Course) => {
    setSelectedCourse(course);
    await fetchSections(course._id);
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setSections([]);
  };

  const handleDeleteVideo = async (videoId: string) => {
    const result = await Swal.fire({
      title: 'Delete Video?',
      text: 'This action will soft-delete the video. You can restore it later if needed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-lg px-6 py-2',
        cancelButton: 'rounded-lg px-6 py-2'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await softDeleteVideoById(dbname, videoId);
      setVideoIds((prev) => prev.filter((id) => id !== videoId));
      setCurrentVideoIndex(0);
      setCurrentVideo(null);

      await Swal.fire({
        title: 'Deleted!',
        text: 'Video has been successfully deleted.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6 py-2'
        }
      });
    } catch (err) {
      console.error('❌ Failed to delete video:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the video. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6 py-2'
        }
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    const result = await Swal.fire({
      title: 'Delete Course?',
      text: 'This action cannot be undone. All associated sections and videos will be removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-lg px-6 py-2',
        cancelButton: 'rounded-lg px-6 py-2'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCourseById(dbname, courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));

      await Swal.fire({
        title: 'Deleted!',
        text: 'The course has been successfully deleted.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6 py-2'
        }
      });
    } catch (err) {
      console.error('❌ Failed to delete course:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting the course.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6 py-2'
        }
      });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    const result = await Swal.fire({
      title: 'Delete Section?',
      text: 'This section and all its videos will be soft-deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-lg px-6 py-2',
        cancelButton: 'rounded-lg px-6 py-2'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await softDeleteSectionById(dbname, sectionId);
      setSections((prev) => prev.filter((s) => s._id !== sectionId));

      await Swal.fire({
        title: 'Deleted!',
        text: 'Section has been successfully deleted.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6 py-2'
        }
      });
    } catch (err) {
      console.error('❌ Failed to delete section:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the section. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6 py-2'
        }
      });
    }
  };

  const handleShowVideos = (section: Section) => {
    if (!section.videos || section.videos.length === 0) {
      Swal.fire({
        title: 'No Videos',
        text: 'This section doesn\'t have any videos yet.',
        icon: 'info',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6 py-2'
        }
      });
      return;
    }

    setVideoIds(section.videos);
    setCurrentVideoIndex(0);
    setCurrentVideo(null);
    setVideoModalOpen(true);
  };

  // Load individual video when index changes
  useEffect(() => {
    let isCancelled = false;

    const fetchVideo = async () => {
      if (
        videoIds.length === 0 ||
        currentVideoIndex < 0 ||
        currentVideoIndex >= videoIds.length
      ) {
        setCurrentVideo(null);
        return;
      }

      setLoadingVideo(true);
      try {
        const videoId = videoIds[currentVideoIndex];
        const videoData = await getVideoById(dbname, videoId);

        if (!isCancelled) {
          if (Array.isArray(videoData)) {
            setCurrentVideo(videoData[0] || null);
          } else {
            setCurrentVideo(videoData || null);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('❌ Failed to fetch video:', err);
          setCurrentVideo(null);
        }
      } finally {
        if (!isCancelled) {
          setLoadingVideo(false);
        }
      }
    };

    fetchVideo();
    return () => {
      isCancelled = true;
    };
  }, [currentVideoIndex, videoIds, dbname]);

  const closeModal = () => {
    setVideoModalOpen(false);
    setVideoIds([]);
    setCurrentVideoIndex(0);
    setCurrentVideo(null);
    setLoadingVideo(false);
  };

  const handleUpdateCourse = async (updatedData: Partial<Course>) => {
    if (!editingCourse) return;
    try {
      await updateCourseById(dbname, editingCourse._id, updatedData);

      setCourses((prev) =>
        prev.map((course) =>
          course._id === editingCourse._id ? { ...course, ...updatedData } : course
        )
      );

      setEditingCourse(null);
    } catch (err) {
      console.error('❌ Failed to update course:', err);
      Swal.fire({
        title: 'Update Failed',
        text: 'Something went wrong while updating the course.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-lg px-6 py-2'
        }
      });
    }
  };

  const handleExamUpdateSuccess = async () => {
    const courseList = await getCoursesBySchool(schoolId, dbname);
    setCourses(courseList);
  };

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );

  // Empty State Component
  const EmptyState = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCourse ? (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                  <p className="text-gray-600">Manage your educational courses and content</p>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
              <LoadingSpinner />
            ) : courses.length === 0 ? (
              <EmptyState 
                title="No Courses Yet" 
                description="Start by creating your first course to begin building your educational content."
                icon="📚"
              />
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group h-full flex flex-col"
                  >
                    {/* Course Image */}
                    <div className="relative overflow-hidden flex-shrink-0">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseName}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => handleCourseClick(course)}
                      />
                      <div className="absolute top-3 right-3">
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => setEditingCourse(course)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-yellow-600 hover:bg-yellow-50 transition-colors shadow-sm"
                            title="Edit Course"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenExamModal(course._id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                            title="Manage Exams"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                            title="Delete Course"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Course Content - This will grow to fill remaining space */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.courseName}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span className="text-lg font-bold text-green-600">₹{course.fee}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.isPreliminaryRequired 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {course.isPreliminaryRequired ? 'Prerequisites' : 'Open Access'}
                        </span>
                      </div>

                      {/* Description - This will expand to fill remaining space */}
                      <div className="flex-1 mb-4">
                        {course.description && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {course.description}
                          </p>
                        )}
                      </div>

                      {/* Button stays at bottom */}
                      <button
                        onClick={() => handleCourseClick(course)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium mt-auto"
                      >
                        View Sections
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Back Navigation */}
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Courses</span>
              </button>
            </div>

            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedCourse.courseThumbnail}
                  alt={selectedCourse.courseName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedCourse.courseName}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-green-600 font-semibold">₹{selectedCourse.fee}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedCourse.isPreliminaryRequired 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedCourse.isPreliminaryRequired ? 'Prerequisites Required' : 'Open Access'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Course Sections</h2>
                <p className="text-gray-600 text-sm">Manage sections and their content</p>
              </div>

              {loadingSections ? (
                <LoadingSpinner />
              ) : sections.length === 0 ? (
                <EmptyState 
                  title="No Sections Yet" 
                  description="Create sections to organize your course content and videos."
                  icon="📋"
                />
              ) : (
                <div className="divide-y divide-gray-200">
                  {sections.map((section, index) => (
                    <div key={section._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                              {index + 1}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">{section.sectionName}</h3>
                          </div>

                          <div className="flex items-center space-x-4 ml-11">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              section.examRequired 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {section.examRequired ? '📝 Exam Required' : '📖 No Exam'}
                            </span>
                            
                            {section.exam && (
                              <span className="text-sm text-gray-600">
                                Exam: {section.exam.examName}
                              </span>
                            )}

                            <span className="text-sm text-gray-500">
                              {section.videos?.length || 0} videos
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/school/${dbname}/section/${section._id}/add-video`)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Video
                          </button>
                          
                          <button
                            onClick={() => handleShowVideos(section)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l4.828 4.828a1 1 0 001.414 0l2.122-2.122a1 1 0 000-1.414L14.828 7.757A1 1 0 0014.121 7.464L12 9.586V10z" />
                            </svg>
                            Show Videos
                          </button>
                          
                          <button
                            onClick={() => handleOpenAddExamModal(section._id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Add Exam
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSection(section._id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Modals */}
        <VideoModal
          open={videoModalOpen}
          currentVideo={currentVideo}
          currentVideoIndex={currentVideoIndex}
          videoCount={videoIds.length}
          loadingVideo={loadingVideo}
          onClose={closeModal}
          onDelete={() => currentVideo && handleDeleteVideo(currentVideo._id)}
          onNext={() =>
            setCurrentVideoIndex((prev) => Math.min(prev + 1, videoIds.length - 1))
          }
          onPrev={() =>
            setCurrentVideoIndex((prev) => Math.max(prev - 1, 0))
          }
        />

        {editingCourse && (
          <EditCourseModal
            course={editingCourse}
            onClose={() => setEditingCourse(null)}
            onSave={handleUpdateCourse}
          />
        )}

        {examModalCourseId && (
          <ModalExamSelector
            schoolId={schoolId}
            dbname={dbname}
            courseId={examModalCourseId}
            schoolName={dbname}
            isOpen={examModalOpen}
            onClose={handleCloseExamModal}
            onSuccess={handleExamUpdateSuccess}
            currentPreliminaryExam={courses.find(c => c._id === examModalCourseId)?.preliminaryExam || null}
            currentFinalExam={courses.find(c => c._id === examModalCourseId)?.finalExam || null}
          />
        )}

        {selectedSectionIdForExam && (
          <AddExamToSectionModal
            isOpen={addExamModalOpen}
            onClose={() => {
              setAddExamModalOpen(false);
              setSelectedSectionIdForExam(null);
            }}
            schoolName={dbname}
            sectionId={selectedSectionIdForExam}
            onSuccess={() => selectedCourse && fetchSections(selectedCourse._id)}
          />
        )}
      </div>
    </div>
  );
};

export default SchoolCourses;

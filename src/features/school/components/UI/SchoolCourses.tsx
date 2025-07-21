import React, { useEffect, useState } from 'react';
import { Course } from '../../types/Course';
import { Props } from '../../types/Props';
import { useNavigate } from 'react-router-dom';
import VideoModal from '../../components/UI/VideoModal';
import Section from '../../../course/types/Section';
import EditCourseModal from './EditCourseModal';
import { Video } from '../../types/Video';
import { getCoursesBySchool, getSectionsByCourse, getVideoById, updateCourseById, deleteCourseById } from '../../api/course.api'
import Swal from 'sweetalert2';
const SchoolCourses: React.FC<Props> = ({ schoolId, dbname }) => {
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

  const navigate = useNavigate();

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

  // Load sections
  const handleCourseClick = async (course: Course) => {
    setSelectedCourse(course);
    setLoadingSections(true);
    try {
      // New:
      const fetchedSections = await getSectionsByCourse(dbname, course._id);
      setSections(fetchedSections);

    } catch (err) {
      console.error('❌ Failed to fetch sections:', err);
    } finally {
      setLoadingSections(false);
    }
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setSections([]);
  };

const handleDeleteCourse = async (courseId: string) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You won’t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (!result.isConfirmed) return;

  try {
    await deleteCourseById(dbname, courseId);
    setCourses((prev) => prev.filter((c) => c._id !== courseId));

    await Swal.fire({
      title: 'Deleted!',
      text: 'The course has been deleted.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
    });
  } catch (err) {
    console.error('❌ Failed to delete course:', err);
    Swal.fire({
      title: 'Error!',
      text: 'Something went wrong while deleting the course.',
      icon: 'error',
      confirmButtonColor: '#d33',
    });
  }
};


  const handleShowVideos = (section: Section) => {
    if (!section.videos || section.videos.length === 0) {
      alert('⚠️ No videos in this section.');
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
        // New:
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
      // New:
      await updateCourseById(dbname, editingCourse._id, updatedData);


      setCourses((prev) =>
        prev.map((course) =>
          course._id === editingCourse._id ? { ...course, ...updatedData } : course
        )
      );

      setEditingCourse(null);
    } catch (err) {
      console.error('❌ Failed to update course:', err);
      alert('Something went wrong while updating course.');
    }
  };

  return (
    <div className="p-6">
      {!selectedCourse ? (
        <>
          <h2 className="text-xl font-bold mb-4">🎓 Courses Offered</h2>
          {loading ? (
            <p className="text-gray-600">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-600">No courses added yet.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white shadow rounded-lg p-4 relative hover:shadow-md transition"
                >
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseName}
                    className="w-full h-32 object-cover rounded mb-3 cursor-pointer"
                    onClick={() => handleCourseClick(course)}
                  />
                  <h3 className="text-lg font-semibold">{course.courseName}</h3>
                  <p className="text-gray-500">
                    ₹{course.fee}
                  </p>
                  <p className="text-sm text-gray-600">
                    {course.isPreliminaryRequired ? 'Preliminary Required' : 'Open to All'}
                  </p>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                 </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
          >
            ← Back to Courses
          </button>
          <h2 className="text-xl font-bold mb-4">
            📘 Sections for {selectedCourse.courseName}
          </h2>
          {loadingSections ? (
            <p className="text-gray-600">Loading sections...</p>
          ) : sections.length === 0 ? (
            <p className="text-gray-500">No sections available for this course.</p>
          ) : (
            <ul className="space-y-4">
              {sections.map((section) => (
                <li
                  key={section._id}
                  className="p-4 bg-white rounded shadow border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-lg font-semibold">{section.sectionName}</h4>
                    <p className="text-sm text-gray-500">
                      {section.examRequired ? '📝 Exam Required' : '✅ No Exam'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/school/${dbname}/section/${section._id}/add-video`)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm shadow"
                    >
                      ➕ Add Video
                    </button>
                    <button
                      onClick={() => handleShowVideos(section)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm shadow"
                    >
                      ▶️ Show Videos
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* 🎬 Video Modal */}
      <VideoModal
        open={videoModalOpen}
        currentVideo={currentVideo}
        currentVideoIndex={currentVideoIndex}
        videoCount={videoIds.length}
        loadingVideo={loadingVideo}
        onClose={closeModal}
        onNext={() =>
          setCurrentVideoIndex((prev) => Math.min(prev + 1, videoIds.length - 1))
        }
        onPrev={() =>
          setCurrentVideoIndex((prev) => Math.max(prev - 1, 0))
        }
      />

      {/* ✏️ Edit Course Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleUpdateCourse}
        />
      )}
    </div>
  );
};

export default SchoolCourses;

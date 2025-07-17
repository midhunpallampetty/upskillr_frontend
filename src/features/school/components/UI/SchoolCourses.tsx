import React, { useEffect, useState } from 'react';
import { Course } from '../../types/Course';
import { Props } from '../../types/Props';
import { getCoursesBySchool } from '../../api/course.api';
import { useNavigate } from 'react-router-dom';
import VideoModal from '../../components/UI/VideoModal';
import Section from '../../../course/types/Section';
import EditCourseModal from './EditCourseModal';
import { Video } from '../../types/Video';
import courseAxios from '../../../../utils/axios/course';

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
      const res = await courseAxios.get(
        `/${dbname}/courses/${course._id}/sections`
      );
      setSections(res.data.data || []);
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
        const res = await courseAxios.get(
          `/getvideo/${dbname}/${videoId}`
        );

        if (!isCancelled) {
          const videoData = res.data?.data;
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
      await courseAxios.put(
        `/${dbname}/course/${editingCourse._id}`,
        updatedData
      );

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
                    ₹{course.fee} • {course.noOfLessons} Lessons
                  </p>
                  <p className="text-sm text-gray-600">
                    {course.isPreliminaryRequired ? 'Preliminary Required' : 'Open to All'}
                  </p>
                  <button
                    onClick={() => setEditingCourse(course)}
                    className="absolute top-2 right-2 text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    ✏️ Edit
                  </button>
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

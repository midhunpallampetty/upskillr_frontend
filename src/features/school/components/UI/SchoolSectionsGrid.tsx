import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Props } from './../../types/Props';
import Section from '../../../course/types/Section';
import { Course } from './../../types/Course';
import { useNavigate } from 'react-router-dom';

const SchoolSectionsGrid: React.FC<Props> = ({ dbname }) => {
  const [sectionsByCourse, setSectionsByCourse] = useState<Record<string, Section[]>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSectionsGroupedByCourses = async () => {
      try {
        const coursesRes = await axios.get(
          `https://course.upskillr.online/api/schools/${dbname}/courses`
        );
        const courseList: Course[] = coursesRes.data.courses;
        setCourses(courseList);

        const allSections: Record<string, Section[]> = {};

        await Promise.all(
          courseList.map(async (course) => {
            const sectionsRes = await axios.get(
              `https://course.upskillr.online/api/schools/${dbname}/courses/${course._id}/sections`
            );
            allSections[course._id] = sectionsRes.data.data;
          })
        );

        setSectionsByCourse(allSections);
      } catch (err) {
        console.error('❌ Failed to fetch sections:', err);
      } finally {
        setLoading(false);
      }
    };

    if (dbname) {
      fetchSectionsGroupedByCourses();
    }
  }, [dbname]);

  if (loading) return <p className="p-6 text-gray-600">Loading sections...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📚 Course Sections</h2>
      {courses.length === 0 ? (
        <p className="text-gray-600">No courses found.</p>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{course.courseName}</h3>
              {sectionsByCourse[course._id]?.length > 0 ? (
                <ul className="space-y-2 text-sm text-gray-700">
                  {sectionsByCourse[course._id].map((section) => (
                    <li
                      key={section._id}
                      className="border p-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{section.sectionName}</span>
                        <span className="text-xs text-gray-500">
                          {section.examRequired ? '📝 Exam' : '✅ No Exam Required'}
                        </span>
                        <span className="text-xs text-gray-600">{section.videos.length} 🎥 videos</span>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/school/${dbname}/section/${section._id}/add-video`)
                        }
                        className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded shadow"
                      >
                        ➕ Add Video
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No sections added for this course.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolSectionsGrid;

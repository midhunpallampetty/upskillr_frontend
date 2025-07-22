import courseAxios from '../../../utils/axios/course';
import { Course } from '../types/Course';
import Section from '../../course/types/Section';
import { Video } from '../types/Video';
export const getCoursesBySchool = async (
  schoolId: string,
  dbname: string
): Promise<Course[]> => {
  let courses: Course[] = [];

  try {
    const response = await courseAxios.get(
      `/${dbname}/courses?schoolId=${schoolId}`
    );
    courses = response.data?.courses || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
  } finally {
    return courses;
  }
};
export const getSectionsByCourse = async (
  dbname: string,
  courseId: string
): Promise<Section[]> => {
  const res = await courseAxios.get(`/${dbname}/courses/${courseId}/sections`);
  return res.data?.data || [];
};
export const softDeleteVideoById = async (schoolName: string, videoId: string) => {
  const res = await courseAxios.patch(
    `/${schoolName}/videos/${videoId}/soft-delete`
  );
  return res.data;
};
export const getVideoById = async (
  dbname: string,
  videoId: string
): Promise<Video | null> => {
  const res = await courseAxios.get(`/getvideo/${dbname}/${videoId}`);
  const videoData = res.data?.data;
  if (Array.isArray(videoData)) {
    return videoData[0] || null;
  }
  return videoData || null;
};

export const updateCourseById = async (
  dbname: string,
  courseId: string,
  updatedData: Partial<Course>
): Promise<void> => {
  await courseAxios.put(`/${dbname}/course/${courseId}`, updatedData);
};
export const deleteCourseById = async (
  dbname: string,
  courseId: string
): Promise<void> => {
  await courseAxios.patch(`/${dbname}/course/${courseId}/soft-delete`, {
    isDeleted: true,
  });
};
export const softDeleteSectionById = async (schoolDb: string, sectionId: string) => {
  try {
    const response = await courseAxios.patch(
      `/${schoolDb}/sections/${sectionId}/soft-delete`
    );

    return response.data; // Contains the message + data
  } catch (error: any) {
    const message =
      error.response?.data?.message || 'Failed to soft delete section';
    throw new Error(message);
  }
};
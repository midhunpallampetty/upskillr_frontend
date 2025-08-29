import courseAxios from '../../../utils/axios/course';
import { apiRequest } from '../../../utils/apiRequest';
import { Course } from '../types/Course';
import Section from '../../course/types/Section';
import { Video } from '../types/Video';

// Get courses by school
export const getCoursesBySchool = async (
  schoolId: string,
  dbname: string
): Promise<Course[]> => {
  try {
    const data = await apiRequest<{ courses: Course[] }>(
      courseAxios,
      'get',
      `/${dbname}/courses?schoolId=${schoolId}`
    );
    return data?.courses || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Get sections by course
export const getSectionsByCourse = async (
  dbname: string,
  courseId: string
): Promise<Section[]> => {
  const data = await apiRequest<{ data: Section[] }>(
    courseAxios,
    'get',
    `/${dbname}/courses/${courseId}/sections`
  );
  return data?.data || [];
};

// Soft delete video
export const softDeleteVideoById = async (
  schoolName: string,
  videoId: string
): Promise<any> => {
  return apiRequest(
    courseAxios,
    'patch',
    `/${schoolName}/videos/${videoId}/soft-delete`
  );
};

// Get video by ID
export const getVideoById = async (
  dbname: string,
  videoId: string
): Promise<Video | null> => {
  const data = await apiRequest<{ data: Video[] | Video }>(
    courseAxios,
    'get',
    `/getvideo/${dbname}/${videoId}`
  );

  if (Array.isArray(data?.data)) {
    return data.data[0] || null;
  }
  return (data as any)?.data || null;
};

// Update course by ID
export const updateCourseById = async (
  dbname: string,
  courseId: string,
  updatedData: Partial<Course>
): Promise<void> => {
  await apiRequest(
    courseAxios,
    'put',
    `/${dbname}/course/${courseId}`,
    updatedData
  );
};

// Soft delete course by ID
export const deleteCourseById = async (
  dbname: string,
  courseId: string
): Promise<void> => {
  await apiRequest(
    courseAxios,
    'patch',
    `/${dbname}/course/${courseId}/soft-delete`,
    { isDeleted: true }
  );
};

// Soft delete section by ID
export const softDeleteSectionById = async (
  schoolDb: string,
  sectionId: string
): Promise<any> => {
  try {
    return await apiRequest(
      courseAxios,
      'patch',
      `/${schoolDb}/sections/${sectionId}/soft-delete`
    );
  } catch (error: any) {
    const message =
      error.response?.data?.message || 'Failed to soft delete section';
    throw new Error(message);
  }
};

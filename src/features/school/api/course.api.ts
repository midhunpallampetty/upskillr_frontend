import courseAxios from '../../../utils/axios/course';
import { apiRequest } from '../../../utils/apiRequest';
import { Course } from '../types/Course';
import Section from '../../course/types/Section';
import { Video } from '../types/Video';

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

export const softDeleteVideoById = async (
  schoolName: string,
  videoId: string
) => {
  return await apiRequest<any>(
    courseAxios,
    'patch',
    `/${schoolName}/videos/${videoId}/soft-delete`
  );
};

export const getVideoById = async (
  dbname: string,
  videoId: string
): Promise<Video | null> => {
  const data = await apiRequest<{ data: Video | Video[] }>(
    courseAxios,
    'get',
    `/getvideo/${dbname}/${videoId}`
  );

  if (Array.isArray(data?.data)) {
    return data.data[0] || null;
  }
  return data?.data || null;
};

export const updateCourseById = async (
  dbname: string,
  courseId: string,
  updatedData: Partial<Course>
): Promise<void> => {
  await apiRequest<void>(
    courseAxios,
    'put',
    `/${dbname}/course/${courseId}`,
    updatedData
  );
};

export const deleteCourseById = async (
  dbname: string,
  courseId: string
): Promise<void> => {
  await apiRequest<void>(
    courseAxios,
    'patch',
    `/${dbname}/course/${courseId}/soft-delete`,
    { isDeleted: true }
  );
};

export const softDeleteSectionById = async (
  schoolDb: string,
  sectionId: string
) => {
  try {
    return await apiRequest<any>(
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

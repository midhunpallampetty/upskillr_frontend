import courseAxios from '../../../utils/axios/course';
import { Course } from '../types/Course';

export const getCoursesBySchool = async (
  schoolId: string,
  dbname: string
): Promise<Course[]> => {
  let courses: Course[] = [];

  try {
    const response = await courseAxios.get(
      `/${dbname}/courses?schoolId=${schoolId}`
    );
    courses = response.data.courses || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
  } finally {
    return courses;
  }
};

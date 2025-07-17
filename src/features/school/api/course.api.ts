
import courseAxios from '../../../utils/axios/course';
import { Course } from '../types/Course';

export const getCoursesBySchool = async (
  schoolId: string,
  dbname: string
): Promise<Course[]> => {
  const response = await courseAxios.get(
    `/${dbname}/courses?schoolId=${schoolId}`
  );
  return response.data.courses || [];
};

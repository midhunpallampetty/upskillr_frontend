import axios from 'axios';
import { Course } from '../types/Course';

export const getCoursesBySchool = async (
  schoolId: string,
  dbname: string
): Promise<Course[]> => {
  const response = await axios.get(
    `http://course.localhost:5000/api/${dbname}/courses?schoolId=${schoolId}`
  );
  return response.data.courses || [];
};

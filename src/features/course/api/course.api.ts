import { CoursePayload } from '../types/CoursePayload';
import courseAxios from '../../../utils/axios/course';


export const addCourseToSchool = async (
  dbname: string,
  payload: CoursePayload
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {

    const response = await courseAxios.post(`/school/${dbname}/add-course`, payload);
    return { success: true, data: response.data };
  } catch (err: any) {
    const errorMsg =
      err.response?.data?.message || err.message || 'Unknown error occurred';
    return { success: false, error: errorMsg };
  }
};

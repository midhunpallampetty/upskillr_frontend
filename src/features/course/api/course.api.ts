import { CoursePayload } from '../types/CoursePayload';
import courseAxios from '../../../utils/axios/course';
import { apiRequest } from '../../../utils/apiRequest';

// Add Course to School
export const addCourseToSchool = async (
  dbname: string,
  payload: CoursePayload
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const data = await apiRequest<any>(
      courseAxios,
      'post',
      `/school/${dbname}/add-course`,
      payload
    );
    return { success: true, data };
  } catch (err: any) {
    const errorMsg =
      err.response?.data?.message || err.message || 'Unknown error occurred';
    return { success: false, error: errorMsg };
  }
};

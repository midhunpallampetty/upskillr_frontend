import axios from 'axios';

interface SectionPayload {
  sectionName: string;
  examRequired: boolean;
  videos: any[];
}

interface CoursePayload {
  courseName: string;
  isPreliminaryRequired: boolean;
  courseThumbnail: string;
  noOfLessons: number;
  fee: number;
  sections: SectionPayload[];
  forum: null;
  schoolId: string;
}

export const addCourseToSchool = async (
  dbname: string,
  payload: CoursePayload
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const baseURL = import.meta.env.VITE_COURSE_API_BASE;
    const url = `${baseURL}/school/${dbname}/add-course`;
    const response = await axios.post(url, payload);
    return { success: true, data: response.data };
  } catch (err: any) {
    const errorMsg =
      err.response?.data?.message || err.message || 'Unknown error occurred';
    return { success: false, error: errorMsg };
  }
};

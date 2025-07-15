import axios from 'axios';

export const fetchCoursesBySchool = async (schoolName: string): Promise<{
  success: boolean;
  courses?: any[];
  error?: string;
}> => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_COURSE_API_BASE}/courses`, {
      schoolName,
    });

    return {
      success: true,
      courses: res.data.courses,
    };
  } catch (err: any) {
    const errorMsg =
      err.response?.data?.message || err.message || 'Failed to fetch courses.';
    return {
      success: false,
      error: errorMsg,
    };
  }
};

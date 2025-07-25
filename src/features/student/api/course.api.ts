import courseAxios from '../../../utils/axios/course';
export const fetchCoursesBySchool = async (schoolName: string): Promise<{
  success: boolean;
  courses?: any[];
  error?: string;
}> => {
  try {
    const res = await courseAxios.post(`/courses`, {
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

import courseAxios from '../../../utils/axios/course';
import { CourseType } from '../types/Course';
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
export const fetchPurchasedCourses = async (studentId: string) => {
  try {
    const response = await courseAxios.get(`/course/school-info/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch purchased courses:', error);
    throw error;
  }
};
export const fetchCourseData = async (schoolName: string, courseId: string): Promise<CourseType> => {
  try {
    const response = await courseAxios.get(
      `/courses/${schoolName}/${courseId}/complete`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw new Error('Failed to fetch course data');
  }
};

// Updated API functions (with minor improvements for consistency and error handling)
export const fetchStudentProgress = async (schoolName: string, courseId: string, studentId: string) => {
  try {
    const response = await courseAxios.get(
      `/${schoolName}/courses/${courseId}/progress?studentId=${studentId}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch student progress:', error);
    throw new Error('Failed to fetch student progress');
  }
};

// NEW: Save video progress
export const saveVideoProgress = async (
  schoolName: string, 
  courseId: string, 
  videoId: string, 
  progressData: { studentId: string; completed?: boolean; lastPosition?: number }
) => {
  try {
    const response = await courseAxios.post(
      `/${schoolName}/courses/${courseId}/videos/${videoId}/progress`,
      progressData
    );
    return response.data;
  } catch (error) {
    console.error('Failed to save video progress:', error);
    throw new Error('Failed to save video progress');
  }
};

// NEW: Issue certificate
export const issueCertificate = async (schoolName: string, courseId: string, studentId: string) => {
  try {
    const response = await courseAxios.get(
      `/${schoolName}/courses/${courseId}/certificate?studentId=${studentId}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to issue certificate:', error);
    throw new Error('Failed to issue certificate');
  }
};

export const checkSectionExamCompletionApi = async (schoolName: string, courseId: string, studentId: string, sectionId: string) => {
  const response = await courseAxios.get(`/${schoolName}/${courseId}/${studentId}/${sectionId}/completion`);
  return response.data;
};

export const saveExamProgress = async (schoolName: string, courseId: string, sectionId: string, studentId: string, score: number) => {
  const response = await courseAxios.post(`/${schoolName}/courses/${courseId}/sections/${sectionId}/progress`, {
    studentId,
    score,
  });
  return response.data;
};
export const addCertificate = async (schoolName: string, courseId: string, studentId: string) => {
  const response = await courseAxios.post(
    `/${schoolName}/courses/${courseId}/certificates`,
    { studentId }
  );
  return response.data.certificateUrl;
};

// NEW: API function to update an existing certificate
export  const updateCertificate = async (schoolName: string, courseId: string, studentId: string, dateIssued: string) => {
  const response = await courseAxios.put(
    `/${schoolName}/courses/${courseId}/certificates`,
    { studentId, dateIssued }
  );
  return response.data.certificateUrl;
};

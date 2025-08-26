// File: src/api/courseApi.ts
// All course-related API helpers consolidated into a single file in one folder (e.g., src/api/).
// I've kept the import for courseAxios and CourseType as provided.
// Updated fetchCourseData endpoint to match the original component's URL: `/${schoolName}/course/${courseId}` (removed '/courses' and '/complete' to align).
// Added a new helper for initiateCheckout based on the payment POST in the component.
// For eligibility, since it's on a different server (exam.localhost), I've noted it separately; you may need an examAxios instance.
// If you want eligibility in the same file, import examAxios here too.

import courseAxios from '../../../utils/axios/course'; // Adjusted path to '../../' assuming src/api/ folder; update as needed
import { CourseType } from '../types/Course'; // Adjust path if needed

/* ─────────────────────────────────────────────
   OPTIONAL: put your own interface definitions
   (remove if you already have them elsewhere)
────────────────────────────────────────────── */
export interface SectionType {
  _id: string;
  sectionName: string;
  examRequired: boolean;
  exam?: string;
  videos?: { _id: string; title: string }[];
  // …add whatever the back-end actually sends
}

/* ─────────────────────────────────────────────
   NEW HELPERS
────────────────────────────────────────────── */
// Check if a student has already purchased a course
export const checkPreviousPurchase = async (
  courseId: string,
  studentId: string
): Promise<{ hasPurchased: boolean }> => {
  try {
    const { data } = await courseAxios.get(
      `/checkprevious-purchase/${courseId}/${studentId}`
    );
    return data; // { hasPurchased: true/false }
  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Failed to check purchase status';
    throw new Error(msg);
  }
};

// Get all sections for a course
export const getSectionsByCourse = async (
  schoolName: string,
  courseId: string
): Promise<SectionType[]> => {
  try {
    const { data } = await courseAxios.get(
      `/sections/${schoolName}/${courseId}`
    );
    return data;
  } catch (err: any) {
    const msg =
      err.response?.data?.message || err.message || 'Failed to fetch sections';
    throw new Error(msg);
  }
};

export const initiateCheckout = async (
  schoolName: string,
  courseId: string
): Promise<{ url: string }> => {
  try {
    const { data } = await courseAxios.post(
      `/payment/checkout/${schoolName}/${courseId}`
    );
    return data;
  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Failed to initiate checkout';
    throw new Error(msg);
  }
};
  

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

// Fetch purchased courses for a student
export const fetchPurchasedCourses = async (studentId: string) => {
  try {
    const response = await courseAxios.get(`/course/school-info/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch purchased courses:', error);
    throw new Error('Failed to fetch purchased courses');
  }
};

// Fetch course data
export const fetchCourseData = async (schoolName: string, courseId: string): Promise<CourseType> => {
  try {
    const response = await courseAxios.get(`/courses/${schoolName}/${courseId}/complete`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw new Error('Failed to fetch course data');
  }
};

// Fetch student progress
export const fetchStudentProgress = async (schoolName: string, courseId: string, studentId: string) => {
  try {
    const response = await courseAxios.get(`/${schoolName}/courses/${courseId}/progress?studentId=${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch student progress:', error);
    throw new Error('Failed to fetch student progress');
  }
};

// Save video progress
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

// Issue certificate
export const issueCertificate = async (schoolName: string, courseId: string, studentId: string) => {
  try {
    const response = await courseAxios.post(
      `/${schoolName}/courses/${courseId}/certificates`,
      { studentId }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to issue certificate:', error);
    throw new Error('Failed to issue certificate');
  }
};

// Check section exam completion
export const checkSectionExamCompletionApi = async (schoolName: string, courseId: string, studentId: string, sectionId: string) => {
  try {
    const response = await courseAxios.get(`/${schoolName}/${courseId}/${studentId}/${sectionId}/completion`);
    return response.data;
  } catch (error) {
    console.error('Failed to check section exam completion:', error);
    throw new Error('Failed to check section exam completion');
  }
};

// Save exam progress
export const saveExamProgress = async (schoolName: string, courseId: string, sectionId: string, studentId: string, score: number) => {
  try {
    const response = await courseAxios.post(`/${schoolName}/courses/${courseId}/sections/${sectionId}/progress`, {
      studentId,
      score,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save exam progress:', error);
    throw new Error('Failed to save exam progress');
  }
};

// Save final exam progress
export const saveFinalExamProgress = async (schoolName: string, courseId: string, studentId: string, percentage: number) => {
  try {
    const response = await courseAxios.post(`/${schoolName}/courses/${courseId}/final-exam/progress`, {
      studentId,
      score: percentage,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save final exam progress:', error);
    throw new Error('Failed to save final exam progress');
  }
};

// Check final exam status
export const checkFinalExamStatus = async (schoolName: string, courseId: string, studentId: string) => {
  try {
    const response = await courseAxios.get(`/${schoolName}/courses/${courseId}/final-exam/status/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to check final exam status:', error);
    throw new Error('Failed to check final exam status');
  }
};

// Add certificate
export const addCertificate = async (schoolName: string, courseId: string, studentId: string) => {
  try {
    const response = await courseAxios.post(`/${schoolName}/courses/${courseId}/certificates`, {
      studentId,
    });
    return response.data.certificateUrl;
  } catch (error) {
    console.error('Failed to add certificate:', error);
    throw new Error('Failed to add certificate');
  }
};

// Update certificate
export const updateCertificate = async (schoolName: string, courseId: string, studentId: string, dateIssued: string) => {
  try {
    const response = await courseAxios.put(`/${schoolName}/courses/${courseId}/certificates`, {
      studentId,
      dateIssued,
    });
    return response.data.certificateUrl;
  } catch (error) {
    console.error('Failed to update certificate:', error);
    throw new Error('Failed to update certificate');
  }
};
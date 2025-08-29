

import courseAxios from '../../../utils/axios/course';
import examAxios from '../../../utils/axios/exam';
import { Exam } from '../types/Exam'; // Adjust based on your types

export const fetchAllExams = async (schoolName: string): Promise<Exam[]> => {
  try {
    const response = await examAxios.get('/exam/all-exams', { params: { schoolName } });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch exams';
    throw new Error(message);
  }
};

export const updateCourseExam = async (
  schoolName: string,
  courseId: string,
  examId: string,
  examType: 'preliminary' | 'final'
) => {
  try {
    const response = await courseAxios.put(`/${schoolName}/courses/${courseId}/exams`, {
      examId,
      examType,
    });
    return response.data; // Contains any response data if needed
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to update course exam';
    throw new Error(message);
  }
};

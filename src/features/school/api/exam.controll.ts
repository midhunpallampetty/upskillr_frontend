import courseAxios from '../../../utils/axios/course';
import examAxios from '../../../utils/axios/exam';
import { apiRequest } from '../../../utils/apiRequest';
import { Exam } from '../types/Exam';

// Fetch all exams
export const fetchAllExams = async (schoolName: string): Promise<Exam[]> => {
  return await apiRequest<Exam[]>(examAxios, 'get', '/exam/all-exams', null, {
    params: { schoolName },
  });
};

// Update course exam
export const updateCourseExam = async (
  schoolName: string,
  courseId: string,
  examId: string,
  examType: 'preliminary' | 'final'
) => {
  return await apiRequest(courseAxios, 'put', `/${schoolName}/courses/${courseId}/exams`, {
    examId,
    examType,
  });
};

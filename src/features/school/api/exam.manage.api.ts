// api/exams.ts
import examAxios from '../../../utils/axios/exam';
import { apiRequest } from '../../../utils/apiRequest';

// Fetch all exams
export const fetchExams = async (schoolName: string) => {
  return await apiRequest(examAxios, 'get', '/exam/all-exams', null, {
    params: { schoolName },
  });
};

// Create exam
export const createExam = async (schoolName: string, title: string) => {
  return await apiRequest(examAxios, 'post', '/exam', { schoolName, title });
};

// Delete exam
export const deleteExam = async (examId: string, schoolName: string) => {
  return await apiRequest(examAxios, 'delete', `/exam/${examId}/${schoolName}`);
};

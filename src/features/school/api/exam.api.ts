import examAxios from '../../../utils/axios/exam';
import { apiRequest } from './../../../utils/apiRequest';
import courseAxios from '../../../utils/axios/course';

import { Exam } from '../types/Exam';
// Fetch all exams for a school
export const fetchExams = (dbName: string) => {
  return apiRequest(examAxios, 'get', '/exam/all-exams', undefined, {
    params: { schoolName: dbName },
  });
};

// Fetch all questions for a school
export const fetchQuestions = (dbName: string) => {
  return apiRequest(examAxios, 'get', '/question/get-all', undefined, {
    params: { schoolName: dbName },
  });
};

// Create a new exam
export const createExam = (dbName: string, title: string) => {
  return apiRequest(examAxios, 'post', '/exam', { schoolName: dbName, title });
};

// Update an existing exam
export const updateExam = (examId: string, dbName: string, title: string) => {
  return apiRequest(examAxios, 'put', `/exam/${examId}/${dbName}`, { title });
};

// Delete an exam
export const deleteExam = (examId: string, dbName: string) => {
  return apiRequest(examAxios, 'delete', `/exam/${examId}/${dbName}`);
};

// Create a new question
export const createQuestion = (dbName: string, questionData: any) => {
  return apiRequest(examAxios, 'post', '/question', { schoolName: dbName, ...questionData });
};

// Update a question
export const updateQuestion = (questionId: string, dbName: string, updateBody: any) => {
  return apiRequest(examAxios, 'put', `/question/${questionId}/${dbName}`, updateBody);
};

// Delete a question
export const deleteQuestion = (questionId: string, dbName: string) => {
  return apiRequest(examAxios, 'delete', `/question/${questionId}/${dbName}`);
};






// ✅ Get all exams by school
export const getAllExams = async (schoolName: string): Promise<Exam[]> => {
  const data = await apiRequest<Exam[]>(
    examAxios,
    'get',
    `/exam/all-exams?schoolName=${schoolName}`
  );
  return data || [];
};

// ✅ Get current section exam
export const getSectionExam = async (
  schoolName: string,
  sectionId: string
): Promise<Exam | null> => {
  try {
    const data = await apiRequest<{ data: Exam }>(
      courseAxios,
      'get',
      `/${schoolName}/sections/${sectionId}/exam`
    );
    return data?.data || null;
  } catch (error: any) {
    if (error.response?.status === 404) return null; // no exam assigned
    throw error;
  }
};

// ✅ Add or replace exam for section
export const addExamToSection = async (
  schoolName: string,
  sectionId: string,
  examId: string
) => {
  return await apiRequest<any>(
    courseAxios,
    'post',
    `/${schoolName}/sections/${sectionId}/exam`,
    { examId }
  );
};

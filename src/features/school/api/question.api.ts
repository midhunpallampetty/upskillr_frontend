// api/questions.ts
import examAxios from '../../../utils/axios/exam';
import { apiRequest } from '../../../utils/apiRequest';

// Fetch all questions
export const fetchQuestions = async (schoolName: string) => {
  return await apiRequest(examAxios, 'get', '/question/get-all', null, {
    params: { schoolName },
  });
};

// Create a new question
export const createQuestion = async (
  schoolName: string,
  question: string,
  options: string[],
  answer: string,
  examId: string
) => {
  return await apiRequest(examAxios, 'post', '/question', {
    schoolName,
    question,
    options,
    answer,
    examId,
  });
};

// Update an existing question
export const updateQuestion = async (
  questionId: string,
  schoolName: string,
  question: string,
  options: string[],
  correctAnswer: string,
  examId: string
) => {
  return await apiRequest(examAxios, 'put', `/question/${questionId}/${schoolName}`, {
    questionText:question,
    options,
    correctAnswer,
    examId,
  });
};

// Delete a question
export const deleteQuestion = async (questionId: string, schoolName: string) => {
  return await apiRequest(examAxios, 'delete', `/question/${questionId}/${schoolName}`);
};

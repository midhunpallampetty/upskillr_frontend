// api/questions.js
import axios from 'axios';
import examAxios from '../../../utils/axios/exam';


export const fetchQuestions = async (schoolName) => {
  try {
    const response = await examAxios.get(`/question/get-all`, {
      params: { schoolName },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error fetching questions';
    throw new Error(message);
  }
};

export const createQuestion = async (schoolName, question, options, answer, examId) => {
  try {
    const response = await examAxios.post(`/question`, {
      schoolName,
      question,
      options,
      answer,
      examId,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create question';
    throw new Error(message);
  }
};

export const updateQuestion = async (questionId, schoolName, question, options, correctAnswer, examId) => {
  try {
    const response = await examAxios.put(`/question/${questionId}/${schoolName}`, {
      question,
      options,
      correctAnswer,
      examId,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update question';
    throw new Error(message);
  }
};

export const deleteQuestion = async (questionId, schoolName) => {
  try {
    const response = await examAxios.delete(`/question/${questionId}/${schoolName}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete question';
    throw new Error(message);
  }
};

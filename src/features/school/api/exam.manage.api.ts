// api/exams.js
import axios from 'axios';
import examAxios from '../../../utils/axios/exam';


export const fetchExams = async (schoolName) => {
  try {
    const response = await examAxios.get(`/exam/all-exams`, {
      params: { schoolName },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error fetching exams';
    throw new Error(message);
  }
};

export const createExam = async (schoolName, title) => {
  try {
    const response = await examAxios.post(`/exam`, {
      schoolName,
      title,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error creating exam';
    throw new Error(message);
  }
};

export const deleteExam = async (examId, schoolName) => {
  try {
    const response = await examAxios.delete(`/exam/${examId}/${schoolName}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete exam';
    throw new Error(message);
  }
};

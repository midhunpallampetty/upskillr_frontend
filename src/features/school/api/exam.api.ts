
import examAxios from '../../../utils/axios/exam';

export const fetchExams = async (dbName) => {
  try {
    const res = await examAxios.get(`/exam/all-exams`, {
      params: { schoolName: dbName },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching exams');
    throw err;
  }
};

export const fetchQuestions = async (dbName) => {
  try {
    const res = await examAxios.get(`/question/get-all`, {
      params: { schoolName: dbName },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching questions');
    throw err;
  }
};

export const createExam = async (dbName, title) => {
  try {
    const res = await examAxios.post(`/exam`, {
      schoolName: dbName,
      title,
    });
    return res.data;
  } catch (err) {
    console.error('Error creating exam');
    throw err;
  }
};

export const updateExam = async (examId, dbName, title) => {
  try {
    const res = await examAxios.put(`/exam/${examId}/${dbName}`, {
      title,
    });
    return res.data;
  } catch (err) {
    console.error('Update exam error:', err);
    throw err;
  }
};

export const deleteExam = async (examId, dbName) => {
  try {
    const res = await examAxios.delete(`/exam/${examId}/${dbName}`);
    return res.data;
  } catch (err) {
    console.error('Delete exam error:', err);
    throw err;
  }
};

export const createQuestion = async (dbName, questionData) => {
  try {
    const res = await examAxios.post(`/question`, {
      schoolName: dbName,
      ...questionData,
    });
    console.log(questionData)
    return res.data;
  } catch (err) {
    console.error('Error creating question:', err?.response?.data || err);
    throw err;
  }
};

export const updateQuestion = async (questionId, dbName, updateBody) => {
  try {
    const res = await examAxios.put(`/question/${questionId}/${dbName}`, updateBody);
    return res.data;
  } catch (err) {
    console.error('Update error:', err);
    throw err;
  }
};

export const deleteQuestion = async (questionId, dbName) => {
  try {
    const res = await examAxios.delete(`/question/${questionId}/${dbName}`);
    return res.data;
  } catch (err) {
    console.error('Delete question error:', err);
    throw err;
  }
};

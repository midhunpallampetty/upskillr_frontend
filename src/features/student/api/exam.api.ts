import axios from 'axios';
import { Question } from '../types/exam';
import courseAxios from '../../../utils/axios/course';
export const fetchQuestions = async (courseId: string, schoolName: string): Promise<Question[]> => {
  const response = await courseAxios.get(`/questions`, {
    params: { courseId, examType: 'final', schoolName }
  });

  if (Array.isArray(response.data)) {
    return response.data.filter((q: Question) => !q.isDeleted);
  }
  throw new Error('Invalid response format');
};

export const saveExamResult = async (
  courseId: string | null,
  schoolName: string | undefined,
  studentId: string | undefined,
  studentName: string | undefined,
  result: any
) => {
  await courseAxios.post(`/exam/save-result`, {
    courseId,
    schoolName,
    studentId,
    studentName,
    result
  });
};

export const initiatePayment = async (schoolName: string | undefined, courseId: string | null): Promise<string | null> => {
  const response = await courseAxios.post(
    `/payment/checkout/${schoolName}/${courseId}`
  );
  return response.data.url || null;
};

export const getPaymentSession = async (sessionId: string) => {
  try {
    const { data } = await axios.get(`http://course.localhost:5000/api/payment/session/${sessionId}`);
    return data;
  } catch (error) {
    throw new Error('Failed to fetch payment session');
  }
};

export const savePayment = async (
  schoolId: string,
  courseId: string,
  studentId: string,
  paymentIntentId: string,
  amount: number,
  currency: string,
  status: string,
  receiptUrl: string
) => {
  try {
    await courseAxios.post('/payment/save', {
      schoolId,
      courseId,
      studentId,
      paymentIntentId,
      amount,
      currency,
      status,
      receiptUrl
    });
  } catch (error) {
    throw new Error('Failed to save payment');
  }
};








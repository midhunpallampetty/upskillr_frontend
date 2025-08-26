import axios from 'axios';
import { Question } from '../types/exam';
import courseAxios from '../../../utils/axios/course';
import examAxios from '../../../utils/axios/exam';
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
    const { data } = await courseAxios.get(`/payment/session/${sessionId}`);
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
// export const saveExam = async (
//   courseId: string | null,
//   schoolName: string | undefined,
//   studentId: string | undefined,
//   studentName: string | undefined,
//   score: { totalQuestions: number; totalMarks: number; obtainedMarks: number; correctAnswers: number; wrongAnswers: number; percentage: string },
//   examType: string
// ): Promise<void> => {
//   try {
//     if (!courseId || !schoolName || !studentId || !examType) {
//       throw new Error('Missing required parameters for saving exam result');
//     }

//     const isPassed = parseFloat(score.percentage) >= 40;

//     await axios.post(
//       `${API_BASE_URL}/submit-exam`,
//       {
//         userId: studentId,
//         courseId,
//         examType,
//         isPassed,
//       },
//       { headers: getAuthHeaders() }
//     );
//   } catch (error) {
//     throw new Error(error instanceof AxiosError ? error.response?.data.error || error.message : 'Failed to save exam result');
//   }
// };

export const checkEligibility = async (
  userId: string,
  courseId: string,
  examType: 'final' = 'final'
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const { data } = await examAxios.post('/check-eligibility', {
      userId,
      courseId,
      examType,
    });
    return { success: true, data: data.data };
  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Failed to check eligibility';
    return { success: false, error: msg };
  }
};

    




import { Question } from '../types/exam';
import courseAxios from '../../../utils/axios/course';
import examAxios from '../../../utils/axios/exam';
import { apiRequest } from '../../../utils/apiRequest';

// Fetch Questions
export const fetchQuestions = async (
  courseId: string,
  schoolName: string
): Promise<Question[]> => {
  const res = await apiRequest<any>(
    courseAxios,
    'get',
    '/questions',
    null,
    { params: { courseId, examType: 'final', schoolName } }
  );

  if (Array.isArray(res)) {
    return res.filter((q: Question) => !q.isDeleted);
  }
  throw new Error('Invalid response format');
};

// Save Exam Result
export const saveExamResult = async (
  courseId: string | null,
  schoolName: string | undefined,
  studentId: string | undefined,
  studentName: string | undefined,
  result: any
) => {
  return await apiRequest<any>(
    courseAxios,
    'post',
    '/exam/save-result',
    { courseId, schoolName, studentId, studentName, result }
  );
};

// Initiate Payment
export const initiatePayment = async (
  schoolName: string | undefined,
  courseId: string | null
): Promise<string | null> => {
  const res = await apiRequest<{ url?: string }>(
    courseAxios,
    'post',
    `/payment/checkout/${schoolName}/${courseId}`
  );
  return res.url || null;
};

// Get Payment Session
export const getPaymentSession = async (sessionId: string) => {
  try {
    return await apiRequest<any>(
      courseAxios,
      'get',
      `/payment/session/${sessionId}`
    );
  } catch {
    throw new Error('Failed to fetch payment session');
  }
};

// Save Payment
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
    return await apiRequest<any>(
      courseAxios,
      'post',
      '/payment/save',
      { schoolId, courseId, studentId, paymentIntentId, amount, currency, status, receiptUrl }
    );
  } catch {
    throw new Error('Failed to save payment');
  }
};

// Check Eligibility
export const checkEligibility = async (
  userId: string,
  courseId: string,
  examType: 'final' = 'final'
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const res = await apiRequest<{ data: any }>(
      examAxios,
      'post',
      '/check-eligibility',
      { userId, courseId, examType }
    );
    return { success: true, data: res.data };
  } catch (err: any) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Failed to check eligibility';
    return { success: false, error: msg };
  }
};

import axiosInterceptor from "../../../utils/axios/axiosInterceptor";
import schoolAxios from "../../../utils/axios/school";
import { Question, Answer, Reply } from "../types/ImportsAndTypes";


// Define response type (inferred from original code usage; move to a separate types file if preferred)
export interface StatusResponse {
  success: boolean;
  subDomain?: string;
  // Add other fields as needed based on actual API response
}

export const checkSchoolStatus = async (schoolId: string): Promise<StatusResponse> => {
  const response = await schoolAxios.get(`/school/${schoolId}/check-status`, { withCredentials: false });
  return response.data;
};






// Example response types can be defined or imported from shared types
export interface StatusResponse {
  success: boolean;
  subDomain?: string;
}

export const getQuestions = async (): Promise<Question[]> => {
  const res = await axiosInterceptor.get("/forum/questions");
  return res.data;
};

export const getQuestionById = async (id: string): Promise<Question> => {
  const res = await axiosInterceptor.get(`/forum/questions/${id}`);
  return res.data;
};

export const postQuestion = async (data: {
  question: string;
  author: string;
  category: string;
  authorType: string;
  imageUrls?: string[];
}): Promise<Question> => {
  const res = await axiosInterceptor.post("/forum/questions", data);
  return res.data;
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await axiosInterceptor.delete(`/forum/questions/${id}`);
};

export const postAnswer = async (data: {
  forum_question_id: string;
  text: string;
  author: string;
  authorType: string;
  imageUrls?: string[];
}): Promise<Answer> => {
  const res = await axiosInterceptor.post("/forum/answers", data);
  return res.data;
};

export const deleteAnswer = async (id: string): Promise<void> => {
  await axiosInterceptor.delete(`/forum/answers/${id}`);
};

export const postReply = async (data: {
  forum_question_id: string;
  forum_answer_id?: string;
  text: string;
  author: string;
  authorType: string;
  imageUrls?: string[];
  parent_reply_id?: string;
}): Promise<Reply> => {
  const res = await axiosInterceptor.post("/forum/replies", data);
  return res.data;
};

export const deleteReply = async (id: string): Promise<void> => {
  await axiosInterceptor.delete(`/forum/replies/${id}`);
};

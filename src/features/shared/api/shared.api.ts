// File: src/api/forumApi.ts

import axiosInterceptor from "../../../utils/axios/axiosInterceptor";
import schoolAxios from "../../../utils/axios/school";
import { Question, Answer, Reply } from "../types/ImportsAndTypes";
import { apiRequest } from "../../../utils/apiRequest";

/* ─────────────────────────────────────────────
   Response Types
────────────────────────────────────────────── */
export interface StatusResponse {
  success: boolean;
  subDomain?: string;
  // Add other fields if needed
}

/* ─────────────────────────────────────────────
   School APIs
────────────────────────────────────────────── */
export const checkSchoolStatus = async (schoolId: string): Promise<StatusResponse> => {
  return await apiRequest<StatusResponse>(
    schoolAxios,
    "get",
    `/school/${schoolId}/check-status`,
    null,
    { withCredentials: false }
  );
};

/* ─────────────────────────────────────────────
   Forum APIs
────────────────────────────────────────────── */
export const getQuestions = async (): Promise<Question[]> => {
  return await apiRequest<Question[]>(axiosInterceptor, "get", "/forum/questions");
};

export const getQuestionById = async (id: string): Promise<Question> => {
  return await apiRequest<Question>(axiosInterceptor, "get", `/forum/questions/${id}`);
};

export const postQuestion = async (data: {
  question: string;
  author: string;
  category: string;
  authorType: string;
  imageUrls?: string[];
}): Promise<Question> => {
  return await apiRequest<Question>(axiosInterceptor, "post", "/forum/questions", data);
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await apiRequest(axiosInterceptor, "delete", `/forum/questions/${id}`);
};

export const postAnswer = async (data: {
  forum_question_id: string;
  text: string;
  author: string;
  authorType: string;
  imageUrls?: string[];
}): Promise<Answer> => {
  return await apiRequest<Answer>(axiosInterceptor, "post", "/forum/answers", data);
};

export const deleteAnswer = async (id: string): Promise<void> => {
  await apiRequest(axiosInterceptor, "delete", `/forum/answers/${id}`);
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
  return await apiRequest<Reply>(axiosInterceptor, "post", "/forum/replies", data);
};

export const deleteReply = async (id: string): Promise<void> => {
  await apiRequest(axiosInterceptor, "delete", `/forum/replies/${id}`);
};

// File: src/api/courseApi.ts

import courseAxios from "../../../utils/axios/course";
import { CourseType } from "../types/Course";
import { apiRequest } from "../../../utils/apiRequest";

/* ─────────────────────────────────────────────
   INTERFACES
────────────────────────────────────────────── */
export interface SectionType {
  _id: string;
  sectionName: string;
  examRequired: boolean;
  exam?: string;
  videos?: { _id: string; title: string }[];
}

/* ─────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────── */

// ✅ Check if a student has already purchased a course
export const checkPreviousPurchase = async (
  courseId: string,
  studentId: string
): Promise<{ hasPurchased: boolean }> => {
  return await apiRequest(courseAxios, "get", `/checkprevious-purchase/${courseId}/${studentId}`);
};

// ✅ Get all sections for a course
export const getSectionsByCourse = async (
  schoolName: string,
  courseId: string
): Promise<SectionType[]> => {
  return await apiRequest(courseAxios, "get", `/sections/${schoolName}/${courseId}`);
};

// ✅ Initiate checkout
export const initiateCheckout = async (
  schoolName: string,
  courseId: string
): Promise<{ url: string }> => {
  return await apiRequest(courseAxios, "post", `/payment/checkout/${schoolName}/${courseId}`);
};

// ✅ Fetch courses by school
export const fetchCoursesBySchool = async (schoolName: string) => {
  return await apiRequest<{ success: boolean; courses?: any[]; error?: string }>(
    courseAxios,
    "post",
    `/courses`,
    { schoolName }
  );
};

// ✅ Fetch purchased courses for a student
export const fetchPurchasedCourses = async (studentId: string) => {
  return await apiRequest(courseAxios, "get", `/course/school-info/${studentId}`);
};

// ✅ Fetch course data
export const fetchCourseData = async (
  schoolName: string,
  courseId: string
): Promise<CourseType> => {
  const res = await apiRequest<{ data: CourseType }>(
    courseAxios,
    "get",
    `/courses/${schoolName}/${courseId}/complete`
  );
  return res.data;
};

// ✅ Fetch student progress
export const fetchStudentProgress = async (
  schoolName: string,
  courseId: string,
  studentId: string
) => {
  return await apiRequest(
    courseAxios,
    "get",
    `/${schoolName}/courses/${courseId}/progress?studentId=${studentId}`
  );
};

// ✅ Save video progress
export const saveVideoProgress = async (
  schoolName: string,
  courseId: string,
  videoId: string,
  progressData: { studentId: string; completed?: boolean; lastPosition?: number }
) => {
  return await apiRequest(
    courseAxios,
    "post",
    `/${schoolName}/courses/${courseId}/videos/${videoId}/progress`,
    progressData
  );
};

// ✅ Issue certificate
export const issueCertificate = async (
  schoolName: string,
  courseId: string,
  studentId: string
) => {
  return await apiRequest(
    courseAxios,
    "post",
    `/${schoolName}/courses/${courseId}/certificates`,
    { studentId }
  );
};

// ✅ Check section exam completion
export const checkSectionExamCompletionApi = async (
  schoolName: string,
  courseId: string,
  studentId: string,
  sectionId: string
) => {
  return await apiRequest(
    courseAxios,
    "get",
    `/${schoolName}/${courseId}/${studentId}/${sectionId}/completion`
  );
};

// ✅ Save exam progress
export const saveExamProgress = async (
  schoolName: string,
  courseId: string,
  sectionId: string,
  studentId: string,
  score: number
) => {
  return await apiRequest(
    courseAxios,
    "post",
    `/${schoolName}/courses/${courseId}/sections/${sectionId}/progress`,
    { studentId, score }
  );
};

// ✅ Save final exam progress
export const saveFinalExamProgress = async (
  schoolName: string,
  courseId: string,
  studentId: string,
  percentage: number
) => {
  return await apiRequest(
    courseAxios,
    "post",
    `/${schoolName}/courses/${courseId}/final-exam/progress`,
    { studentId, score: percentage }
  );
};

// ✅ Check final exam status
export const checkFinalExamStatus = async (
  schoolName: string,
  courseId: string,
  studentId: string
) => {
  return await apiRequest(
    courseAxios,
    "get",
    `/${schoolName}/courses/${courseId}/final-exam/status/${studentId}`
  );
};

// ✅ Add certificate
export const addCertificate = async (
  schoolName: string,
  courseId: string,
  studentId: string
) => {
  const res = await apiRequest<{ certificateUrl: string }>(
    courseAxios,
    "post",
    `/${schoolName}/courses/${courseId}/certificates`,
    { studentId }
  );
  return res.certificateUrl;
};

// ✅ Update certificate
export const updateCertificate = async (
  schoolName: string,
  courseId: string,
  studentId: string,
  dateIssued: string
) => {
  const res = await apiRequest<{ certificateUrl: string }>(
    courseAxios,
    "put",
    `/${schoolName}/courses/${courseId}/certificates`,
    { studentId, dateIssued }
  );
  return res.certificateUrl;
};

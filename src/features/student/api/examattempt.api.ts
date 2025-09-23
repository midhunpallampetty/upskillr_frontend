import examAxios from "../../../utils/axios/exam";
import { apiRequest } from "../../../utils/apiRequest";

export async function submitExamStatus(
  userId: string,
  courseId: string,
  examType: string,
  isPassed: boolean
) {
  try {
    const data = await apiRequest<any>(
      examAxios,
      "post",
      "/submit-exam",
      { userId, courseId, examType, isPassed }
    );

    console.log("✅ Exam status submitted:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Failed to submit exam status:", error.response?.data || error.message);
    throw error;
  }
}

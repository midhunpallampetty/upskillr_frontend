import axios from "axios";
import examAxios from "../../../utils/axios/exam";

export async function submitExamStatus(userId: string, courseId: string, examType: string, isPassed: boolean) {
  try {
    const { data } = await examAxios.post('/submit-exam', {
      userId,
      courseId,
      examType,
      isPassed,
    });
    console.log(data,'dtattttttttttdata')
    return data;
  } catch (error: any) {
    console.error('Failed to submit exam status:', error.response?.data || error.message);
    throw error;
  }
}
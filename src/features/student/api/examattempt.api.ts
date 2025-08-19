import axios from "axios";

export async function submitExamStatus(userId: string, courseId: string, examType: string, isPassed: boolean) {
  try {
    const { data } = await axios.post('https://exam.upskillr.online/api/submit-exam', {
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
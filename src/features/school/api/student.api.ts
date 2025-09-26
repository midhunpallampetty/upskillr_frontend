import courseAxios from "../../../utils/axios/course";
import studentAxios from "../../../utils/axios/student";

// Updated API function to send both schoolId and schoolName
// API function remains the same, as the change is in what we pass from the component
export const getAllStudents = async (schoolId: string, schoolName: string) => {
  const response = await studentAxios.post('/students', { schoolId, schoolName });
  return response.data;
};
export const getPurchasedCoursesByStudent = async (studentId: string, schoolName: string) => {
  const response = await courseAxios.get(`/payments/student/${studentId}/purchased-courses`, {
    params: { schoolName }
  });
  return response.data;
};




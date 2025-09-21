import studentAxios from "../../../utils/axios/student";

// Updated API function to send both schoolId and schoolName
export const getAllStudents = async (schoolId: string, schoolName: string) => {
  const response = await studentAxios.post('/students', { schoolId, schoolName });
  return response.data;
};



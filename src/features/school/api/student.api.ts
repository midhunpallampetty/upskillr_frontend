import studentAxios from "../../../utils/axios/student";

export const getAllStudents = async (schoolId: string) => {
  const response = await studentAxios.post('/students', { schoolId:schoolId });
  return response.data;
};


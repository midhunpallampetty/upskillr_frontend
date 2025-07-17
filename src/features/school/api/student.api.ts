import studentAxios from "../../../utils/axios/student";

export const getAllStudents = async () => {
  const response = await studentAxios.get('/students');
  return response.data;
};

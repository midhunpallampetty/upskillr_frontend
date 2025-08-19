import cloudAxios from '../../../utils/axios/cloud';

const uploadToCloudinary = async (file: File, uploadPreset: string, cloudName: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const url = `/${cloudName}/image/upload`;
  const res = await cloudAxios.post(url, formData);
  return res.data.secure_url;
};

export default uploadToCloudinary;

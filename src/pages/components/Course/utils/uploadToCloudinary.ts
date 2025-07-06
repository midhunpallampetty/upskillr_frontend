import axios from 'axios';

const uploadToCloudinary = async (file: File, uploadPreset: string, cloudName: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const res = await axios.post(url, formData);
  return res.data.secure_url;
};

export default uploadToCloudinary;

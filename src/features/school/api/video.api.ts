import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
const CLOUD_BASE_URL=import.meta.env.VITE_CLOUD_BASE;
const COURSE_BASE_API=import.meta.env.VITE_COURSE_API_BASE;
export const uploadVideoToCloudinary = async (videoFile: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', videoFile);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('resource_type', 'video');

  try {
    const res = await axios.post(
      `${CLOUD_BASE_URL}/${CLOUD_NAME}/video/upload`,
      formData
    );
    return res.data.secure_url;
  } catch (err) {
    console.error('❌ Cloudinary upload failed:', err);
    return null;
  }
};

export const addVideoToSection = async (
  schoolDb: string,
  sectionId: string,
  videoName: string,
  url: string,
  description: string
): Promise<void> => {
  await axios.post(
    `${COURSE_BASE_API}/${schoolDb}/sections/${sectionId}/videos`,
    {
      videos: [{ videoName, url, description }],
    }
  );
};

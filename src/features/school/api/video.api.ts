
import cloudAxios from '../../../utils/axios/cloud';
import courseAxios from '../../../utils/axios/course';
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

export const uploadVideoToCloudinary = async (videoFile: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', videoFile);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('resource_type', 'video');

  try {
    const res = await cloudAxios.post(
      `/${CLOUD_NAME}/video/upload`,
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
  await courseAxios.post(
    `/${schoolDb}/sections/${sectionId}/videos`,
    {
      videos: [{ videoName, url, description }],
    }
  );
};

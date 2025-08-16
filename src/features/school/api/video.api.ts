// src/features/school/api/video.api.ts (or wherever it's defined)

import cloudAxios from '../../../utils/axios/cloud';
import courseAxios from '../../../utils/axios/course';
import { VideoUploadProgress } from '../types/Props'; // Adjust path to match your project structure

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

type OnProgress = (progress: number, stage: VideoUploadProgress['stage'], message: string) => void;

export const uploadVideoToCloudinary = async (
  videoFile: File,
  onProgress?: OnProgress
): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', videoFile);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('resource_type', 'video');

  try {
    // Initial stage
    onProgress?.(0, 'preparing', 'Preparing upload...');

    const res = await cloudAxios.post(`/${CLOUD_NAME}/video/upload`, formData, {
      // Axios config for upload progress
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress?.(percent, 'uploading', `Uploading: ${percent}% complete`);
        }
      },
    });

    // Post-upload stages
    onProgress?.(100, 'processing', 'Processing video on Cloudinary...');
    // Simulate a brief processing delay (optional; remove if not needed)
    await new Promise((resolve) => setTimeout(resolve, 500));

    onProgress?.(100, 'complete', 'Upload complete!');

    return res.data.secure_url;
  } catch (err) {
    console.error('❌ Cloudinary upload failed:', err);
    onProgress?.(0, 'error', 'Upload failed. Please try again.');
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

// src/services/uploadService.ts
import apiClient from './apiClient';

interface UploadResponse {
  status: string;
  message: string;
  data: {
    avatar_url: string;
  };
}

export const uploadAdminProfilePicture = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  
  // === THIS IS THE FIX ===
  // We are changing the field name from 'image' to 'file'.
  // This is the most common name that Multer is configured to look for.
  formData.append('avatar', file);
  // ======================

  try {
    const response = await apiClient.post<UploadResponse>('/upload-image/admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload profile picture:', error);
    throw error;
  }
};
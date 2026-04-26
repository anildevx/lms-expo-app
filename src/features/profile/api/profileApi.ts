import apiClient from '../../../services/apiClient';
import type { ApiResponse } from '../../../types';
import { API_ENDPOINTS, API_TIMEOUT } from '../../../constants';

export interface UpdateAvatarResponse {
  avatar: {
    url: string;
    localPath: string;
    _id: string;
  };
}

/**
 * Update user avatar
 * @param imageUri - Local file URI of the image
 */
export const updateAvatar = async (
  imageUri: string
): Promise<ApiResponse<UpdateAvatarResponse>> => {
  // Create FormData for file upload
  const formData = new FormData();

  // Extract filename from URI
  const filename = imageUri.split('/').pop() || 'avatar.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  // Append the image file
  formData.append('avatar', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  const response = await apiClient.patch<ApiResponse<UpdateAvatarResponse>>(
    API_ENDPOINTS.USER.UPDATE_AVATAR,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: API_TIMEOUT.FILE_UPLOAD,
    }
  );

  return response.data;
};

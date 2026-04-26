import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { updateAvatar } from '../api/profileApi';
import { useAuthStore } from '../../auth/store';
import { QUERY_KEYS } from '../../../constants';
import { logger } from '../../../utils/logger';

/**
 * Hook to request camera permissions
 */
export const useCameraPermission = () => {
  const requestPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  };

  return { requestPermission };
};

/**
 * Hook to request media library permissions
 */
export const useMediaLibraryPermission = () => {
  const requestPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Media library permission is required to select photos.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  };

  return { requestPermission };
};

/**
 * Hook to pick image from library
 */
export const useImagePicker = () => {
  const { requestPermission } = useMediaLibraryPermission();

  const pickImage = async (): Promise<string | null> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  };

  return { pickImage };
};

/**
 * Hook to take photo with camera
 */
export const useCameraPicker = () => {
  const { requestPermission } = useCameraPermission();

  const takePhoto = async (): Promise<string | null> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  };

  return { takePhoto };
};

/**
 * Hook to update user avatar
 */
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const { setUser, user } = useAuthStore();

  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { avatar } = response.data;

        // Update user in store
        if (user) {
          setUser({
            ...user,
            avatar: avatar.url,
          });
        }

        // Invalidate current user query
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CURRENT_USER });

        logger.info('Avatar updated successfully', { avatarUrl: avatar.url });

        Alert.alert('Success', 'Profile photo updated successfully!', [
          { text: 'OK' },
        ]);
      }
    },
    onError: (error: any) => {
      logger.error('Failed to update avatar', error);

      Alert.alert(
        'Upload Failed',
        error?.response?.data?.message || 'Failed to update profile photo. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });
};

/**
 * Hook to show avatar picker options
 */
export const useAvatarPicker = () => {
  const { pickImage } = useImagePicker();
  const { takePhoto } = useCameraPicker();
  const updateAvatarMutation = useUpdateAvatar();

  const showAvatarOptions = () => {
    Alert.alert(
      'Update Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const uri = await takePhoto();
            if (uri) {
              updateAvatarMutation.mutate(uri);
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const uri = await pickImage();
            if (uri) {
              updateAvatarMutation.mutate(uri);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return {
    showAvatarOptions,
    isUploading: updateAvatarMutation.isPending,
  };
};

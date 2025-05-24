import api from './api';

export const faceService = {
  verifyFace: async (cameraId: string, imageBase64: string) => {
    try {
      const response = await api.post('/cameras/verify_face', {
        camera_verify_id: cameraId,
        image_base64_to_check: imageBase64
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid image data or camera ID');
          case 404:
            throw new Error('No registered face found for this user');
          case 500:
            throw new Error('Error processing image');
          default:
            throw new Error('Face verification failed');
        }
      }
      throw error;
    }
  }
}; 
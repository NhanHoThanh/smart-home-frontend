import api from './api';

export interface FaceRecognitionUser {
  id: string;
  name: string;
  addedAt: number;
  lastAuthenticated?: number;
}

export interface AuthenticationResult {
  success: boolean;
  userId?: string;
  userName?: string;
  confidence?: number;
  message?: string;
}

export interface RegisterUserResult {
  success: boolean;
  userId?: string;
  message?: string;
}

// Register a new user with their face image
export const registerUser = async (name: string, imageUri: string): Promise<RegisterUserResult> => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'face.jpg',
    } as any);

    const response = await api.post('/face-recognition/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
};

// Authenticate a user with their face image
export const authenticateUser = async (imageUri: string): Promise<AuthenticationResult> => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'auth.jpg',
    } as any);

    const response = await api.post('/face-recognition/authenticate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw new Error('Failed to authenticate user');
  }
};

// Get all registered users
export const getRegisteredUsers = async (): Promise<FaceRecognitionUser[]> => {
  try {
    const response = await api.get('/face-recognition/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Remove a user from the face recognition system
export const removeUser = async (userId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.delete(`/face-recognition/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing user:', error);
    throw new Error('Failed to remove user');
  }
};

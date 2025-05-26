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

// Mock data storage for development
let mockUsers: FaceRecognitionUser[] = [
  {
    id: 'john_doe',
    name: 'John Doe',
    addedAt: Date.now() - 86400000, // 1 day ago
    lastAuthenticated: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: 'jane_smith',
    name: 'Jane Smith', 
    addedAt: Date.now() - 172800000, // 2 days ago
    lastAuthenticated: Date.now() - 7200000, // 2 hours ago
  }
];

// Mock flag to enable/disable API calls
const USE_MOCK_DATA = false; // Set to false to use real API

// API Configuration
const CAMERA_ID = '0f964b74-2f5a-4766-bad5-aa8b11a0f09a'; // Default camera ID

// Helper function to generate user ID from name
const generateUserId = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

// Helper function to simulate API delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to convert image URI to base64
const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  if (imageUri.startsWith('data:')) {
    // If it's already a data URL, extract the base64 part
    return imageUri.split(',')[1];
  }
  
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

// Register a new user with their face image
export const registerUser = async (name: string, imageUri: string): Promise<RegisterUserResult> => {
 
  // Real API implementation
  try {
    const userId = generateUserId(name);
    const imageBase64 = await convertImageToBase64(imageUri);
    
    console.log('Registering user:', { userId, nameLength: name.length, base64Length: imageBase64.length });
    
    const response = await api.post('cameras/register_face', {
      user_id: userId,
      image_base64: imageBase64,
    });

    if (response.status === 200 || response.status === 201) {
      console.log('User registered successfully:', response.data);
      return {
        success: true,
        userId: response.data.user_id,
        message: response.data.message || 'User registered successfully',
      };
    } else {
      return {
        success: false,
        message: 'Failed to register user',
      };
    }
  } catch (error: any) {
    console.error('Error registering user:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    
    let errorMessage = 'Failed to register user';
    
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = 'Invalid image data or user ID. Please try again.';
      } else if (error.response.status === 422) {
        errorMessage = 'Invalid request format. Please check the image data.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      // Include server error details if available
      if (error.response.data?.detail) {
        errorMessage += ` Server says: ${error.response.data.detail}`;
      }
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Authenticate a user with their face image
export const authenticateUser = async (imageUri: string,userId:string): Promise<AuthenticationResult> => {

  
  // Real API implementation - Two-step authentication process
  try {
    const imageBase64 = await convertImageToBase64(imageUri);
    
    console.log('Starting authentication with base64 length:', imageBase64.length);
    
    // Step 1: PUT request to verify_face endpoint
    console.log('Step 1: Sending PUT request to cameras/verify_face');
    const firstResponse = await api.put('cameras/0f964b74-2f5a-4766-bad5-aa8b11a0f09a/', {
      user_id: userId});
    
    if (firstResponse.status == 400 && firstResponse.data?.detail === 'User already registered') {
      console.log('User already registered:', firstResponse.data);
    }

    // Step 2: POST request to verify face
    console.log('Step 2: Sending POST request to cameras/verify_face');
    const verifyResponse = await api.post('cameras/verify_face', {
      camera_verify_id: CAMERA_ID,
      image_base64_to_check: imageBase64,
    });
    
    const verifyData = verifyResponse.data;
    
    if (verifyData.is_signed_person && verifyData.is_signed_person !== 'Unknown') {
      // Convert user_id back to readable name
      const userName = verifyData.is_signed_person.replace(/_/g, ' ')
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      console.log('User authenticated successfully:', {
        userId: verifyData.is_signed_person,
        userName: userName,
        confidence: verifyData.confidence_score,
      });
      
      return {
        success: true,
        userId: verifyData.is_signed_person,
        userName: userName,
        confidence: verifyData.confidence_score,
        message: `Welcome back, ${userName}!`,
      };
    } else {
      return {
        success: false,
        message: 'Face not recognized. Please try again.',
      };
    }
  } catch (error: any) {
    console.error('Error authenticating user:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    console.error('Error response headers:', error.response?.headers);
    
    let errorMessage = 'Authentication failed. Please try again.';
    
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = 'Invalid image data. Please try again.';
      } else if (error.response.status === 422) {
        errorMessage = 'Invalid request format. Please check the image data.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      // Include server error details if available
      if (error.response.data?.detail) {
        errorMessage += ` Server says: ${error.response.data.detail}`;
      }
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Get all registered users
export const getRegisteredUsers = async (): Promise<FaceRecognitionUser[]> => {
  if (USE_MOCK_DATA) {
    // Mock implementation - return mock users
    await simulateDelay(500); // Simulate network delay
    
    console.log('Mock: Returning registered users', mockUsers);
    
    return [...mockUsers]; // Return a copy to prevent direct mutation
  }
  
  // Real API implementation
  try {
    const response = await api.get('cameras/all_users');
    const userIds = response.data; // Array of user IDs like ["doan_hue", "ho_long", ...]
    
    // Convert user IDs to FaceRecognitionUser objects
    const users: FaceRecognitionUser[] = userIds.map((userId: string) => {
      // Convert user_id to readable name
      const name = userId.replace(/_/g, ' ')
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      return {
        id: userId,
        name: name,
        addedAt: Date.now() - Math.random() * 86400000 * 7, // Random time within last week
        lastAuthenticated: Math.random() > 0.5 ? Date.now() - Math.random() * 86400000 : undefined,
      };
    });
    
    console.log('API: Returning registered users', users);
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Remove a user from the face recognition system
export const removeUser = async (userId: string): Promise<{ success: boolean; message?: string }> => {
  console.log('removeUser service called with userId:', userId);
  
  
  // Real API implementation - Remove user from camera using PUT with delete=true
  try {
    const response = await api.put(`cameras/0f964b74-2f5a-4766-bad5-aa8b11a0f09a?delete=true`, {
      user_id: userId,
    });

    console.log('API response for removing user:', response.data);
    
    if (response.status === 400) {
      console.log('User removed successfully:', response.data);
      return {
        success: true,
        message: response.data.message || 'User removed successfully',
      };
    } else {
      return {
        success: false,
        message: 'Failed to remove user',
      };
    }
  } catch (error: any) {

       return {
      success: false,
      message: error.response?.data?.detail || 'Failed to remove user',
    };
  }
};

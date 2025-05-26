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
const USE_MOCK_DATA = true; // Set to false to use real API

// Helper function to generate user ID from name
const generateUserId = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

// Helper function to simulate API delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate random confidence score
const generateConfidence = (): number => {
  return Math.floor(Math.random() * 15) + 85; // Random between 85-99%
};

// Register a new user with their face image
export const registerUser = async (name: string, imageUri: string): Promise<RegisterUserResult> => {
  if (USE_MOCK_DATA) {
    // Mock implementation - always succeeds
    await simulateDelay(1500); // Simulate network delay
    
    const userId = generateUserId(name);
    
    // Check if user already exists
    if (mockUsers.find(user => user.id === userId)) {
      return {
        success: false,
        message: 'A user with this name already exists. Please choose a different name.',
      };
    }
    
    // Add new user to mock data
    const newUser: FaceRecognitionUser = {
      id: userId,
      name: name.trim(),
      addedAt: Date.now(),
    };
    
    mockUsers.push(newUser);
    
    console.log('Mock: User registered successfully', newUser);
    
    return {
      success: true,
      userId,
      message: 'User registered successfully',
    };
  }
  
  // Original API implementation
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
  if (USE_MOCK_DATA) {
    // Mock implementation - randomly select a user or fail
    // await simulateDelay(1500); // Simulate processing time
    
    // 90% success rate - always authenticate if users exist
    if (mockUsers.length > 0) {
      // Randomly select one of the mock users or create a successful response
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const confidence = generateConfidence();
      
      // Update last authenticated time
      randomUser.lastAuthenticated = Date.now();
      
      console.log('Mock: User authenticated successfully', {
        userId: randomUser.id,
        userName: randomUser.name,
        confidence,
      });
      
      return {
        success: true,
        userId: randomUser.id,
        userName: randomUser.name,
        confidence,
        message: `Welcome back, ${randomUser.name}!`,
      };
    } else {
      console.log('Mock: No users registered for authentication');
      return {
        success: false,
        message: 'No registered users found. Please register first.',
      };
    }
  }
  
  // Original API implementation
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'face.jpg',
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
  if (USE_MOCK_DATA) {
    // Mock implementation - return mock users
    await simulateDelay(500); // Simulate network delay
    
    console.log('Mock: Returning registered users', mockUsers);
    
    return [...mockUsers]; // Return a copy to prevent direct mutation
  }
  
  // Original API implementation
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
  console.log('removeUser service called with userId:', userId);
  console.log('Current mockUsers before removal:', mockUsers);
  
  if (USE_MOCK_DATA) {
    // Mock implementation - remove user from mock data
    await simulateDelay(800); // Simulate network delay
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    console.log('Found user at index:', userIndex);
    
    if (userIndex === -1) {
      console.log('User not found in mockUsers');
      return {
        success: false,
        message: 'User not found',
      };
    }
    
    const removedUser = mockUsers[userIndex];
    mockUsers.splice(userIndex, 1);
    
    console.log('Mock: User removed successfully', removedUser);
    console.log('mockUsers after removal:', mockUsers);
    
    return {
      success: true,
      message: 'User removed successfully',
    };
  }
  
  // Original API implementation
  try {
    const response = await api.delete(`/face-recognition/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing user:', error);
    throw new Error('Failed to remove user');
  }
};

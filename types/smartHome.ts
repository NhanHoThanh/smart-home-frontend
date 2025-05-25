// Types for the smart home app
export interface Room {
  id: string;
  name: string;
  icon: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'light' | 'climate' | 'entertainment' | 'security' | 'appliance' | 'fan' | 'door';
  room_id: string;
  status: boolean;
  icon: string;
  value?: number;
}

export interface DetectedEntity {
  type: 'person' | 'animal' | 'vehicle' | 'package' | 'unknown';
  confidence: number;
  personType?: 'owner' | 'family' | 'stranger';
  personName?: string;
  animalType?: string;
  timestamp: string;
}

export interface Camera {
  id: string;
  name: string;
  roomId: string;
  isOnline: boolean;
  hasMotion: boolean;
  imageUrl: string;
  lastMotionTime?: string;
  hasRecording: boolean;
  detectedEntities?: DetectedEntity[];
}

export interface EnvironmentData {
  temperature: number;
  humidity: number;
  lightLevel: number;
  airQuality?: string;
}

export interface EnvironmentDataPoint {
  created_at: string;
  value: string;
}

export interface HistoricalEnvironmentData {
  temperature: EnvironmentDataPoint[];
  humidity: EnvironmentDataPoint[];
  lightLevel: EnvironmentDataPoint[];
}

export interface AIAssistantState {
  isListening: boolean;
  lastCommand?: string;
  lastResponse?: string;
  commandHistory: Array<{
    command: string;
    response: string;
    timestamp: number;
  }>;
}

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

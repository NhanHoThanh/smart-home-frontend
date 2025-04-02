// Types for the smart home app
export interface Room {
  id: string;
  name: string;
  icon: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'light' | 'climate' | 'entertainment' | 'security' | 'appliance';
  roomId: string;
  status: boolean;
  icon: string;
  brightness?: number;
  temperature?: number;
  color?: string;
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

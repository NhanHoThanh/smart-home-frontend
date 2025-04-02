// Mock data for the smart home app
import { Device, Room, EnvironmentData, Camera, DetectedEntity } from '@/types/smartHome';

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Living Room',
    icon: 'sofa',
  },
  {
    id: '2',
    name: 'Kitchen',
    icon: 'utensils',
  },
  {
    id: '3',
    name: 'Bedroom',
    icon: 'bed',
  },
  {
    id: '4',
    name: 'Bathroom',
    icon: 'bath',
  },
  {
    id: '5',
    name: 'Office',
    icon: 'laptop',
  },
  {
    id: '6',
    name: 'Front Door',
    icon: 'door-open',
  },
  {
    id: '7',
    name: 'Backyard',
    icon: 'tree',
  },
];

export const devices: Device[] = [
  {
    id: '1',
    name: 'Main Light',
    type: 'light',
    roomId: '1',
    status: true,
    icon: 'lamp-ceiling',
    brightness: 80,
  },
  {
    id: '2',
    name: 'Floor Lamp',
    type: 'light',
    roomId: '1',
    status: false,
    icon: 'lamp-floor',
    brightness: 60,
  },
  {
    id: '3',
    name: 'TV',
    type: 'entertainment',
    roomId: '1',
    status: false,
    icon: 'tv',
  },
  {
    id: '4',
    name: 'AC',
    type: 'climate',
    roomId: '1',
    status: true,
    icon: 'air-vent',
    temperature: 23,
  },
  {
    id: '5',
    name: 'Kitchen Light',
    type: 'light',
    roomId: '2',
    status: true,
    icon: 'lamp-ceiling',
    brightness: 100,
  },
  {
    id: '6',
    name: 'Refrigerator',
    type: 'appliance',
    roomId: '2',
    status: true,
    icon: 'refrigerator',
  },
  {
    id: '7',
    name: 'Microwave',
    type: 'appliance',
    roomId: '2',
    status: false,
    icon: 'microwave',
  },
  {
    id: '8',
    name: 'Bedroom Light',
    type: 'light',
    roomId: '3',
    status: false,
    icon: 'lamp-ceiling',
    brightness: 50,
  },
  {
    id: '9',
    name: 'Bedroom AC',
    type: 'climate',
    roomId: '3',
    status: false,
    icon: 'air-vent',
    temperature: 22,
  },
  {
    id: '10',
    name: 'Bathroom Light',
    type: 'light',
    roomId: '4',
    status: false,
    icon: 'lamp-ceiling',
    brightness: 70,
  },
  {
    id: '11',
    name: 'Office Light',
    type: 'light',
    roomId: '5',
    status: true,
    icon: 'lamp-desk',
    brightness: 90,
  },
  {
    id: '12',
    name: 'Computer',
    type: 'entertainment',
    roomId: '5',
    status: true,
    icon: 'computer',
  },
  {
    id: '13',
    name: 'Office AC',
    type: 'climate',
    roomId: '5',
    status: true,
    icon: 'air-vent',
    temperature: 24,
  },
];

// Sample detected entities for cameras
const detectedEntities: Record<string, DetectedEntity[]> = {
  '1': [
    {
      type: 'person',
      confidence: 0.98,
      personType: 'owner',
      personName: 'John',
      timestamp: '2 min ago',
    }
  ],
  '2': [
    {
      type: 'person',
      confidence: 0.95,
      personType: 'family',
      personName: 'Emma',
      timestamp: '5 min ago',
    }
  ],
  '3': [],
  '4': [
    {
      type: 'animal',
      confidence: 0.92,
      animalType: 'dog',
      timestamp: '10 min ago',
    }
  ],
  '5': [
    {
      type: 'person',
      confidence: 0.85,
      personType: 'stranger',
      timestamp: '15 min ago',
    }
  ],
};

export const cameras: Camera[] = [
  {
    id: '1',
    name: 'Front Door Camera',
    roomId: '6',
    isOnline: true,
    hasMotion: true,
    imageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    lastMotionTime: '2 min ago',
    hasRecording: true,
    detectedEntities: detectedEntities['1'],
  },
  {
    id: '2',
    name: 'Living Room Camera',
    roomId: '1',
    isOnline: true,
    hasMotion: false,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80',
    hasRecording: true,
    detectedEntities: detectedEntities['2'],
  },
  {
    id: '3',
    name: 'Kitchen Camera',
    roomId: '2',
    isOnline: true,
    hasMotion: false,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    hasRecording: true,
    detectedEntities: detectedEntities['3'],
  },
  {
    id: '4',
    name: 'Backyard Camera',
    roomId: '7',
    isOnline: true,
    hasMotion: true,
    imageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    lastMotionTime: '10 min ago',
    hasRecording: true,
    detectedEntities: detectedEntities['4'],
  },
  {
    id: '5',
    name: 'Garage Camera',
    roomId: '7',
    isOnline: false,
    hasMotion: false,
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    hasRecording: false,
    detectedEntities: detectedEntities['5'],
  },
];

export const environmentData: EnvironmentData = {
  temperature: 23.5,
  humidity: 45,
  lightLevel: 68,
  airQuality: 'Good',
};

export const aiAssistantResponses = [
  "I've turned on the living room lights.",
  "The temperature has been set to 23°C.",
  "All lights have been turned off.",
  "The front door is locked.",
  "I've started playing your evening playlist.",
  "The kitchen lights are now dimmed to 50%.",
  "I've set the thermostat to eco mode.",
  "The security system is now armed.",
  "I've turned off all devices in the bedroom.",
  "The blinds have been closed.",
];

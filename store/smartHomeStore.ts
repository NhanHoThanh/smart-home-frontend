import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device, Room, EnvironmentData, AIAssistantState, Camera, DetectedEntity } from '@/types/smartHome';
import { 
  devices as initialDevices, 
  rooms as initialRooms, 
  environmentData as initialEnvironmentData,
  cameras as initialCameras 
} from '@/constants/mockData';

interface SmartHomeState {
  devices: Device[];
  rooms: Room[];
  cameras: Camera[];
  environmentData: EnvironmentData;
  selectedRoomId: string | null;
  aiAssistant: AIAssistantState;
  selectedCamera: Camera | null;
  
  // Actions
  toggleDevice: (deviceId: string) => void;
  updateDeviceBrightness: (deviceId: string, brightness: number) => void;
  updateDeviceTemperature: (deviceId: string, temperature: number) => void;
  selectRoom: (roomId: string | null) => void;
  updateEnvironmentData: (data: Partial<EnvironmentData>) => void;
  startListening: () => void;
  stopListening: (command?: string) => void;
  addCommandToHistory: (command: string, response: string) => void;
  clearCommandHistory: () => void;
  selectCamera: (camera: Camera | null) => void;
  toggleCameraMotion: (cameraId: string) => void;
  toggleCameraOnline: (cameraId: string) => void;
  addDetectedEntity: (cameraId: string, entity: DetectedEntity) => void;
  updateDeviceColor: (deviceId: string, color:string) => void;

}

export const useSmartHomeStore = create<SmartHomeState>()(
  persist(
    (set) => ({
      devices: initialDevices,
      rooms: initialRooms,
      cameras: initialCameras,
      environmentData: initialEnvironmentData,
      selectedRoomId: null,
      selectedCamera: null,
      aiAssistant: {
        isListening: false,
        commandHistory: [],
      },
      
      toggleDevice: (deviceId: string) => 
        set((state) => ({
          devices: state.devices.map((device) => 
            device.id === deviceId 
              ? { ...device, status: !device.status } 
              : device
          ),
        })),
      
      updateDeviceBrightness: (deviceId: string, brightness: number) => 
        set((state) => ({
          devices: state.devices.map((device) => 
            device.id === deviceId 
              ? { ...device, brightness } 
              : device
          ),
        })),
        updateDeviceColor: (deviceId: string, color: string) =>
          set((state) => ({
            devices: state.devices.map((device) =>
              device.id === deviceId
                ? {
                    ...device,
                    color,
                  }
                : device
            ),
          })),
        
        
      
      updateDeviceTemperature: (deviceId: string, temperature: number) => 
        set((state) => ({
          devices: state.devices.map((device) => 
            device.id === deviceId 
              ? { ...device, temperature } 
              : device
          ),
        })),
      
      selectRoom: (roomId: string | null) => 
        set({ selectedRoomId: roomId }),
      
      updateEnvironmentData: (data: Partial<EnvironmentData>) => 
        set((state) => ({
          environmentData: { ...state.environmentData, ...data },
        })),
      
      startListening: () => 
        set((state) => ({
          aiAssistant: { ...state.aiAssistant, isListening: true },
        })),
      
      stopListening: (command?: string) => 
        set((state) => ({
          aiAssistant: { 
            ...state.aiAssistant, 
            isListening: false,
            lastCommand: command || state.aiAssistant.lastCommand,
          },
        })),
      
      addCommandToHistory: (command: string, response: string) => 
        set((state) => ({
          aiAssistant: { 
            ...state.aiAssistant, 
            lastCommand: command,
            lastResponse: response,
            commandHistory: [
              {
                command,
                response,
                timestamp: Date.now(),
              },
              ...state.aiAssistant.commandHistory,
            ].slice(0, 20), // Keep only the last 20 commands
          },
        })),
      
      clearCommandHistory: () => 
        set((state) => ({
          aiAssistant: { 
            ...state.aiAssistant, 
            commandHistory: [],
          },
        })),
        
      selectCamera: (camera: Camera | null) => 
        set({ selectedCamera: camera }),
        
      toggleCameraMotion: (cameraId: string) => 
        set((state) => {
          const camera = state.cameras.find(c => c.id === cameraId);
          
          // Generate a random detection if turning motion on
          let newDetectedEntities = camera?.detectedEntities || [];
          
          if (!camera?.hasMotion) {
            const detectionTypes = ['person', 'animal', 'unknown'];
            const randomType = detectionTypes[Math.floor(Math.random() * detectionTypes.length)] as 'person' | 'animal' | 'unknown';
            
            let newEntity: DetectedEntity = {
              type: randomType,
              confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
              timestamp: 'Just now',
            };
            
            if (randomType === 'person') {
              const personTypes = ['owner', 'family', 'stranger'];
              const randomPersonType = personTypes[Math.floor(Math.random() * personTypes.length)] as 'owner' | 'family' | 'stranger';
              newEntity.personType = randomPersonType;
              
              if (randomPersonType === 'owner') {
                newEntity.personName = 'John';
              } else if (randomPersonType === 'family') {
                newEntity.personName = 'Emma';
              }
            } else if (randomType === 'animal') {
              const animalTypes = ['dog', 'cat', 'bird'];
              newEntity.animalType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
            }
            
            newDetectedEntities = [newEntity, ...(camera?.detectedEntities || [])].slice(0, 5);
          }
          
          return {
            cameras: state.cameras.map((camera) => 
              camera.id === cameraId 
                ? { 
                    ...camera, 
                    hasMotion: !camera.hasMotion,
                    lastMotionTime: !camera.hasMotion ? 'Just now' : camera.lastMotionTime,
                    detectedEntities: newDetectedEntities
                  } 
                : camera
            ),
          };
        }),
        
      toggleCameraOnline: (cameraId: string) => 
        set((state) => ({
          cameras: state.cameras.map((camera) => 
            camera.id === cameraId 
              ? { ...camera, isOnline: !camera.isOnline } 
              : camera
          ),
        })),
        
      addDetectedEntity: (cameraId: string, entity: DetectedEntity) => 
        set((state) => ({
          cameras: state.cameras.map((camera) => 
            camera.id === cameraId 
              ? { 
                  ...camera, 
                  detectedEntities: [
                    entity,
                    ...(camera.detectedEntities || [])
                  ].slice(0, 5) // Keep only the last 5 detections
                } 
              : camera
          ),
        })),
    }),
    {
      name: 'smart-home-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

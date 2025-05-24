import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device, Room, EnvironmentData, AIAssistantState, Camera, DetectedEntity, HistoricalEnvironmentData } from '@/types/smartHome';
import { 
  cameras as initialCameras 
} from '@/constants/mockData';
import * as roomService from '@/services/roomService';
import * as deviceService from '@/services/deviceService';
import * as environmentService from '@/services/environmentService';

interface SmartHomeState {
  // State
  devices: Device[];
  rooms: Room[];
  cameras: Camera[];
  environmentData: EnvironmentData;
  historicalEnvironmentData: HistoricalEnvironmentData | null;
  selectedRoomId: string | null;
  aiAssistant: AIAssistantState;
  selectedCamera: Camera | null;
  isLoading: boolean;
  isBackgroundLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRooms: () => Promise<void>;
  fetchDevices: (roomId?: string) => Promise<void>;
  fetchEnvironmentData: () => Promise<void>;
  fetchHistoricalEnvironmentData: () => Promise<void>;
  toggleDevice: (deviceId: string) => Promise<void>;
  updateDeviceValue: (deviceId: string, value: number) => Promise<void>;
  updateDeviceBrightness: (deviceId: string, brightness: number) => Promise<void>;
  updateDeviceTemperature: (deviceId: string, temperature: number) => Promise<void>;
  updateFanSpeed: (deviceId: string, speed: number) => Promise<void>;
  selectRoom: (roomId: string | null) => void;
  updateEnvironmentData: (data: Partial<EnvironmentData>) => Promise<void>;
  startListening: () => void;
  stopListening: (command?: string) => void;
  addCommandToHistory: (command: string, response: string) => void;
  clearCommandHistory: () => void;
  selectCamera: (camera: Camera | null) => void;
  toggleCameraMotion: (cameraId: string) => void;
  toggleCameraOnline: (cameraId: string) => void;
  addDetectedEntity: (cameraId: string, entity: DetectedEntity) => void;
  
}

export const useSmartHomeStore = create<SmartHomeState>()(
  persist(
    (set, get) => ({
      // Initial state
      devices: [],
      rooms: [],
      cameras: initialCameras,
      environmentData: {
        temperature: 0,
        humidity: 0,
        lightLevel: 0,
      },
      historicalEnvironmentData: null,
      selectedRoomId: null,
      selectedCamera: null,
      aiAssistant: {
        isListening: false,
        commandHistory: [],
      },
      isLoading: false,
      isBackgroundLoading: false,
      error: null,
      
      // API Actions
      fetchRooms: async () => {
        set({ isLoading: true, error: null });
        try {
          const rooms = await roomService.getRooms();
          set({ rooms, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch rooms', isLoading: false });
        }
      },
      
      fetchDevices: async (roomId?: string) => {
        set({ isBackgroundLoading: true, error: null });
        try {
          const devices = await deviceService.getDevices(roomId);
          
          set({ devices, isBackgroundLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch devices', isBackgroundLoading: false });
        }
      },
      
      fetchEnvironmentData: async () => {
        set({ isBackgroundLoading: true, error: null });
        try {
          const environmentData = await environmentService.getEnvironmentData();
          set({ environmentData, isBackgroundLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch environment data', isBackgroundLoading: false });
        }
      },
      
      fetchHistoricalEnvironmentData: async () => {
        set({ isBackgroundLoading: true, error: null });
        try {
          const historicalEnvironmentData = await environmentService.getHistoricalEnvironmentData();
          set({ historicalEnvironmentData, isBackgroundLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch historical environment data', isBackgroundLoading: false });
        }
      },
      
      toggleDevice: async (deviceId: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await deviceService.toggleDevice(deviceId);
          set((state) => ({
            devices: state.devices.map((device) => 
              device.id === deviceId 
                ? { ...device, status: result.status } 
                : device
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to toggle device', isLoading: false });
        }
      },
      
      updateFanSpeed: async (deviceId: string, speed: number) => {
        set({ isLoading: true, error: null });
        try {
          const updatedDevice = await deviceService.updateFanSpeed(deviceId, speed);
          set((state) => ({
            devices: state.devices.map((device) => 
              device.id === deviceId ? updatedDevice : device
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to update fan speed', isLoading: false });
        }
      },
      
      updateDeviceBrightness: async (deviceId: string, brightness: number) => {
        set({ isLoading: true, error: null });
        try {
          const updatedDevice = await deviceService.updateDeviceBrightness(deviceId, brightness);
          set((state) => ({
            devices: state.devices.map((device) => 
              device.id === deviceId ? updatedDevice : device
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to update device brightness', isLoading: false });
        }
      },
      
      updateDeviceTemperature: async (deviceId: string, temperature: number) => {
        set({ isLoading: true, error: null });
        try {
          const updatedDevice = await deviceService.updateDeviceTemperature(deviceId, temperature);
          set((state) => ({
            devices: state.devices.map((device) => 
              device.id === deviceId ? updatedDevice : device
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to update device temperature', isLoading: false });
        }
      },
      
      selectRoom: (roomId: string | null) => {
        set({ selectedRoomId: roomId });
        get().fetchDevices(roomId || undefined);
      },
      
      updateEnvironmentData: async (data: Partial<EnvironmentData>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedData = await environmentService.updateEnvironmentData(data);
          set({ environmentData: updatedData, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to update environment data', isLoading: false });
        }
      },
      
      
      // Local Actions (not using API)
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

      updateDeviceValue: async (deviceId: string, value: number) => {
        set({ isLoading: true, error: null });
        try {
          const updatedDevice = await deviceService.updateDeviceValue(deviceId, value);
          set((state) => ({
            devices: state.devices.map((device) => 
              device.id === deviceId ? updatedDevice : device
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to update device value', isLoading: false });
        }
      },
    }),
    {
      name: 'smart-home-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

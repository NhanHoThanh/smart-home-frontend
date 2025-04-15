# API Integration Changes Summary

This document outlines the changes needed for each file to implement the API integration plan.

## 1. New Files to Create

### services/api.ts (New File)

**Before**: This file didn't exist.

**After**: 
```typescript
import axios from 'axios';

const API_URL = 'https://api.smarthome.com/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
    }
    return Promise.reject(error);
  }
);

export default api;
```

### services/roomService.ts (New File)

**Before**: This file didn't exist.

**After**:
```typescript
import api from './api';
import { Room } from '@/types/smartHome';

export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get('/rooms');
  return response.data;
};

export const getRoomById = async (id: string): Promise<Room> => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

export const createRoom = async (room: Omit<Room, 'id'>): Promise<Room> => {
  const response = await api.post('/rooms', room);
  return response.data;
};

export const updateRoom = async (id: string, room: Partial<Room>): Promise<Room> => {
  const response = await api.put(`/rooms/${id}`, room);
  return response.data;
};

export const deleteRoom = async (id: string): Promise<void> => {
  await api.delete(`/rooms/${id}`);
};
```

### services/deviceService.ts (New File)

**Before**: This file didn't exist.

**After**:
```typescript
import api from './api';
import { Device } from '@/types/smartHome';

export const getDevices = async (roomId?: string): Promise<Device[]> => {
  const url = roomId ? `/devices?roomId=${roomId}` : '/devices';
  const response = await api.get(url);
  return response.data;
};

export const getDeviceById = async (id: string): Promise<Device> => {
  const response = await api.get(`/devices/${id}`);
  return response.data;
};

export const createDevice = async (device: Omit<Device, 'id'>): Promise<Device> => {
  const response = await api.post('/devices', device);
  return response.data;
};

export const updateDevice = async (id: string, device: Partial<Device>): Promise<Device> => {
  const response = await api.put(`/devices/${id}`, device);
  return response.data;
};

export const toggleDevice = async (id: string): Promise<{ id: string; status: boolean }> => {
  const response = await api.patch(`/devices/${id}/toggle`);
  return response.data;
};

export const updateDeviceBrightness = async (id: string, brightness: number): Promise<Device> => {
  const response = await api.patch(`/devices/${id}/brightness`, { brightness });
  return response.data;
};

export const updateDeviceTemperature = async (id: string, temperature: number): Promise<Device> => {
  const response = await api.patch(`/devices/${id}/temperature`, { temperature });
  return response.data;
};

export const deleteDevice = async (id: string): Promise<void> => {
  await api.delete(`/devices/${id}`);
};
```

### services/environmentService.ts (New File)

**Before**: This file didn't exist.

**After**:
```typescript
import api from './api';
import { EnvironmentData } from '@/types/smartHome';

export const getEnvironmentData = async (): Promise<EnvironmentData> => {
  const response = await api.get('/environment');
  return response.data;
};

export const updateEnvironmentData = async (data: Partial<EnvironmentData>): Promise<EnvironmentData> => {
  const response = await api.put('/environment', data);
  return response.data;
};
```

## 2. Existing Files to Modify

### store/smartHomeStore.ts

**Before**: The store used mock data and local state management.

**After**: The store will be updated to use API services and handle loading/error states:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device, Room, EnvironmentData } from '@/types/smartHome';
import * as roomService from '@/services/roomService';
import * as deviceService from '@/services/deviceService';
import * as environmentService from '@/services/environmentService';

interface SmartHomeState {
  // State
  devices: Device[];
  rooms: Room[];
  environmentData: EnvironmentData;
  selectedRoomId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRooms: () => Promise<void>;
  fetchDevices: (roomId?: string) => Promise<void>;
  fetchEnvironmentData: () => Promise<void>;
  toggleDevice: (deviceId: string) => Promise<void>;
  updateDeviceBrightness: (deviceId: string, brightness: number) => Promise<void>;
  updateDeviceTemperature: (deviceId: string, temperature: number) => Promise<void>;
  selectRoom: (roomId: string | null) => void;
  updateEnvironmentData: (data: Partial<EnvironmentData>) => Promise<void>;
}

export const useSmartHomeStore = create<SmartHomeState>()(
  persist(
    (set, get) => ({
      // Initial state
      devices: [],
      rooms: [],
      environmentData: {
        temperature: 0,
        humidity: 0,
        lightLevel: 0,
      },
      selectedRoomId: null,
      isLoading: false,
      error: null,
      
      // Actions
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
        set({ isLoading: true, error: null });
        try {
          const devices = await deviceService.getDevices(roomId);
          set({ devices, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch devices', isLoading: false });
        }
      },
      
      fetchEnvironmentData: async () => {
        set({ isLoading: true, error: null });
        try {
          const environmentData = await environmentService.getEnvironmentData();
          set({ environmentData, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch environment data', isLoading: false });
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
    }),
    {
      name: 'smart-home-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### components/RoomSelector.tsx

**Before**: The component used local state and didn't handle loading or error states.

**After**: The component will be updated to handle loading and error states:

```typescript
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import * as Icons from 'lucide-react-native';

export default function RoomSelector() {
  const { rooms, selectedRoomId, selectRoom, fetchRooms, isLoading, error } = useSmartHomeStore();

  useEffect(() => {
    fetchRooms();
  }, []);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    return IconComponent ? <IconComponent size={24} color={colors.primary} /> : null;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRooms}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rooms</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.roomItem,
            selectedRoomId === null && styles.selectedRoom,
          ]}
          onPress={() => selectRoom(null)}
        >
          <View style={styles.iconContainer}>
            <Icons.Home size={24} color={colors.primary} />
          </View>
          <Text style={styles.roomName}>All</Text>
        </TouchableOpacity>

        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={[
              styles.roomItem,
              selectedRoomId === room.id && styles.selectedRoom,
            ]}
            onPress={() => selectRoom(room.id)}
          >
            <View style={styles.iconContainer}>
              {getIconComponent(room.icon)}
            </View>
            <Text style={styles.roomName}>{room.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Existing styles...
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
  },
});
```

### app/_layout.tsx

**Before**: The app didn't fetch initial data on startup.

**After**: The app will fetch initial data on startup:

```typescript
import { useEffect } from 'react';
import { useSmartHomeStore } from '@/store/smartHomeStore';

export default function RootLayout() {
  const { fetchRooms, fetchDevices, fetchEnvironmentData } = useSmartHomeStore();

  useEffect(() => {
    // Fetch initial data
    fetchRooms();
    fetchDevices();
    fetchEnvironmentData();
  }, []);

  // Rest of the component...
}
```

## 3. Dependencies to Add

Add the following dependencies to your package.json:

```json
{
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

## 4. Summary of Changes

1. **New Files**:
   - services/api.ts
   - services/roomService.ts
   - services/deviceService.ts
   - services/environmentService.ts

2. **Modified Files**:
   - store/smartHomeStore.ts
   - components/RoomSelector.tsx
   - app/_layout.tsx

3. **Key Changes**:
   - Added API service layer for making HTTP requests
   - Updated store to use API services instead of mock data
   - Added loading and error states to components
   - Implemented data fetching in app initialization
   - Removed offline caching functionality 
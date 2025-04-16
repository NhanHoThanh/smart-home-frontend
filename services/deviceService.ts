import api from './api';
import { Device } from '@/types/smartHome';

export const getDevices = async (roomId?: string): Promise<Device[]> => {
  const url = roomId ? `/devices?roomId=${roomId}` : '/devices';
  const response = await api.get(url);
  // console.log(response.data);
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
  const response = await api.patch(`/devices/${id}`);
  console.log(response.data);
  if (response.data.status === 'on') {
    return { id, status: true };
  } else {
    return { id, status: false };
  }
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
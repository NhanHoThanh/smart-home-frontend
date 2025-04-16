import api from './api';
import { Room } from '@/types/smartHome';

export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get('/rooms');
  console.log(response.data);
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
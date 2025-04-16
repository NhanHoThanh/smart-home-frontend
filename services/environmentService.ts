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
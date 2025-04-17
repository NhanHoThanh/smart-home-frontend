import api from './api';
import { EnvironmentData, HistoricalEnvironmentData } from '@/types/smartHome';

export const getEnvironmentData = async (): Promise<EnvironmentData> => {
  const response = await api.get('/environment');
  return response.data;
};

export const getHistoricalEnvironmentData = async (): Promise<HistoricalEnvironmentData> => {
  const response = await api.get('/environment/all');
  return response.data;
};

export const updateEnvironmentData = async (data: Partial<EnvironmentData>): Promise<EnvironmentData> => {
  const response = await api.put('/environment', data);
  return response.data;
}; 
// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { EnvironmentData } from '@/types/smartHome';

export const THRESHOLDS = {
  temperature: {
    min: 18,
    max: 25,
    unit: '°C'
  },
  humidity: {
    min: 30,
    max: 60,
    unit: '%'
  },
  lightLevel: {
    min: 0,
    max: 90,
    unit: 'lux'
  }
};

// Request notification permissions
export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('environment', {
      name: 'Environment Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
}

// Configure notifications
export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList  : true,
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}


export function checkEnvironmentThresholds(data: EnvironmentData): string[] {
  const alerts: string[] = [];

  if (data.temperature > THRESHOLDS.temperature.max) {
    console.log('High temperature alert: ', data.temperature);
    alerts.push(`High temperature alert: ${data.temperature}${THRESHOLDS.temperature.unit}`);
  } else if (data.temperature < THRESHOLDS.temperature.min) {
    alerts.push(`Low temperature alert: ${data.temperature}${THRESHOLDS.temperature.unit}`);
  }

  if (data.humidity > THRESHOLDS.humidity.max) {
    alerts.push(`High humidity alert: ${data.humidity}${THRESHOLDS.humidity.unit}`);
  } else if (data.humidity < THRESHOLDS.humidity.min) {
    alerts.push(`Low humidity alert: ${data.humidity}${THRESHOLDS.humidity.unit}`);
  }

  if (data.lightLevel > THRESHOLDS.lightLevel.max) {
    alerts.push(`High light level alert: ${data.lightLevel}${THRESHOLDS.lightLevel.unit}`);
  }

  return alerts;
}

// Send notification
export async function sendNotification(title: string, body: string) {

  if (Platform.OS === 'web') {
    console.log({
      title,
      body,
      data: { type: 'environment_alert' },
    });
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type: 'environment_alert' },
    },
    trigger: null, 
  });
}
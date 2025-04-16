import React from 'react';
import * as Icons from 'lucide-react-native';
import { Room, Device } from '@/types/smartHome';

// Room icon mapping
export const getRoomIcon = (room: Room): React.ReactNode => {
  switch (room.icon) {
    case 'sofa':
      return React.createElement(Icons.Sofa, { size: 24, color: "#333" });
    case 'utensils':
      return React.createElement(Icons.Utensils, { size: 24, color: "#333" });
    case 'bed':
      return React.createElement(Icons.Bed, { size: 24, color: "#333" });
    case 'bath':
      return React.createElement(Icons.Bath, { size: 24, color: "#333" });
    case 'laptop':
      return React.createElement(Icons.Laptop2, { size: 24, color: "#333" });
    case 'door-open':
      return React.createElement(Icons.DoorOpen, { size: 24, color: "#333" });
    case 'tree':
      return React.createElement(Icons.Trees, { size: 24, color: "#333" });
    default:
      return React.createElement(Icons.Home, { size: 24, color: "#333" });
  }
};

// Device icon mapping
export const getDeviceIcon = (device: Device): React.ReactNode => {
  switch (device.icon) {
    case 'lamp-ceiling':
      return React.createElement(Icons.LampCeiling, { size: 24, color: "#333" });
    case 'lamp-floor':
      return React.createElement(Icons.LampFloor, { size: 24, color: "#333" });
    case 'tv':
      return React.createElement(Icons.Tv, { size: 24, color: "#333" });
    case 'air-vent':
      return React.createElement(Icons.AirVent, { size: 24, color: "#333" });
    case 'refrigerator':
      return React.createElement(Icons.RefrigeratorIcon, { size: 24, color: "#333" });
    case 'microwave':
      return React.createElement(Icons.Microwave, { size: 24, color: "#333" });
    case 'lamp-desk':
      return React.createElement(Icons.LampDesk, { size: 24, color: "#333" });
    case 'computer':
      return React.createElement(Icons.Computer, { size: 24, color: "#333" });
    default:
      return React.createElement(Icons.Power, { size: 24, color: "#333" });
  }
}; 
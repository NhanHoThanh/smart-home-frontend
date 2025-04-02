import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { Lightbulb, Moon, Lock, Power, Thermometer } from 'lucide-react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';

export default function QuickActions() {
  const { devices, toggleDevice } = useSmartHomeStore();
  
  const handleAllLights = (turnOn: boolean) => {
    devices
      .filter(device => device.type === 'light')
      .forEach(device => {
        if (device.status !== turnOn) {
          toggleDevice(device.id);
        }
      });
  };

  const handleAllDevices = (turnOn: boolean) => {
    devices.forEach(device => {
      if (device.status !== turnOn) {
        toggleDevice(device.id);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleAllLights(true)}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <Lightbulb size={24} color={colors.primary} />
          </View>
          <Text style={styles.actionText}>All Lights On</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleAllLights(false)}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <Moon size={24} color={colors.primary} />
          </View>
          <Text style={styles.actionText}>All Lights Off</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.secondary}20` }]}>
            <Lock size={24} color={colors.secondary} />
          </View>
          <Text style={styles.actionText}>Lock Doors</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleAllDevices(false)}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#F4433620' }]}>
            <Power size={24} color="#F44336" />
          </View>
          <Text style={styles.actionText}>Power Off All</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#FFC10720' }]}>
            <Thermometer size={24} color="#FFC107" />
          </View>
          <Text style={styles.actionText}>Eco Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
});

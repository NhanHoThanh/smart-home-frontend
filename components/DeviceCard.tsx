import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { getDeviceIcon } from '@/utils/icons';
import { Device } from '@/types/smartHome';

interface DeviceCardProps {
  device: Device;
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const { toggleDevice, updateFanSpeed } = useSmartHomeStore();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        device.status && styles.activeCard,
      ]}
      onPress={() => {
        console.log('Device ID:', device.id);
        toggleDevice(device.id);
      }}
    >
      <View style={styles.iconContainer}>
        {getDeviceIcon(device)}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.deviceName}>{device.name}</Text>
      </View>
      <View style={styles.toggleContainer}>
        {device.type === 'fan' ? (
          <View style={styles.fanSpeedContainer}>
            {[0, 1, 2, 3].map((speed) => {
              const modeSpeed = speed === 0 ? 0 : speed * 25 + 25;
              const deviceSpeed = device.value || 0;
              const isActive = deviceSpeed === modeSpeed;
              // console.log(`Fan ${device.id}: deviceSpeed=${deviceSpeed}, currentSpeed=${modeSpeed}, speed=${speed}, isActive=${isActive}`);
              return (
                <TouchableOpacity
                  key={speed}
                  style={[
                    styles.speedButton,
                    isActive && styles.speedButtonActive,
                  ]}
                  onPress={async () => {
                    console.log(`Setting fan ${device.id} to speed ${speed} (${modeSpeed}%)`);
                    await updateFanSpeed(device.id, modeSpeed);
                  }}
                >
                  <Text 
                    style={[
                      styles.speedButtonText,
                      isActive && styles.speedButtonTextActive,
                    ]}
                  >
                    {speed}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View 
            style={[
              styles.toggleButton,
              device.status ? styles.toggleActive : styles.toggleInactive,
            ]}
          >
            <View 
              style={[
                styles.toggleCircle,
                device.status ? styles.toggleCircleActive : styles.toggleCircleInactive,
              ]} 
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  toggleContainer: {
    marginLeft: 8,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: `${colors.primary}30`,
  },
  toggleInactive: {
    backgroundColor: colors.border,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleCircleActive: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  toggleCircleInactive: {
    backgroundColor: colors.inactive,
    alignSelf: 'flex-start',
  },
  fanSpeedContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  speedButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedButtonActive: {
    backgroundColor: colors.primary,
  },
  speedButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  speedButtonTextActive: {
    color: 'white',
  },
});

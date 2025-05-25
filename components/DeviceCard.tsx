import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { getDeviceIcon } from '@/utils/icons';
import { Device } from '@/types/smartHome';
import Slider from '@react-native-community/slider';
import debounce from 'lodash/debounce';
import * as ImagePicker from 'expo-image-picker';
import { faceService } from '@/services/faceService';

interface DeviceCardProps {
  device: Device;
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const { toggleDevice, updateFanSpeed, updateDeviceValue } = useSmartHomeStore();
  const [showFaceIdModal, setShowFaceIdModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<"pending" | "success" | "fail" | null>(null);

  // Create a debounced version of updateDeviceValue
  const debouncedUpdateValue = useCallback(
    debounce((deviceId: string, value: number) => {
      console.log(`Setting light ${deviceId} brightness to ${value}%`);
      updateDeviceValue(deviceId, value);
    }, 500), // 500ms delay
    []
  );

  const startFaceRecognition = async () => {
    try {
      setIsAuthenticating(true);
      setAuthStatus("pending");
      setShowFaceIdModal(true);

      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Camera permission not granted');
      }

      // Take a photo
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) {
        throw new Error('Photo capture cancelled');
      }

      if (!result.assets[0].base64) {
        throw new Error('Failed to capture image');
      }

      // Verify face with API
      await faceService.verifyFace(device.id, result.assets[0].base64);
      
      // If verification successful, toggle the device
      setAuthStatus("success");
      toggleDevice(device.id);
    } catch (error: any) {
      console.error('Face verification error:', error);
      setAuthStatus("fail");
    } finally {
      // Keep modal visible for a short time after authentication
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowFaceIdModal(false);
      setIsAuthenticating(false);
      setAuthStatus(null);
    }
  };

  const handlePress = () => {
    if (device.type === "door" && !device.status && !isAuthenticating) {
      startFaceRecognition();
    } else if (device.type === "door" && device.status) {
      // Handle door closing (no face recognition needed)
      toggleDevice(device.id);
    } else {
      toggleDevice(device.id);
    }
  };

  return (
    <>
      <View style={[
        styles.card,
        device.status && styles.activeCard,
      ]}>
        <View style={styles.mainContent}>
      <View style={styles.iconContainer}>
        {getDeviceIcon(device)}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceStatus}>
              {device.status ? "Open" : "Closed"}
              {device.type === "light" && device.status && (
                ` • Brightness: ${device.value || 0}%`
              )}
            </Text>
      </View>
      <View style={styles.toggleContainer}>
            {device.type === "fan" ? (
          <View style={styles.fanSpeedContainer}>
            {[0, 1, 2, 3].map((speed) => {
              const modeSpeed = speed === 0 ? 0 : speed * 25 + 25;
              const deviceSpeed = device.value || 0;
              const isActive = deviceSpeed === modeSpeed;
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
              <TouchableOpacity onPress={handlePress}>
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
              </TouchableOpacity>
            )}
          </View>
        </View>
        {device.type === "light" && device.status && (
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={device.value || 0}
              onValueChange={(value) => {
                debouncedUpdateValue(device.id, value);
              }}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
          </View>
        )}
      </View>
      <Modal visible={showFaceIdModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          {authStatus === "pending" && (
            <Image
              source={require("@/assets/images/face-id.gif")}
              style={styles.faceIdGif}
              resizeMode="contain"
            />
          )}
          {authStatus === "success" && (
            <Image
              source={require("@/assets/images/face-id-success.gif")}
              style={styles.faceIdGif}
              resizeMode="contain"
            />
          )}
          {authStatus === "fail" && (
            <Image
              source={require("@/assets/images/face-id.gif")}
              style={styles.faceIdGif}
              resizeMode="contain"
            />
          )}
          <Text style={styles.modalText}>
            {authStatus === "pending" && "Scanning face..."}
            {authStatus === "success" && "Authentication successful"}
            {authStatus === "fail" && "Authentication failed"}
          </Text>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
    marginTop: 4,
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
  sliderContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  faceIdGif: {
    resizeMode: 'contain',
    maxWidth: 150,
    maxHeight: 150,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
});

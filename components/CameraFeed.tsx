import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '@/constants/colors';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import { Camera, Shield } from 'lucide-react-native';

export default function CameraFeed() {
  const { authStatus, cameras } = useSmartHomeStore();
  
  // Get the front door camera (first camera in the list for demo)
  const frontDoorCamera = cameras[0];

  if (!authStatus.isAuthenticated || !frontDoorCamera) {
    return null;
  }

  const formatTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Shield size={20} color="#4CAF50" />
          <Text style={styles.title}>Authenticated Access</Text>
        </View>
        {authStatus.expiresAt && (
          <Text style={styles.expiry}>
            Expires: {formatTimeRemaining(authStatus.expiresAt)}
          </Text>
        )}
      </View>

      <View style={styles.cameraContainer}>
        <View style={styles.cameraHeader}>
          <Camera size={16} color={colors.text} />
          <Text style={styles.cameraTitle}>{frontDoorCamera.name}</Text>
          <View style={[styles.statusDot, (frontDoorCamera.isActive || frontDoorCamera.isOnline) && styles.activeDot]} />
        </View>
        
        <View style={styles.cameraView}>
          <Image 
            source={{ uri: frontDoorCamera.streamUrl || frontDoorCamera.imageUrl }} 
            style={styles.cameraImage}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Live Feed</Text>
            <Text style={styles.overlaySubtext}>
              Authenticated as {authStatus.userName}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  expiry: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  cameraContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  cameraTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  cameraView: {
    position: 'relative',
    height: 200,
  },
  cameraImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  overlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  overlaySubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});

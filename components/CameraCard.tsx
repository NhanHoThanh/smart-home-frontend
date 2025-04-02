import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Camera, Video, AlertCircle, Wifi, WifiOff, User, Users, Dog } from 'lucide-react-native';
import { Camera as CameraType, DetectedEntity } from '@/types/smartHome';
import { useRouter } from 'expo-router';

interface CameraCardProps {
  camera: CameraType;
}

export default function CameraCard({ camera }: CameraCardProps) {
  const { selectCamera } = useSmartHomeStore();
  const router = useRouter();

  const handlePress = () => {
    selectCamera(camera);
    router.push('/camera-detail');
  };

  // Get the most recent detected entity
  const getLatestDetection = (): DetectedEntity | undefined => {
    if (!camera.detectedEntities || camera.detectedEntities.length === 0) {
      return undefined;
    }
    return camera.detectedEntities[0];
  };

  const latestDetection = getLatestDetection();

  // Get detection icon and label
  const getDetectionInfo = () => {
    if (!latestDetection) return { icon: null, label: 'No Detection' };

    switch (latestDetection.type) {
      case 'person':
        if (latestDetection.personType === 'owner') {
          return { 
            icon: <User size={14} color="#FFF" />, 
            label: latestDetection.personName || 'Owner'
          };
        } else if (latestDetection.personType === 'family') {
          return { 
            icon: <Users size={14} color="#FFF" />, 
            label: latestDetection.personName || 'Family Member'
          };
        } else {
          return { 
            icon: <AlertCircle size={14} color="#FFF" />, 
            label: 'Stranger'
          };
        }
      case 'animal':
        return { 
          icon: <Dog size={14} color="#FFF" />, 
          label: latestDetection.animalType || 'Animal'
        };
      default:
        return { 
          icon: <AlertCircle size={14} color="#FFF" />, 
          label: 'Motion'
        };
    }
  };

  const { icon, label } = getDetectionInfo();

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        !camera.isOnline && styles.offlineCard
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {camera.isOnline ? (
          <Image 
            source={{ uri: camera.imageUrl }} 
            style={styles.cameraImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.offlineImagePlaceholder}>
            <WifiOff size={32} color={colors.inactive} />
            <Text style={styles.offlineText}>Camera Offline</Text>
          </View>
        )}
        
        {camera.hasMotion && camera.isOnline && latestDetection && (
          <View style={styles.motionBadge}>
            {icon}
            <Text style={styles.motionText}>{label}</Text>
          </View>
        )}
        
        {camera.isOnline && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>LIVE</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.cameraName}>{camera.name}</Text>
          {camera.isOnline ? (
            <Wifi size={16} color={colors.success} />
          ) : (
            <WifiOff size={16} color={colors.inactive} />
          )}
        </View>
        
        {camera.hasMotion && camera.lastMotionTime && (
          <Text style={styles.motionTime}>
            {latestDetection ? `${label} detected ${camera.lastMotionTime}` : `Motion detected ${camera.lastMotionTime}`}
          </Text>
        )}
        
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <Camera size={16} color={camera.isOnline ? colors.primary : colors.inactive} />
          </View>
          
          <View style={styles.iconContainer}>
            <Video 
              size={16} 
              color={camera.hasRecording ? colors.primary : colors.inactive} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  offlineCard: {
    opacity: 0.8,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  cameraImage: {
    height: '100%',
    width: '100%',
  },
  offlineImagePlaceholder: {
    height: '100%',
    width: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    color: colors.inactive,
    marginTop: 8,
    fontWeight: '500',
  },
  motionBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.error,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  motionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    marginRight: 4,
  },
  recordingText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cameraName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  motionTime: {
    fontSize: 12,
    color: colors.error,
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});

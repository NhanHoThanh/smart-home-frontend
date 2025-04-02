import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';
import { 
  ArrowLeft, 
  Video, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Camera, 
  Mic, 
  Bell, 
  BellOff,
  RotateCw,
  Wifi,
  WifiOff,
  User,
  Users,
  Dog,
  AlertCircle
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { DetectedEntity } from '@/types/smartHome';

export default function CameraDetailScreen() {
  const { selectedCamera, rooms, toggleCameraOnline, toggleCameraMotion } = useSmartHomeStore();
  const router = useRouter();
  
  const [muted, setMuted] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!selectedCamera) {
      router.back();
    }
  }, [selectedCamera]);
  
  if (!selectedCamera) {
    return null;
  }
  
  const roomName = rooms.find(r => r.id === selectedCamera.roomId)?.name || 'Unknown';
  
  const handleBackPress = () => {
    router.back();
  };
  
  const handleMuteToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setMuted(!muted);
  };
  
  const handleNotificationsToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotifications(!notifications);
  };
  
  const handleRefresh = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      
      // Randomly toggle motion
      if (Math.random() > 0.7) {
        toggleCameraMotion(selectedCamera.id);
      }
    }, 1500);
  };
  
  const handleToggleOnline = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleCameraOnline(selectedCamera.id);
  };

  // Get detection icon and label for an entity
  const getDetectionInfo = (entity: DetectedEntity) => {
    switch (entity.type) {
      case 'person':
        if (entity.personType === 'owner') {
          return { 
            icon: <User size={16} color={colors.primary} />, 
            label: entity.personName || 'Owner',
            description: 'Recognized as home owner'
          };
        } else if (entity.personType === 'family') {
          return { 
            icon: <Users size={16} color={colors.secondary} />, 
            label: entity.personName || 'Family Member',
            description: 'Recognized as family member'
          };
        } else {
          return { 
            icon: <AlertCircle size={16} color={colors.error} />, 
            label: 'Stranger',
            description: 'Unrecognized person detected'
          };
        }
      case 'animal':
        return { 
          icon: <Dog size={16} color="#FFC107" />, 
          label: entity.animalType || 'Animal',
          description: `Detected ${entity.animalType || 'animal'}`
        };
      default:
        return { 
          icon: <AlertCircle size={16} color={colors.warning} />, 
          label: 'Unknown',
          description: 'Unidentified motion detected'
        };
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: selectedCamera.name,
          headerShown: false,
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          {selectedCamera.isOnline ? (
            <Image 
              source={{ uri: selectedCamera.imageUrl }} 
              style={styles.videoFeed}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.offlineContainer}>
              <WifiOff size={48} color={colors.inactive} />
              <Text style={styles.offlineText}>Camera Offline</Text>
              <TouchableOpacity 
                style={styles.reconnectButton}
                onPress={handleToggleOnline}
              >
                <Text style={styles.reconnectText}>Reconnect</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {selectedCamera.isOnline && (
            <>
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>LIVE</Text>
              </View>
              
              {selectedCamera.hasMotion && selectedCamera.detectedEntities && selectedCamera.detectedEntities.length > 0 && (
                <View style={styles.motionBadge}>
                  {getDetectionInfo(selectedCamera.detectedEntities[0]).icon}
                  <Text style={styles.motionText}>
                    {getDetectionInfo(selectedCamera.detectedEntities[0]).label} Detected
                  </Text>
                </View>
              )}
              
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <RotateCw size={32} color="#FFF" style={styles.loadingIcon} />
                </View>
              )}
            </>
          )}
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.detailsContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.cameraName}>{selectedCamera.name}</Text>
              <Text style={styles.roomName}>{roomName}</Text>
            </View>
            <View style={styles.statusContainer}>
              {selectedCamera.isOnline ? (
                <Wifi size={16} color={colors.success} />
              ) : (
                <WifiOff size={16} color={colors.inactive} />
              )}
              <Text style={[
                styles.statusText,
                { color: selectedCamera.isOnline ? colors.success : colors.inactive }
              ]}>
                {selectedCamera.isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleMuteToggle}
              disabled={!selectedCamera.isOnline}
            >
              <View style={[
                styles.controlIcon,
                !selectedCamera.isOnline && styles.disabledIcon
              ]}>
                {muted ? (
                  <VolumeX size={24} color={selectedCamera.isOnline ? colors.primary : colors.inactive} />
                ) : (
                  <Volume2 size={24} color={selectedCamera.isOnline ? colors.primary : colors.inactive} />
                )}
              </View>
              <Text style={[
                styles.controlText,
                !selectedCamera.isOnline && styles.disabledText
              ]}>
                {muted ? 'Unmute' : 'Mute'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              disabled={!selectedCamera.isOnline}
            >
              <View style={[
                styles.controlIcon,
                !selectedCamera.isOnline && styles.disabledIcon
              ]}>
                <Mic size={24} color={selectedCamera.isOnline ? colors.primary : colors.inactive} />
              </View>
              <Text style={[
                styles.controlText,
                !selectedCamera.isOnline && styles.disabledText
              ]}>Talk</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              disabled={!selectedCamera.isOnline}
            >
              <View style={[
                styles.controlIcon,
                !selectedCamera.isOnline && styles.disabledIcon
              ]}>
                <Video size={24} color={selectedCamera.isOnline ? colors.primary : colors.inactive} />
              </View>
              <Text style={[
                styles.controlText,
                !selectedCamera.isOnline && styles.disabledText
              ]}>Record</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleRefresh}
            >
              <View style={styles.controlIcon}>
                <RotateCw size={24} color={colors.primary} />
              </View>
              <Text style={styles.controlText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          {selectedCamera.detectedEntities && selectedCamera.detectedEntities.length > 0 && (
            <View style={styles.detectionContainer}>
              <Text style={styles.detectionTitle}>Recent Detections</Text>
              
              {selectedCamera.detectedEntities.map((entity, index) => {
                const { icon, label, description } = getDetectionInfo(entity);
                return (
                  <View key={index} style={styles.detectionItem}>
                    <View style={styles.detectionIconContainer}>
                      {icon}
                    </View>
                    <View style={styles.detectionInfo}>
                      <Text style={styles.detectionLabel}>{label}</Text>
                      <Text style={styles.detectionDescription}>{description}</Text>
                      <Text style={styles.detectionTime}>{entity.timestamp}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          
          <View style={styles.settingsContainer}>
            <Text style={styles.settingsTitle}>Camera Settings</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleNotificationsToggle}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}20` }]}>
                  {notifications ? (
                    <Bell size={20} color={colors.primary} />
                  ) : (
                    <BellOff size={20} color={colors.primary} />
                  )}
                </View>
                <Text style={styles.settingText}>Motion Notifications</Text>
              </View>
              <View style={[
                styles.toggle,
                notifications ? styles.toggleActive : styles.toggleInactive
              ]}>
                <View style={[
                  styles.toggleCircle,
                  notifications ? styles.toggleCircleActive : styles.toggleCircleInactive
                ]} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleToggleOnline}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}20` }]}>
                  {selectedCamera.isOnline ? (
                    <Wifi size={20} color={colors.primary} />
                  ) : (
                    <WifiOff size={20} color={colors.primary} />
                  )}
                </View>
                <Text style={styles.settingText}>Camera Status</Text>
              </View>
              <View style={[
                styles.toggle,
                selectedCamera.isOnline ? styles.toggleActive : styles.toggleInactive
              ]}>
                <View style={[
                  styles.toggleCircle,
                  selectedCamera.isOnline ? styles.toggleCircleActive : styles.toggleCircleInactive
                ]} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${colors.secondary}20` }]}>
                  <Camera size={20} color={colors.secondary} />
                </View>
                <Text style={styles.settingText}>Video Quality</Text>
              </View>
              <Text style={styles.settingValue}>HD (1080p)</Text>
            </TouchableOpacity>
          </View>
          
          {selectedCamera.hasRecording && (
            <View style={styles.recordingsContainer}>
              <Text style={styles.recordingsTitle}>Recent Recordings</Text>
              
              <View style={styles.recordingItem}>
                <View style={styles.recordingPreview}>
                  <Image 
                    source={{ uri: selectedCamera.imageUrl }} 
                    style={styles.recordingThumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.playButton}>
                    <Video size={16} color="#FFF" />
                  </View>
                </View>
                <View style={styles.recordingInfo}>
                  <Text style={styles.recordingName}>
                    {selectedCamera.detectedEntities && selectedCamera.detectedEntities.length > 0
                      ? `${getDetectionInfo(selectedCamera.detectedEntities[0]).label} Detected`
                      : 'Motion Event'}
                  </Text>
                  <Text style={styles.recordingTime}>Today, 2:45 PM</Text>
                  <Text style={styles.recordingDuration}>00:32</Text>
                </View>
              </View>
              
              <View style={styles.recordingItem}>
                <View style={styles.recordingPreview}>
                  <Image 
                    source={{ uri: selectedCamera.imageUrl }} 
                    style={styles.recordingThumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.playButton}>
                    <Video size={16} color="#FFF" />
                  </View>
                </View>
                <View style={styles.recordingInfo}>
                  <Text style={styles.recordingName}>
                    {selectedCamera.detectedEntities && selectedCamera.detectedEntities.length > 0
                      ? `${getDetectionInfo(selectedCamera.detectedEntities[0]).label} Detected`
                      : 'Motion Event'}
                  </Text>
                  <Text style={styles.recordingTime}>Today, 10:12 AM</Text>
                  <Text style={styles.recordingDuration}>00:18</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All Recordings</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
    backgroundColor: '#000',
  },
  videoFeed: {
    height: '100%',
    width: '100%',
  },
  offlineContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    color: colors.inactive,
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  reconnectButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  reconnectText: {
    color: '#FFF',
    fontWeight: '600',
  },
  recordingIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
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
  motionBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.error,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  motionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    transform: [{ rotate: '0deg' }],
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  roomName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginLeft: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  disabledIcon: {
    backgroundColor: `${colors.inactive}10`,
  },
  controlText: {
    fontSize: 12,
    color: colors.text,
  },
  disabledText: {
    color: colors.inactive,
  },
  detectionContainer: {
    marginBottom: 24,
  },
  detectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  detectionItem: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  detectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detectionInfo: {
    flex: 1,
  },
  detectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  detectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detectionTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  settingsContainer: {
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  toggle: {
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
  recordingsContainer: {
    marginBottom: 24,
  },
  recordingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  recordingItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recordingPreview: {
    width: 100,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  recordingThumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  recordingTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  recordingDuration: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    marginTop: 8,
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

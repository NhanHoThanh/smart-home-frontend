import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import CameraCard from '@/components/CameraCard';
import { Camera, ShieldAlert } from 'lucide-react-native';

export default function CamerasScreen() {
  const { cameras, rooms, toggleCameraMotion } = useSmartHomeStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [securityStatus, setSecurityStatus] = React.useState('Armed');

  // Simulate random motion detection
  useEffect(() => {
    const interval = setInterval(() => {
      const randomCameraIndex = Math.floor(Math.random() * cameras.length);
      const randomCamera = cameras[randomCameraIndex];
      
      if (randomCamera.isOnline && Math.random() > 0.7) {
        toggleCameraMotion(randomCamera.id);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [cameras]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown';
  };

  // Group cameras by room
  const camerasByRoom = cameras.reduce((acc, camera) => {
    const roomName = getRoomName(camera.roomId);
    if (!acc[roomName]) {
      acc[roomName] = [];
    }
    acc[roomName].push(camera);
    return acc;
  }, {} as Record<string, typeof cameras>);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Security Cameras</Text>
          <Text style={styles.subtitle}>Monitor your home security</Text>
        </View>

        <View style={styles.securityStatusContainer}>
          <View style={styles.securityStatusCard}>
            <View style={styles.securityIconContainer}>
              <ShieldAlert size={24} color={colors.primary} />
            </View>
            <View style={styles.securityTextContainer}>
              <Text style={styles.securityStatusText}>Security System: <Text style={styles.securityStatusValue}>{securityStatus}</Text></Text>
              <Text style={styles.securityStatusSubtext}>All cameras are being monitored</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cameras.length}</Text>
            <Text style={styles.statLabel}>Total Cameras</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cameras.filter(c => c.isOnline).length}</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cameras.filter(c => c.hasMotion).length}</Text>
            <Text style={styles.statLabel}>Motion</Text>
          </View>
        </View>

        <View style={styles.camerasContainer}>
          {Object.entries(camerasByRoom).map(([roomName, roomCameras]) => (
            <View key={roomName} style={styles.roomSection}>
              <Text style={styles.roomTitle}>{roomName}</Text>
              {roomCameras.map(camera => (
                <CameraCard key={camera.id} camera={camera} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  securityStatusContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  securityStatusCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  securityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityStatusText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  securityStatusValue: {
    fontWeight: '600',
    color: colors.primary,
  },
  securityStatusSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  camerasContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    paddingBottom: 24,
  },
  roomSection: {
    marginBottom: 24,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
});

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { RoomSelector } from '@/components/RoomSelector';
import DeviceCard from '@/components/DeviceCard';
import QuickActions from '@/components/QuickActions';
import EnvironmentPanel from '@/components/EnvironmentPanel';


export default function HomeScreen() {
  const { 
    devices, 
    selectedRoomId, 
    fetchDevices, 
    error, 
    isDevicesLoading 
  } = useSmartHomeStore();

  useEffect(() => {
    const loadDevices = async () => {
      try {
        await fetchDevices(selectedRoomId || undefined);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    loadDevices();
  }, [selectedRoomId, fetchDevices]);

  const filteredDevices = selectedRoomId
    ? devices.filter(device => device.room_id === selectedRoomId && !device.name.toLowerCase().includes('sensor'))
    : devices.filter(device => !device.name.toLowerCase().includes('sensor'));

  // console.log('Current state:', {
  //   allDevices: devices,
  //   selectedRoom: selectedRoomId,
  //   filteredDevices,
  //   error
  // });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome Home</Text>
          <Text style={styles.subGreeting}>Control your smart home</Text>
        </View>

        <EnvironmentPanel />
        <RoomSelector />
        <QuickActions />

        <View style={styles.devicesContainer}>
          <Text style={styles.sectionTitle}>
            {selectedRoomId ? 'Room Devices' : 'All Devices'}
          </Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : isDevicesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading devices...</Text>
            </View>
          ) : (
            <>
              {filteredDevices.map(device => (
                <DeviceCard key={device.id} device={device} />
              ))}
              
              {filteredDevices.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No devices found</Text>
                </View>
              )}
            </>
          )}
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  devicesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

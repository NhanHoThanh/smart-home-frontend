import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import RoomSelector from '@/components/RoomSelector';
import DeviceCard from '@/components/DeviceCard';
import QuickActions from '@/components/QuickActions';
import EnvironmentPanel from '@/components/EnvironmentPanel';

export default function HomeScreen() {
  const { devices, selectedRoomId } = useSmartHomeStore();
  const filteredDevices = selectedRoomId
    ? devices.filter(device => device.roomId === selectedRoomId)
    : devices;

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
          {filteredDevices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
          
          {filteredDevices.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No devices found</Text>
            </View>
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
});

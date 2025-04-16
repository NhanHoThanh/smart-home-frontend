import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Home } from 'lucide-react-native';
import { getRoomIcon } from '@/utils/icons';

export const RoomSelector = () => {
  const { rooms, selectedRoomId, selectRoom, fetchRooms, isLoading, error } = useSmartHomeStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRooms}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rooms</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.roomItem,
            selectedRoomId === null && styles.selectedRoom,
          ]}
          onPress={() => selectRoom(null)}
        >
          <View style={styles.iconContainer}>
            <Home size={24} color={colors.primary} />
          </View>
          <Text style={styles.roomName}>All</Text>
        </TouchableOpacity>

        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={[
              styles.roomItem,
              selectedRoomId === room.id && styles.selectedRoom,
            ]}
            onPress={() => selectRoom(room.id)}
          >
            <View style={styles.iconContainer}>
              {getRoomIcon(room)}
            </View>
            <Text style={styles.roomName}>{room.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  roomItem: {
    alignItems: 'center',
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedRoom: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});


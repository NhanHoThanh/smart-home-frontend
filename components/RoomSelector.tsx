import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import * as Icons from 'lucide-react-native';

export default function RoomSelector() {
  const { rooms, selectedRoomId, selectRoom } = useSmartHomeStore();

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    return IconComponent ? <IconComponent size={24} color={colors.primary} /> : null;
  };

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
            <Icons.Home size={24} color={colors.primary} />
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
              {getIconComponent(room.icon)}
            </View>
            <Text style={styles.roomName}>{room.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

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
});

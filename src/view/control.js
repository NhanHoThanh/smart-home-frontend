import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Surface, Text, Switch, IconButton, Card } from 'react-native-paper';
import COLORS from "../../colors";


const Control = () => {
  const colors = COLORS;
  const [selectedTab, setSelectedTab] = useState('Room');
  const [rooms, setRooms] = useState({
    'Master Bedroom': { light: false, ac: false, fan: 0 },
    'Living Room': { light: false, ac: false, fan: 0 },
    'Kitchen': { light: false, ac: false, fan: 0 },
    'Bathroom': { light: false, ac: false, fan: 0 }
  });

  const toggleDevice = (room, device) => {
    setRooms(prev => ({
      ...prev,
      [room]: {
        ...prev[room],
        [device]: !prev[room][device]
      }
    }));
  };

  const adjustFan = (room, increment) => {
    setRooms(prev => ({
      ...prev,
      [room]: {
        ...prev[room],
        fan: Math.max(0, Math.min(3, prev[room].fan + increment))
      }
    }));
  };

  const RoomCard = ({ name, devices }) => (
    <Card style={styles.roomCard} elevation={2}>
      <Card.Cover source={require('../img/background.jpg')} style={styles.roomImage} />
      <Card.Content style={styles.roomContent}>
        <Text variant="titleLarge" style={styles.roomName}>{name}</Text>
        <Text variant="bodyMedium" style={styles.deviceCount}>{Object.keys(devices).length} devices</Text>
        <View style={styles.deviceControls}>
          <View style={styles.deviceRow}>
            <TouchableOpacity
              style={[styles.deviceButton, devices.light && styles.deviceButtonActive]}
              onPress={() => toggleDevice(name, 'light')}>
              <Image source={require("../img/icon/light.png")} style={styles.deviceIcon} />
              <Text style={styles.deviceLabel}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deviceButton, devices.ac && styles.deviceButtonActive]}
              onPress={() => toggleDevice(name, 'ac')}>
              <Image source={require("../img/icon/air_conditioner.png")} style={styles.deviceIcon} />
              <Text style={styles.deviceLabel}>AC</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fanControl}>
            <Image source={require("../img/icon/fan.png")} style={styles.deviceIcon} />
            <View style={styles.fanLevelControl}>
              <IconButton
                icon="minus"
                mode="contained-tonal"
                onPress={() => adjustFan(name, -1)}
                style={styles.fanButton}
              />
              <Text variant="titleLarge" style={styles.fanLevel}>{devices.fan}</Text>
              <IconButton
                icon="plus"
                mode="contained-tonal"
                onPress={() => adjustFan(name, 1)}
                style={styles.fanButton}
              />
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ImageBackground
      source={require("../img/background.png")}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Surface style={styles.header} elevation={2}>
              <View style={styles.headerContent}>
                <IconButton
                  icon="chevron-left"
                  size={24}
                  iconColor={colors.primary}
                />
                <Text variant="headlineMedium" style={styles.title}>Controls</Text>
                <IconButton
                  icon="dots-vertical"
                  size={24}
                  iconColor={colors.primary}
                />
              </View>
            </Surface>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'Room' && styles.tabActive]}
                onPress={() => setSelectedTab('Room')}>
                <Text style={[styles.tabText, selectedTab === 'Room' && styles.tabTextActive]}>Room</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'Devices' && styles.tabActive]}
                onPress={() => setSelectedTab('Devices')}>
                <Text style={[styles.tabText, selectedTab === 'Devices' && styles.tabTextActive]}>Devices</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.roomsContainer}>
              {Object.entries(rooms).map(([name, devices]) => (
                <RoomCard key={name} name={name} devices={devices} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  tabTextActive: {
    color: '#6200EE',
    fontWeight: '600',
  },
  roomsContainer: {
    gap: 16,
  },
  roomCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  roomImage: {
    height: 120,
  },
  roomContent: {
    padding: 16,
  },
  roomName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceCount: {
    color: '#666666',
    marginBottom: 16,
  },
  deviceControls: {
    gap: 16,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  deviceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  deviceButtonActive: {
    backgroundColor: '#EDE7F6',
  },
  deviceIcon: {
    width: 24,
    height: 24,
  },
  deviceLabel: {
    fontSize: 16,
    color: '#000000',
  },
  fanControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    gap: 16,
  },
  fanLevelControl: {
    flex: 1,
    flexDirection: 'row',
  }
});

export default Control;
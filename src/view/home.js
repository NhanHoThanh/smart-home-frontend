import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Animated,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import {  Text, IconButton, Card, Avatar } from 'react-native-paper';
import COLORS from "../../colors";



const Home = () => {
  const colors = COLORS;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [rooms, setRooms] = useState({
    'Master Bedroom': { 
      devices: [
        { type: 'ac', name: 'Air Condition', isOn: true },
        { type: 'light', name: 'Light', isOn: true },
        { type: 'fan', name: 'Fan', isOn: false },
        { type: 'tv', name: 'TV', isOn: true }
      ]
    },
    'Living Room': { 
      devices: [
        { type: 'ac', name: 'Air Condition', isOn: false },
        { type: 'light', name: 'Light', isOn: true },
        { type: 'fan', name: 'Fan', isOn: true },
        { type: 'tv', name: 'TV', isOn: false },
        { type: 'speaker', name: 'Speaker', isOn: true },
        { type: 'curtain', name: 'Curtain', isOn: false }
      ]
    },
    'Kitchen': { 
      devices: [
        { type: 'light', name: 'Light', isOn: true },
        { type: 'fan', name: 'Fan', isOn: true },
        { type: 'fridge', name: 'Refrigerator', isOn: true }
      ]
    },
    'Bathroom': { 
      devices: [
        { type: 'light', name: 'Light', isOn: false },
        { type: 'fan', name: 'Fan', isOn: false }
      ]
    }
  });

  const getDeviceIcon = (type) => {
    return require('../img/background.png');
    // switch(type) {
    //   case 'ac': return require("../img/icon/air_conditioner.png");
    //   case 'light': return require("../img/icon/light.png");
    //   case 'fan': return require("../img/icon/fan.png");
    //   case 'tv': return require("../img/icon/tv.png");
    //   case 'speaker': return require("../img/icon/speaker.png");
    //   case 'curtain': return require("../img/icon/curtain.png");
    //   case 'fridge': return require("../img/icon/fridge.png");
    //   default: return require("../img/icon/device.png");
    // }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigation = useNavigation();

  const navigateToDevice = (deviceType) => {
    if (deviceType === 'ac') {
      navigation.navigate('AirCondition');
    }
  };

  const toggleDevice = (roomName, deviceIndex) => {
    setRooms(prev => ({
      ...prev,
      [roomName]: {
        ...prev[roomName],
        devices: prev[roomName].devices.map((device, index) => 
          index === deviceIndex ? { ...device, isOn: !device.isOn } : device
        )
      }
    }))
  };
  const RoomCard = ({ name, info }) => (
    <Card style={styles.roomCard} elevation={2}>
      <Card.Content style={styles.roomContent}>
        <View style={styles.roomHeader}>
          <Text variant="titleMedium" style={styles.roomName}>{name}</Text>
          <Text variant="bodyMedium" style={styles.deviceCount}>{info.devices.length} devices</Text>
        </View>
        <View style={styles.devicesGrid}>
          {info.devices.map((device, index) => (
            <TouchableOpacity
              key={`${name}-${device.type}-${index}`}
              style={[styles.deviceButton, device.isOn && styles.deviceButtonActive]}
              onPress={() => navigateToDevice(device.type)}>
              <Image source={getDeviceIcon(device.type)} style={styles.deviceIcon} />
              <Text style={[styles.deviceName, device.isOn && styles.deviceNameActive]}>
                {device.name}
              </Text>
              <TouchableOpacity
                style={[styles.deviceStatus, device.isOn && styles.deviceStatusActive]}
                onPress={() => toggleDevice(name, index)}
              />
            </TouchableOpacity>
          ))}
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
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View style={styles.userInfo}>
                  <Text variant="headlineSmall" style={styles.greeting}>Hi, John</Text>
                  <Text variant="bodyLarge" style={styles.welcomeText}>Welcome Home</Text>
                </View>
                <Avatar.Image
                  source={require("../img/icon/avatar.png")}
                  size={48}
                  style={styles.avatar}
                />
              </View>
            </View>

            <Card style={styles.locationCard} elevation={2}>
              <Card.Content style={styles.locationContent}>
                <View>
                  <Text variant="titleMedium" style={styles.locationTitle}>My Location</Text>
                  <Text variant="bodyMedium" style={styles.locationSubtitle}>Montreal</Text>
                  <Text variant="displaySmall" style={styles.temperature}>-10°</Text>
                  <Text variant="bodyMedium" style={styles.weatherDesc}>Partly Cloudy</Text>
                </View>
                <View style={styles.weatherIconContainer}>
                  <IconButton
                    icon="weather-partly-cloudy"
                    size={48}
                    iconColor={colors.primary}
                  />
                </View>
              </Card.Content>
            </Card>

            <Text variant="titleLarge" style={styles.sectionTitle}>My Rooms</Text>

            <View style={styles.roomsContainer}>
              {Object.entries(rooms).map(([name, info]) => (
                <RoomCard
                  key={name}
                  name={name}
                  info={info}
                />
              ))}
            </View>
          </Animated.View>
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    color: '#000000',
    marginBottom: 4,
  },
  welcomeText: {
    color: '#666666',
  },
  avatar: {
    backgroundColor: '#F5F5F5',
  },
  locationCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#6200EE',
  },
  locationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  locationTitle: {
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  locationSubtitle: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  temperature: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '600',
    marginBottom: 4,
  },
  weatherDesc: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  weatherIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  roomsContainer: {
    gap: 16,
  },
  roomCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roomContent: {
    padding: 16,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  roomName: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 18,
  },
  deviceCount: {
    color: '#666666',
    fontSize: 14,
  },
  devicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 8,
  },
  deviceButton: {
    width: (width - 80) / 3,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  deviceButtonActive: {
    backgroundColor: '#EDE7F6',
  },
  deviceIcon: {
    width: 28,
    height: 28,
    marginBottom: 8,
    tintColor: '#666666',
  },
  deviceName: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '500',
  },
  deviceNameActive: {
    color: '#6200EE',
  },
  deviceStatus: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666666',
  },
  deviceStatusActive: {
    backgroundColor: '#6200EE',
  },
});

export default Home;

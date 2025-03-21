import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from "react-native";
import COLORS from "../../colors";
import React, { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  // Temporary values without backend
  const [temp, setTemp] = useState(28);
  const [humid, setHumidity] = useState(65);
  const [lux, setLux] = useState(800);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [isEnabled3, setIsEnabled3] = useState(false);
  const [fan_level, setLevel] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Simulate sensor updates
    const interval = setInterval(() => {
      setTemp(prev => prev + (Math.random() - 0.5));
      setHumidity(prev => Math.max(30, Math.min(90, prev + (Math.random() - 0.5) * 2)));
      setLux(prev => Math.max(100, Math.min(1500, prev + (Math.random() - 0.5) * 50)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleSwitch1 = () => setIsEnabled1(prev => !prev);
  const toggleSwitch2 = () => setIsEnabled2(prev => !prev);
  const toggleSwitch3 = () => setIsEnabled3(prev => !prev);

  const increaseLevel = () => setLevel(prev => Math.min(3, prev + 1));
  const decreaseLevel = () => setLevel(prev => Math.max(0, prev - 1));

  const SensorCard = ({ icon, value, unit, status }) => (
    <View style={styles.sensorCard}>
      <Image source={icon} style={styles.sensorIcon} />
      <View style={styles.sensorInfo}>
        <Text style={styles.sensorValue}>{Math.round(value)}</Text>
        <Text style={styles.sensorUnit}>{unit}</Text>
      </View>
      <View style={[styles.statusDot, { backgroundColor: status ? COLORS.success : COLORS.error }]} />
    </View>
  );

  const ControlCard = ({ icon, title, value, onToggle }) => (
    <View style={styles.controlCard}>
      <Image source={icon} style={styles.controlIcon} />
      <Text style={styles.controlTitle}>{title}</Text>
      <Switch
        trackColor={{ false: COLORS.grey[200], true: COLORS.primary }}
        thumbColor={COLORS.white}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <ImageBackground
      source={require("../img/background.png")}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => navigation.popToTop()}>
              <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.welcomeSection}>
            <Image
              source={require("../img/icon/avatar.png")}
              style={styles.avatar}
            />
            <Text style={styles.welcomeText}>Welcome back!</Text>
          </View>

          <View style={styles.sensorsSection}>
            <Text style={styles.sectionTitle}>Sensors</Text>
            <View style={styles.sensorGrid}>
              <SensorCard
                icon={require("../img/icon/temparature.png")}
                value={temp}
                unit="°C"
                status={temp <= 30}
              />
              <SensorCard
                icon={require("../img/icon/humidity.png")}
                value={humid}
                unit="%"
                status={humid <= 80}
              />
              <SensorCard
                icon={require("../img/icon/lux.png")}
                value={lux}
                unit="lux"
                status={lux <= 1000}
              />
            </View>
          </View>

          <View style={styles.controlsSection}>
            <Text style={styles.sectionTitle}>Controls</Text>
            <View style={styles.controlGrid}>
              <ControlCard
                icon={require("../img/icon/light.png")}
                title="Light"
                value={isEnabled1}
                onToggle={toggleSwitch1}
              />
              <ControlCard
                icon={require("../img/icon/air_conditioner.png")}
                title="AC"
                value={isEnabled2}
                onToggle={toggleSwitch2}
              />
            </View>

            <View style={styles.fanControl}>
              <Image
                source={require("../img/icon/fan.png")}
                style={styles.fanIcon}
              />
              <Text style={styles.fanTitle}>Fan Speed</Text>
              <View style={styles.fanLevelControl}>
                <TouchableOpacity onPress={decreaseLevel} style={styles.fanButton}>
                  <Ionicons name="remove" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.fanLevel}>{fan_level}</Text>
                <TouchableOpacity onPress={increaseLevel} style={styles.fanButton}>
                  <Ionicons name="add" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  welcomeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 15,
  },
  sensorsSection: {
    marginBottom: 30,
  },
  sensorGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sensorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    width: "30%",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  sensorInfo: {
    alignItems: "center",
  },
  sensorValue: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  sensorUnit: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: 10,
    right: 10,
  },
  controlsSection: {
    flex: 1,
  },
  controlGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  controlCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    width: "47%",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  controlTitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 10,
  },
  fanControl: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fanIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  fanTitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 15,
  },
  fanLevelControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  fanButton: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 20,
  },
  fanLevel: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text.primary,
    width: 40,
    textAlign: "center",
  },
});

export default Home;

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';
import COLORS from '../../../colors';

const AirCondition = () => {
  const [temperature, setTemperature] = useState(24);
  const [humidity] = useState(62);
  const [mode, setMode] = useState('Cool');
  const [timer, setTimer] = useState({ hours: 0, minutes: 10 });
  const [fanSpeed, setFanSpeed] = useState(1);
  const [isOn, setIsOn] = useState(true);

  const adjustTemperature = (increment) => {
    setTemperature(prev => Math.max(16, Math.min(30, prev + increment)));
  };

  const getRotationDegrees = () => {
    // Map temperature range (16-30) to degrees (0-280)
    return ((temperature - 16) / (30 - 16)) * 280;
  };

  return (
    <ImageBackground
      source={require('../../img/background.png')}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Surface style={styles.header} elevation={2}>
          <View style={styles.headerContent}>
            <IconButton
              icon="chevron-left"
              size={24}
              iconColor={COLORS.primary}
            />
            <Text variant="headlineMedium" style={styles.title}>Air Condition</Text>
            <IconButton
              icon="dots-vertical"
              size={24}
              iconColor={COLORS.primary}
            />
          </View>
        </Surface>

        <View style={styles.content}>
          <View style={styles.powerSwitch}>
            <TouchableOpacity
              onPress={() => setIsOn(!isOn)}
              style={[styles.switch, isOn && styles.switchActive]}
            />
          </View>

          <View style={styles.temperatureControl}>
            <View style={styles.temperatureRing}>
              <View style={[styles.temperatureIndicator, { transform: [{ rotate: `${getRotationDegrees()}deg` }] }]} />
              <View style={styles.temperatureDisplay}>
                <Text style={styles.humidityText}>{humidity}%</Text>
                <Text style={styles.temperatureText}>{temperature}°C</Text>
              </View>
            </View>

            <View style={styles.temperatureButtons}>
              <TouchableOpacity
                style={styles.tempButton}
                onPress={() => adjustTemperature(-1)}>
                <Text style={styles.tempButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tempButton}
                onPress={() => adjustTemperature(1)}>
                <Text style={styles.tempButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modeContainer}>
            {['Cool', 'Hot', 'Auto'].map((modeOption) => (
              <TouchableOpacity
                key={modeOption}
                style={[styles.modeButton, mode === modeOption && styles.modeButtonActive]}
                onPress={() => setMode(modeOption)}>
                <Text style={[styles.modeText, mode === modeOption && styles.modeTextActive]}>{modeOption}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.label}>Timer</Text>
            <View style={styles.timerControl}>
              <Text style={styles.timerText}>
                {String(timer.hours).padStart(2, '0')}:{String(timer.minutes).padStart(2, '0')}
              </Text>
            </View>
          </View>

          <View style={styles.fanSpeedContainer}>
            <Text style={styles.label}>Fan speed</Text>
            <View style={styles.fanSpeedControl}>
              <Text style={styles.fanSpeedText}>{fanSpeed}</Text>
            </View>
          </View>
        </View>
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
  header: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  powerSwitch: {
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 20,
  },
  switch: {
    width: 40,
    height: 20,
    backgroundColor: '#D1D1D1',
    borderRadius: 10,
  },
  switchActive: {
    backgroundColor: COLORS.primary,
  },
  temperatureControl: {
    alignItems: 'center',
    marginBottom: 40,
  },
  temperatureRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 20,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  temperatureIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    top: 0,
    left: '50%',
    marginLeft: -10,
    transform: [{ translateY: -10 }],
  },
  temperatureDisplay: {
    alignItems: 'center',
  },
  humidityText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
  },
  temperatureButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  tempButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempButtonText: {
    fontSize: 24,
    color: '#666666',
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeText: {
    color: '#666666',
    fontSize: 16,
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  timerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  timerControl: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
  },
  timerText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  fanSpeedContainer: {
    width: '100%',
  },
  fanSpeedControl: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
  },
  fanSpeedText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
});

export default AirCondition;
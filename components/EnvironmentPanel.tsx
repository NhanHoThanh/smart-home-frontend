import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Thermometer, Droplets, Sun } from 'lucide-react-native';

export default function EnvironmentPanel() {
  const { environmentData, updateEnvironmentData } = useSmartHomeStore();

  // Simulate changing environment data
  useEffect(() => {
    const interval = setInterval(() => {
      updateEnvironmentData({
        temperature: Math.round((environmentData.temperature + (Math.random() * 0.4 - 0.2)) * 10) / 10,
        humidity: Math.min(100, Math.max(0, Math.round(environmentData.humidity + (Math.random() * 2 - 1)))),
        lightLevel: Math.min(100, Math.max(0, Math.round(environmentData.lightLevel + (Math.random() * 3 - 1.5)))),
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [environmentData]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.environmentItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
              <Thermometer size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.value}>{environmentData.temperature}°C</Text>
              <Text style={styles.label}>Normal</Text>
            </View>
          </View>
          
          <View style={styles.environmentItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.secondary}20` }]}>
              <Droplets size={20} color={colors.secondary} />
            </View>
            <View>
              <Text style={styles.value}>{environmentData.humidity}%</Text>
              <Text style={styles.label}>Good</Text>
            </View>
          </View>

          <View style={styles.environmentItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFC10720' }]}>
              <Sun size={20} color="#FFC107" />
            </View>
            <View>
              <Text style={styles.value}>{environmentData.lightLevel}%</Text>
              <Text style={styles.label}>Bright</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  environmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

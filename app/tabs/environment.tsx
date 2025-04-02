import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Thermometer, Droplets, Sun, Wind } from 'lucide-react-native';
import LineChart from '@/components/LineChart';

export default function EnvironmentScreen() {
  const { environmentData } = useSmartHomeStore();

  // Mock data for charts
  const temperatureData = [22.5, 22.8, 23.1, 23.4, 23.5, 23.3, 23.2, 23.0, 22.9, 23.1, 23.3, 23.5];
  const humidityData = [42, 43, 45, 46, 45, 44, 43, 45, 46, 47, 45, 45];
  const lightData = [65, 68, 70, 72, 75, 78, 80, 82, 80, 75, 70, 68];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Environment</Text>
          <Text style={styles.subtitle}>Monitor your home environment</Text>
        </View>

        <View style={styles.currentContainer}>
          <Text style={styles.sectionTitle}>Current Readings</Text>
          <View style={styles.currentCard}>
            <View style={styles.currentItem}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <Thermometer size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.currentValue}>{environmentData.temperature}°C</Text>
                <Text style={styles.currentLabel}>Temperature</Text>
              </View>
            </View>

            <View style={styles.currentItem}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.secondary}20` }]}>
                <Droplets size={24} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.currentValue}>{environmentData.humidity}%</Text>
                <Text style={styles.currentLabel}>Humidity</Text>
              </View>
            </View>

            <View style={styles.currentItem}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFC10720' }]}>
                <Sun size={24} color="#FFC107" />
              </View>
              <View>
                <Text style={styles.currentValue}>{environmentData.lightLevel}%</Text>
                <Text style={styles.currentLabel}>Light Level</Text>
              </View>
            </View>

            <View style={styles.currentItem}>
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF5020' }]}>
                <Wind size={24} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.currentValue}>{environmentData.airQuality}</Text>
                <Text style={styles.currentLabel}>Air Quality</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Temperature (Last 12 Hours)</Text>
          <View style={styles.chartCard}>
            <LineChart 
              data={temperatureData} 
              color={colors.primary}
              unit="°C"
            />
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Humidity (Last 12 Hours)</Text>
          <View style={styles.chartCard}>
            <LineChart 
              data={humidityData} 
              color={colors.secondary}
              unit="%"
            />
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Light Level (Last 12 Hours)</Text>
          <View style={styles.chartCard}>
            <LineChart 
              data={lightData} 
              color="#FFC107"
              unit="%"
            />
          </View>
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
  currentContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  currentCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  currentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chartContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  chartCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

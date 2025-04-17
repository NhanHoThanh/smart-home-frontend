import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Thermometer, Droplets, Sun } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function EnvironmentHistory() {
  const { historicalEnvironmentData, fetchHistoricalEnvironmentData, isBackgroundLoading, error } = useSmartHomeStore();

  useEffect(() => {
    // Fetch historical data when component mounts
    fetchHistoricalEnvironmentData();
  }, [fetchHistoricalEnvironmentData]);

  if (isBackgroundLoading && !historicalEnvironmentData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!historicalEnvironmentData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No historical data available</Text>
      </View>
    );
  }

  // Prepare data for charts
  const temperatureData = {
    labels: historicalEnvironmentData.temperature.map(item => item.created_at.split(' ')[1]),
    datasets: [
      {
        data: historicalEnvironmentData.temperature.map(item => parseFloat(item.value)),
        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const humidityData = {
    labels: historicalEnvironmentData.humidity.map(item => item.created_at.split(' ')[1]),
    datasets: [
      {
        data: historicalEnvironmentData.humidity.map(item => parseFloat(item.value)),
        color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const lightLevelData = {
    labels: historicalEnvironmentData.lightLevel.map(item => item.created_at.split(' ')[1]),
    datasets: [
      {
        data: historicalEnvironmentData.lightLevel.map(item => parseFloat(item.value)),
        color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: colors.cardBackground,
    backgroundGradientTo: colors.cardBackground,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 1,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const screenWidth = Dimensions.get('window').width - 32; // Account for padding

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Environment History</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Thermometer size={20} color={colors.primary} />
            <Text style={styles.chartTitle}>Temperature</Text>
          </View>
          <LineChart
            data={temperatureData}
            width={screenWidth}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Droplets size={20} color={colors.secondary} />
            <Text style={styles.chartTitle}>Humidity</Text>
          </View>
          <LineChart
            data={humidityData}
            width={screenWidth}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Sun size={20} color="#FFC107" />
            <Text style={styles.chartTitle}>Light Level</Text>
          </View>
          <LineChart
            data={lightLevelData}
            width={screenWidth}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  scrollView: {
    maxHeight: 600,
  },
  chartContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.text,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
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
    color: colors.error,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
}); 
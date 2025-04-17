import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Thermometer, Droplets, Sun, Wind } from 'lucide-react-native';
import LineChart from '@/components/LineChart';

export default function EnvironmentScreen() {
  const { 
    environmentData, 
    historicalEnvironmentData,
    fetchEnvironmentData,
    fetchHistoricalEnvironmentData,
    isLoading,
    error 
  } = useSmartHomeStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchEnvironmentData();
    fetchHistoricalEnvironmentData();
  }, [fetchEnvironmentData, fetchHistoricalEnvironmentData]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchEnvironmentData(),
      fetchHistoricalEnvironmentData()
    ]);
    setRefreshing(false);
  }, [fetchEnvironmentData, fetchHistoricalEnvironmentData]);

  const formatChartData = (data: { created_at: string; value: string }[] | undefined) => {
    if (!data) return [];
    return data.map(item => parseFloat(item.value));
  };

  if (isLoading && !historicalEnvironmentData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading environment data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={onRefresh}>Tap to retry</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              data={formatChartData(historicalEnvironmentData?.temperature)} 
              color={colors.primary}
              unit="°C"
            />
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Humidity (Last 12 Hours)</Text>
          <View style={styles.chartCard}>
            <LineChart 
              data={formatChartData(historicalEnvironmentData?.humidity)} 
              color={colors.secondary}
              unit="%"
            />
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Light Level (Last 12 Hours)</Text>
          <View style={styles.chartCard}>
            <LineChart 
              data={formatChartData(historicalEnvironmentData?.lightLevel)} 
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

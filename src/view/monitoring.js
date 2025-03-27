import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { Surface, Text, Card, IconButton, ProgressBar } from 'react-native-paper';
import COLORS from "../../colors";
import SensorGraph from "./SensorGraph";

const Monitoring = () => {
  const colors = COLORS;
  
  const SensorCard = ({ icon, value, unit, status, progress }) => (
    <Card style={styles.sensorCard} elevation={2}>
      <Card.Content style={styles.sensorCardContent}>
        <View style={styles.sensorHeader}>
          <Image source={icon} style={styles.sensorIcon} />
          <View style={[styles.statusDot, { backgroundColor: status ? colors.success : colors.error }]} />
        </View>
        <View style={styles.sensorInfo}>
          <Text variant="displaySmall" style={[styles.sensorValue, { color: colors.primary }]}>{Math.round(value)}</Text>
          <Text variant="titleMedium" style={styles.sensorUnit}>{unit}</Text>
        </View>
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color={colors.primary}
            style={styles.progressBar}
          />
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
                <Text variant="headlineMedium" style={styles.title}>Monitoring</Text>
                <IconButton
                  icon="dots-vertical"
                  size={24}
                  iconColor={colors.primary}
                />
              </View>
            </Surface>

            <View style={styles.sensorsSection}>
              <Text variant="titleLarge" style={styles.sectionTitle}>Sensors</Text>
              <View style={styles.sensorGrid}>
                <SensorCard
                  icon={require("../img/icon/temparature.png")}
                  value={28}
                  unit="°C"
                  status={true}
                  progress={0.7}
                />
                <SensorCard
                  icon={require("../img/icon/humidity.png")}
                  value={65}
                  unit="%"
                  status={true}
                  progress={0.65}
                />
                <SensorCard
                  icon={require("../img/icon/lux.png")}
                  value={800}
                  unit="lux"
                  status={true}
                  progress={0.8}
                />
              </View>
              
              <View style={styles.graphsContainer}>
                <SensorGraph
                  data={{
                    values: [28, 27.5, 28.2, 28.5, 27.8],
                    labels: ['12:00', '12:05', '12:10', '12:15', '12:20']
                  }}
                  color="#F44336"
                />
                <SensorGraph
                  data={{
                    values: [65, 66, 64, 65, 67],
                    labels: ['12:00', '12:05', '12:10', '12:15', '12:20']
                  }}
                  color="#6200EE"
                />
                <SensorGraph
                  data={{
                    values: [800, 850, 820, 780, 810],
                    labels: ['12:00', '12:05', '12:10', '12:15', '12:20']
                  }}
                  color="#4CAF50"
                />
              </View>
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
  sensorsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sensorCard: {
    width: width * 0.28,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  sensorCardContent: {
    padding: 16,
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sensorIcon: {
    width: 24,
    height: 24,
  },
  sensorInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  sensorUnit: {
    color: '#666666',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  graphsContainer: {
    gap: 16,
  },
});

export default Monitoring;
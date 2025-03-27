import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import COLORS from '../../colors';

const SensorGraph = ({ data, title, color }) => {
  const colors  = COLORS;
  const screenWidth = Dimensions.get('window').width - 70; // Account for container padding, margins and rounded corners

  const chartConfig = {
    backgroundGradientFrom: colors.dark,
    backgroundGradientTo: colors.dark,
    decimalPlaces: 1,
    color: (opacity = 1) => color || colors.primary,
    labelColor: (opacity = 1) => colors.text.primary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '3', // Slightly smaller dots
      strokeWidth: '2',
      stroke: color || colors.primary,
    },
  };

  // Ensure we only show the last 5 data points
  const visibleDataPoints = 5;
  const values = data.values.slice(-visibleDataPoints);
  const labels = data.labels.slice(-visibleDataPoints);

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: values,
              color: (opacity = 1) => color || colors.primary,
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth}
        height={200} // Slightly reduced height
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default SensorGraph;
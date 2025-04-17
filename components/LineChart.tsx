import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import colors from '@/constants/colors';

interface LineChartProps {
  data: number[];
  color: string;
  unit: string;
}

export default function LineChart({ data, color, unit }: LineChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  // Calculate chart dimensions
  const chartWidth = Dimensions.get('window').width - 64; // Accounting for padding
  const chartHeight = 150;
  const barWidth = chartWidth / data.length - 4;
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{max.toFixed(1)}{unit}</Text>
          <Text style={styles.axisLabel}>{((max + min) / 2).toFixed(1)}{unit}</Text>
          <Text style={styles.axisLabel}>{min.toFixed(1)}{unit}</Text>
        </View>
        
        <View style={styles.chart}>
          {data.map((value, index) => {
            const height = ((value - min) / range) * chartHeight;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height, 
                      backgroundColor: color,
                      width: barWidth,
                    }
                  ]} 
                />
                <View style={styles.dataPoint} />
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={styles.xAxis}>
        {data.map((_, index) => {
          // Only show every other hour label to avoid crowding
          if (index % 2 !== 0 && index !== data.length - 1) return null;
          
          const hour = new Date();
          hour.setHours(hour.getHours() - (data.length - 1 - index));
          
          return (
            <Text key={index} style={styles.hourLabel}>
              {hour.getHours()}:00
            </Text>
          );
        })}
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>
            {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)}{unit} 
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statValue}>{min.toFixed(1)}{unit}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{max.toFixed(1)}{unit}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
  },
  yAxis: {
    width: 40,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  axisLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  barContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  dataPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'absolute',
    bottom: -3,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40,
    marginTop: 8,
  },
  hourLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
}); 
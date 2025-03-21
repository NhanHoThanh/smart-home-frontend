import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Animated,
} from "react-native";
import COLORS from "../../colors";
import React, { useEffect, useState, useRef } from "react";

const Notification = () => {
  const [activities, setActivities] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Generate temporary data
    const tempData = [
      {
        id: '1',
        actor: 'System',
        act: 'turned on the AC',
        time: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: '2',
        actor: 'User',
        act: 'adjusted fan speed to level 2',
        time: new Date(Date.now() - 1000 * 60 * 10)
      },
      {
        id: '3',
        actor: 'System',
        act: 'detected high temperature (31°C)',
        time: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        id: '4',
        actor: 'User',
        act: 'turned off all lights',
        time: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: '5',
        actor: 'System',
        act: 'started night mode',
        time: new Date(Date.now() - 1000 * 60 * 45)
      }
    ];

    setActivities(tempData);

    // Simulate new activities
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now().toString(),
        actor: Math.random() > 0.5 ? 'System' : 'User',
        act: Math.random() > 0.5 ? 'adjusted temperature' : 'changed light settings',
        time: new Date()
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => (
    <Animated.View style={[styles.item, { opacity: fadeAnim }]}>
      <View style={styles.activityHeader}>
        <Text style={styles.actorText}>{item.actor}</Text>
        <Text style={styles.timeText}>
          {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Text style={styles.actionText}>{item.act}</Text>
      <Text style={styles.dateText}>
        {item.time.toLocaleDateString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </Text>
    </Animated.View>
  );

  return (
    <ImageBackground
      source={require("../img/background.png")}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Activity Log</Text>
        </View>

        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
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
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey[200],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
  },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actorText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  actionText: {
    fontSize: 15,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.text.tertiary,
  },
  separator: {
    height: 12,
  },
});

export default Notification;

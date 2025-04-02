import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import colors from '@/constants/colors';
import { Home, Settings, BarChart3, Camera, Bot } from 'lucide-react-native';
import AIAssistant from '@/components/AIAssistant';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cameras"
        options={{
          title: "Cameras",
          tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: "",
          tabBarButton: () => (
            <View style={styles.assistantContainer}>
              <AIAssistant />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="environment"
        options={{
          title: "Environment",
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
  },
  header: {
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.text,
    fontWeight: '600',
  },
  assistantContainer: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
  },
});

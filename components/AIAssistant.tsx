import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Bot, X, Clock } from 'lucide-react-native';
import { aiAssistantResponses } from '@/constants/mockData';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

export default function AIAssistant() {
  const { 
    aiAssistant, 
    startListening, 
    stopListening, 
    addCommandToHistory,
    toggleDevice,
    devices
  } = useSmartHomeStore();
  
  const router = useRouter();
  const [animating, setAnimating] = useState(false);
  const [pulseSize, setPulseSize] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aiAssistant.isListening) {
      interval = setInterval(() => {
        setPulseSize((prev) => (prev === 1 ? 1.2 : 1));
      }, 500);
    } else {
      setPulseSize(1);
    }
    return () => clearInterval(interval);
  }, [aiAssistant.isListening]);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    router.push('/assistant');
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        aiAssistant.isListening && styles.buttonActive,
        { transform: [{ scale: pulseSize }] }
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Bot 
        size={24} 
        color={aiAssistant.isListening ? colors.cardBackground : colors.primary} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
});

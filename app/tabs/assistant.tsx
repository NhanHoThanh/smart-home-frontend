import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Animated
} from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Mic, Send, Trash2, Bot } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function AssistantScreen() {
  const { 
    aiAssistant, 
    startListening, 
    stopListening, 
    clearCommandHistory, 
    addCommandToHistory,
    devices,
    toggleDevice,
    updateDeviceTemperature
  } = useSmartHomeStore();
  
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef<ScrollView>(null);

  // Start pulse animation when listening
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;
    
    if (isListening) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      
      pulseAnimation.start();
    } else {
      pulseAnim.setValue(1);
    }
    
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isListening, pulseAnim]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSend = () => {
    if (message.trim() === '') return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    processUserInput(message);
    setMessage('');
  };
  
  const handleMicPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setIsListening(true);
    
    // Simulate voice recognition after 2 seconds
    setTimeout(() => {
      setIsListening(false);
      
      // Generate a random natural language command
      const naturalCommands = [
        "I'm feeling cold",
        "It's too dark in here",
        "I'm going to bed",
        "Turn everything off",
        "I need more light in the kitchen"
      ];
      
      const randomCommand = naturalCommands[Math.floor(Math.random() * naturalCommands.length)];
      processUserInput(randomCommand);
    }, 2000);
  };
  
  const processUserInput = (input: string) => {
    // Process natural language input
    let response = '';
    
    // Cold/temperature related
    if (input.toLowerCase().includes('cold') || input.toLowerCase().includes('chilly')) {
      const climateDevices = devices.filter(d => d.type === 'climate');
      if (climateDevices.length > 0) {
        const device = climateDevices[0];
        if (device.temperature) {
          const newTemp = device.temperature + 2;
          updateDeviceTemperature(device.id, newTemp);
          response = `I've increased the temperature in the ${getRoomName(device.roomId)} to ${newTemp}°C.`;
        }
      } else {
        response = "I couldn't find any climate control devices to adjust.";
      }
    }
    // Light related
    else if (input.toLowerCase().includes('dark') || input.toLowerCase().includes('light')) {
      const lightDevices = devices.filter(d => d.type === 'light' && !d.status);
      if (lightDevices.length > 0) {
        lightDevices.slice(0, 2).forEach(device => toggleDevice(device.id));
        response = `I've turned on the lights in the ${getRoomName(lightDevices[0].roomId)}.`;
      } else {
        response = "All lights are already on.";
      }
    }
    // Bedtime related
    else if (input.toLowerCase().includes('bed') || input.toLowerCase().includes('sleep')) {
      const bedroomLights = devices.filter(d => 
        d.type === 'light' && 
        d.status && 
        getRoomName(d.roomId).toLowerCase().includes('bed')
      );
      
      if (bedroomLights.length > 0) {
        bedroomLights.forEach(device => toggleDevice(device.id));
        response = "I've turned off the bedroom lights and set the temperature for optimal sleeping.";
      } else {
        response = "I've set your home to night mode. Sleep well!";
      }
    }
    // Turn everything off
    else if (input.toLowerCase().includes('everything off') || input.toLowerCase().includes('turn all')) {
      const onDevices = devices.filter(d => d.status);
      onDevices.forEach(device => toggleDevice(device.id));
      response = `I've turned off all ${onDevices.length} active devices.`;
    }
    // Default response
    else {
      const responses = [
        "I've adjusted your home settings based on your request.",
        "I've taken care of that for you.",
        "Your smart home has been updated according to your preferences.",
        "I've made the changes you requested.",
        "Consider it done!"
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    addCommandToHistory(input, response);
    
    // Scroll to bottom after adding new message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  const getRoomName = (roomId: string) => {
    const rooms = {
      '1': 'Living Room',
      '2': 'Kitchen',
      '3': 'Bedroom',
      '4': 'Bathroom',
      '5': 'Office'
    };
    return (rooms as any)[roomId] || 'Home';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        {aiAssistant.commandHistory.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearCommandHistory}
          >
            <Trash2 size={20} color={colors.error} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={styles.chatContainer}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeMessage}>
          <View style={styles.botIconContainer}>
            <Bot size={24} color={colors.primary} />
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Hello! I'm your Smart Home Assistant</Text>
            <Text style={styles.welcomeSubtitle}>
              Ask me to control your devices or tell me how you feel, and I'll take care of the rest.
            </Text>
          </View>
        </View>
        
        {aiAssistant.commandHistory.map((item, index) => (
          <View key={index} style={styles.messageGroup}>
            <View style={styles.userMessage}>
              <Text style={styles.userMessageText}>{item.command}</Text>
              <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
            </View>
            <View style={styles.botMessage}>
              <View style={styles.botMessageContent}>
                <View style={styles.botAvatar}>
                  <Bot size={16} color={colors.primary} />
                </View>
                <Text style={styles.botMessageText}>{item.response}</Text>
              </View>
              <Text style={styles.messageTime}>{formatTime(item.timestamp + 1000)}</Text>
            </View>
          </View>
        ))}
        
        {aiAssistant.commandHistory.length === 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Try saying or typing:</Text>
            {[
              "I'm feeling cold",
              "Turn on the lights in the living room",
              "I'm going to bed",
              "Turn everything off"
            ].map((suggestion, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.suggestionBubble}
                onPress={() => processUserInput(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          
          {message.length > 0 ? (
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSend}
            >
              <Send size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={[styles.micButton, isListening && styles.micButtonActive]}
                onPress={handleMicPress}
              >
                <Mic size={20} color={isListening ? colors.cardBackground : colors.primary} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    marginLeft: 4,
    color: colors.error,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeMessage: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
  },
  botIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  messageGroup: {
    marginBottom: 24,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  botMessage: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  botMessageContent: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  botMessageText: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  suggestionsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  suggestionBubble: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    color: colors.primary,
    fontSize: 14,
  },
  spacer: {
    height: 100,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    backgroundColor: colors.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: colors.primary,
  },
});

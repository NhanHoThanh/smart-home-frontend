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
  Animated,
  Modal
} from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Mic, Send, Trash2, Bot } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import api from '@/services/api';

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
  const [pulseAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef<ScrollView>(null);
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Start pulse animation when listening
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;
    
    if (aiAssistant.isListening) {
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
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }
    }
    
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }
    };
  }, [aiAssistant.isListening, pulseAnim]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSend = async () => {
    if (message.trim() === '') return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    await processUserInput(message);
    setMessage('');
  };
  
  const handleMicPress = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (!aiAssistant.isListening) {
      startListening();

      try {
        // Get voice transcript from API
        const response = await api.get('/voices/transcript');
        const transcript = response.data;

        if (transcript) {
          // Process the transcript
          await processUserInput(transcript.message);
        }
      } catch (error) {
        console.error('Error getting transcript:', error);
        addCommandToHistory(
          "Voice command",
          "Sorry, I couldn't understand that. Please try again."
        );
      } finally {
        stopListening();
      }
    }
  };
  
  const processUserInput = async (input: string) => {
    try {
      // Send command to voice logic API with correct request format
      const response = await api.post('/voices/voice_logic', {
        request: input  // Đúng format mà backend yêu cầu
      });

      // Add the interaction to history
      let responseText;
      if (typeof response.data === 'string') {
        responseText = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Backend trả về HistoryPublic model
        responseText = response.data.response || JSON.stringify(response.data);
      } else {
        responseText = JSON.stringify(response.data);
      }

      addCommandToHistory(input, responseText);

      // Scroll to bottom after adding new message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      // Xử lý lỗi từ backend
      let errorMsg = "Sorry, I couldn't process that command. Please try again.";
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            errorMsg = data.detail[0].msg;
          } else {
            errorMsg = data.detail;
          }
        }
      }
      addCommandToHistory(input, errorMsg);
      console.error('Error processing command:', error);
    }
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
    <>
      <Modal
        visible={aiAssistant.isListening}
        animationType="fade"
        transparent
        onRequestClose={() => stopListening()}
      >
        <TouchableOpacity
          style={styles.geminiOverlay}
          activeOpacity={1}
          onPressOut={() => stopListening()}
        >
          <TouchableOpacity style={styles.geminiBox} activeOpacity={1}>
            <Text style={styles.geminiText}>Listening...</Text>
            <Animated.View style={{ transform: [{ scale: aiAssistant.isListening ? pulseAnim : 1 }] }}>
              <View style={styles.micButton2}>
                <Bot size={24} color="#fff" />
              </View>
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
                  <Text style={styles.botMessageText}>
                    {typeof item.response === 'string' ? item.response : JSON.stringify(item.response)}
                  </Text>
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
              <Animated.View style={{ transform: [{ scale: aiAssistant.isListening ? pulseAnim : 1 }] }}>
                <TouchableOpacity 
                  style={[
                    styles.micButton,
                    aiAssistant.isListening && styles.micButtonActive
                  ]}
                  onPress={handleMicPress}
                >
                  <Mic 
                    size={20}
                    color={aiAssistant.isListening ? colors.cardBackground : colors.primary}
                  />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
  geminiOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  geminiBox: {
    width: '92%',
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#1c1c1e',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 12,
  },
  geminiText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
  },
  micButton2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
});

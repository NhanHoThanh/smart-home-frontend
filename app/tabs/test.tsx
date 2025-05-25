import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import api from '@/services/api';
import FaceRecognitionTest from '@/components/FaceRecognitionTest';

export default function TestScreen() {
  const { 
    devices, 
    rooms, 
    environmentData, 
    historicalEnvironmentData,
    fetchRooms,
    fetchDevices,
    fetchEnvironmentData,
    fetchHistoricalEnvironmentData,
    toggleDevice,
    updateDeviceBrightness,
    updateDeviceTemperature,
    isLoading 
  } = useSmartHomeStore();

  const [customEndpoint, setCustomEndpoint] = useState('');
  const [customMethod, setCustomMethod] = useState('GET');
  const [customBody, setCustomBody] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [showFaceRecognitionTest, setShowFaceRecognitionTest] = useState(false);

  const testEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    setTestLoading(true);
    setTestResult(null);
    
    try {
      let response;
      const config = {
        url: endpoint,
        method: method.toLowerCase(),
        ...(body && { data: body })
      };
      
      response = await api.request(config);
      setTestResult({
        success: true,
        status: response.status,
        data: response.data,
        headers: response.headers
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        status: error.response?.status || 'Network Error',
        data: error.response?.data || error.message,
        error: error.message
      });
    } finally {
      setTestLoading(false);
    }
  };

  const testCustomEndpoint = async () => {
    if (!customEndpoint.trim()) {
      Alert.alert('Error', 'Please enter an endpoint');
      return;
    }

    let body = null;
    if (customBody.trim()) {
      try {
        body = JSON.parse(customBody);
      } catch (error) {
        Alert.alert('Error', 'Invalid JSON in request body');
        return;
      }
    }

    await testEndpoint(customEndpoint, customMethod, body);
  };

  const predefinedTests = [
    {
      name: 'Get Rooms',
      endpoint: 'rooms',
      method: 'GET',
      action: () => testEndpoint('rooms')
    },
    {
      name: 'Get Devices',
      endpoint: 'devices',
      method: 'GET',
      action: () => testEndpoint('devices')
    },
    {
      name: 'Get Environment Data',
      endpoint: 'environment',
      method: 'GET',
      action: () => testEndpoint('environment')
    },
    {
      name: 'Get Historical Environment',
      endpoint: 'environment/history',
      method: 'GET',
      action: () => testEndpoint('environment/history')
    },
    {
      name: 'Test Health Check',
      endpoint: 'health',
      method: 'GET',
      action: () => testEndpoint('health')
    }
  ];

  const storeTests = [
    {
      name: 'Fetch Rooms (Store)',
      action: fetchRooms
    },
    {
      name: 'Fetch Devices (Store)',
      action: () => fetchDevices()
    },
    {
      name: 'Fetch Environment (Store)',
      action: fetchEnvironmentData
    },
    {
      name: 'Fetch Historical (Store)',
      action: fetchHistoricalEnvironmentData
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {showFaceRecognitionTest ? (
        <View style={styles.fullScreenTest}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setShowFaceRecognitionTest(false)}
          >
            <Text style={styles.backButtonText}>← Back to API Tests</Text>
          </TouchableOpacity>
          <FaceRecognitionTest />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>API Test</Text>
            <Text style={styles.subtitle}>Test API endpoints and store actions</Text>
          </View>

          {/* Face Recognition Test */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Face Recognition Test</Text>
            <TouchableOpacity 
              style={styles.faceRecognitionButton} 
              onPress={() => setShowFaceRecognitionTest(true)}
            >
              <Text style={styles.buttonText}>Test Face Recognition System</Text>
            </TouchableOpacity>
          </View>

          {/* Store State Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Store State</Text>
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>Rooms: {rooms.length}</Text>
            <Text style={styles.stateText}>Devices: {devices.length}</Text>
            <Text style={styles.stateText}>
              Environment: {environmentData.temperature}°C, {environmentData.humidity}%
            </Text>
            <Text style={styles.stateText}>
              Historical Data: {historicalEnvironmentData ? 'Loaded' : 'Not loaded'}
            </Text>
            <Text style={styles.stateText}>Loading: {isLoading ? 'Yes' : 'No'}</Text>
          </View>
        </View>

        {/* Predefined API Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Direct API Tests</Text>
          <View style={styles.buttonGrid}>
            {predefinedTests.map((test, index) => (
              <TouchableOpacity
                key={index}
                style={styles.testButton}
                onPress={test.action}
                disabled={testLoading}
              >
                <Text style={styles.buttonText}>{test.name}</Text>
                <Text style={styles.buttonSubtext}>{test.method} {test.endpoint}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Store Action Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Action Tests</Text>
          <View style={styles.buttonGrid}>
            {storeTests.map((test, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.testButton, styles.storeButton]}
                onPress={test.action}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>{test.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Endpoint Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Endpoint Test</Text>
          <View style={styles.customTestCard}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Method:</Text>
              <View style={styles.methodButtons}>
                {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodButton,
                      customMethod === method && styles.methodButtonActive
                    ]}
                    onPress={() => setCustomMethod(method)}
                  >
                    <Text style={[
                      styles.methodButtonText,
                      customMethod === method && styles.methodButtonTextActive
                    ]}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.inputLabel}>Endpoint:</Text>
            <TextInput
              style={styles.input}
              value={customEndpoint}
              onChangeText={setCustomEndpoint}
              placeholder="e.g., rooms, devices, environment"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>Request Body (JSON):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={customBody}
              onChangeText={setCustomBody}
              placeholder='{"key": "value"}'
              placeholderTextColor={colors.textSecondary}
              multiline
            />

            <TouchableOpacity
              style={styles.testCustomButton}
              onPress={testCustomEndpoint}
              disabled={testLoading}
            >
              {testLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Test Endpoint</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Test Results */}
        {testResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Result</Text>
            <View style={[
              styles.resultCard,
              testResult.success ? styles.successCard : styles.errorCard
            ]}>
              <Text style={styles.resultStatus}>
                Status: {testResult.status} {testResult.success ? '✅' : '❌'}
              </Text>
              {testResult.error && (
                <Text style={styles.errorText}>Error: {testResult.error}</Text>
              )}
              <Text style={styles.resultLabel}>Response Data:</Text>
              <ScrollView style={styles.resultData} nestedScrollEnabled>
                <Text style={styles.resultText}>
                  {JSON.stringify(testResult.data, null, 2)}
                </Text>
              </ScrollView>
            </View>
          </View>
        )}
        </ScrollView>
      )}
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
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  stateCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stateText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  buttonGrid: {
    gap: 8,
  },
  testButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  storeButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  customTestCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  methodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  methodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  methodButtonText: {
    fontSize: 12,
    color: colors.text,
  },
  methodButtonTextActive: {
    color: 'white',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  testCustomButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  successCard: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  errorCard: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#721c24',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultData: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
  },
  resultText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  fullScreenTest: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.secondary,
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  faceRecognitionButton: {
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
});

// Test component to verify face recognition flow
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import colors from '@/constants/colors';
import FaceCamera from './FaceCamera';
import { registerUser, authenticateUser, getRegisteredUsers, FaceRecognitionUser } from '@/services/faceRecognitionService';
import { saveCapturedImage, getCapturedImages, downloadImage, createImageFolder, CapturedImageInfo } from '@/utils/imageStorage';

export default function FaceRecognitionTest() {
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [mode, setMode] = useState<'register' | 'authenticate'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<FaceRecognitionUser[]>([]);
  const [lastResult, setLastResult] = useState<string>('');
  const [lastCapturedImage, setLastCapturedImage] = useState<string>('');
  const [capturedImages, setCapturedImages] = useState<CapturedImageInfo[]>([]);

  const handleOpenCamera = (cameraMode: 'register' | 'authenticate') => {
    setMode(cameraMode);
    setIsCameraVisible(true);
  };

  const handleCameraCapture = async (imageUri: string) => {
    setIsCameraVisible(false);
    setLastCapturedImage(imageUri); // Store the captured image for preview
    
    // Save the captured image to storage
    const imageInfo = saveCapturedImage(imageUri, mode);
    setCapturedImages(getCapturedImages());
    
    setIsLoading(true);
    
    try {
      if (mode === 'register') {
        // For testing, use a random name
        const testName = `Test User ${Date.now()}`;
        const result = await registerUser(testName, imageUri);
        
        if (result.success) {
          setLastResult(`✅ Registration successful: ${testName}`);
          Alert.alert('Success', 'User registered successfully!');
          await loadUsers(); // Refresh user list
        } else {
          setLastResult(`❌ Registration failed: ${result.message}`);
          Alert.alert('Error', result.message || 'Registration failed');
        }
      } else {
        // Authentication
        const result = await authenticateUser(imageUri);
        
        if (result.success) {
          setLastResult(`✅ Authentication successful: ${result.userName} (${result.confidence}% confidence)`);
          Alert.alert('Success', result.message || 'Authentication successful!');
        } else {
          setLastResult(`❌ Authentication failed: ${result.message}`);
          Alert.alert('Error', result.message || 'Authentication failed');
        }
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      setLastResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      Alert.alert('Error', 'An error occurred during face recognition');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const registeredUsers = await getRegisteredUsers();
      setUsers(registeredUsers);
      console.log('Loaded users:', registeredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face Recognition Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]} 
          onPress={() => handleOpenCamera('register')}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Register New User</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.authButton]} 
          onPress={() => handleOpenCamera('authenticate')}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Authenticate User</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.refreshButton]} 
          onPress={loadUsers}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Refresh Users</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last Result</Text>
        <Text style={styles.resultText}>{lastResult || 'No actions performed yet'}</Text>
      </View>

      {lastCapturedImage && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last Captured Image</Text>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: lastCapturedImage }} 
              style={styles.capturedImage}
              resizeMode="contain"
              onLoad={() => console.log('Image loaded successfully')}
              onError={(error) => console.error('Image load error:', error)}
            />
            <Text style={styles.imageInfo}>
              Real camera capture - Size: {Math.round(lastCapturedImage.length / 1024)}KB
            </Text>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => {
                // Create download link
                const link = document.createElement('a');
                link.href = lastCapturedImage;
                link.download = `face_capture_${Date.now()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Text style={styles.downloadButtonText}>Download Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registered Users ({users.length})</Text>
        {users.length > 0 ? (
          users.map((user) => (
            <View key={user.id} style={styles.userItem}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDetails}>
                ID: {user.id} | Added: {new Date(user.addedAt).toLocaleDateString()}
                {user.lastAuthenticated && ` | Last auth: ${new Date(user.lastAuthenticated).toLocaleString()}`}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noUsers}>No users registered</Text>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      <FaceCamera
        isVisible={isCameraVisible}
        onCapture={handleCameraCapture}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: colors.primary,
  },
  authButton: {
    backgroundColor: colors.secondary,
  },
  refreshButton: {
    backgroundColor: colors.warning,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  resultText: {
    fontSize: 14,
    color: colors.textSecondary,
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  userItem: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  noUsers: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  imageContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  capturedImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

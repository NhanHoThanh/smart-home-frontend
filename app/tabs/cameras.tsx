import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Camera, UserPlus, Lock, Unlock, Shield, Clock, CheckCircle, XCircle, Scan } from 'lucide-react-native';
import FaceCamera from '@/components/FaceCamera';
import * as faceRecognitionService from '@/services/faceRecognitionService';

interface User {
  id: string;
  name: string;
  addedAt: number;
  lastAuthenticated?: number;
}

interface AuthenticationStatus {
  isAuthenticated: boolean;
  userId?: string;
  userName?: string;
  authenticatedAt?: number;
  expiresAt?: number;
}

export default function FaceRecognitionScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [recognizedUsers, setRecognizedUsers] = useState<User[]>([]);
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>({ isAuthenticated: false });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'add' | 'auth' | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'register' | 'authenticate'>('authenticate');
  const [isLoading, setIsLoading] = useState(false);

  // Authentication expires after 5 minutes (300,000 ms)
  const AUTH_DURATION = 5 * 60 * 1000;

  useEffect(() => {
    // Load registered users on component mount
    loadRegisteredUsers();
  }, []);

  useEffect(() => {
    // Check if authentication has expired
    const checkAuthExpiry = () => {
      if (authStatus.isAuthenticated && authStatus.expiresAt) {
        if (Date.now() > authStatus.expiresAt) {
          setAuthStatus({ isAuthenticated: false });
        }
      }
    };

    const interval = setInterval(checkAuthExpiry, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [authStatus]);

  const loadRegisteredUsers = async () => {
    try {
      setIsLoading(true);
      const users = await faceRecognitionService.getRegisteredUsers();
      setRecognizedUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load registered users');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadRegisteredUsers();
    setRefreshing(false);
  }, []);

  const startAddingUser = () => {
    setIsAddingUser(true);
    setNewUserName('');
  };

  const startFaceScanning = (mode: 'add' | 'auth') => {
    if (mode === 'add') {
      if (!newUserName.trim()) {
        Alert.alert('Error', 'Please enter a user name first');
        return;
      }
      setCameraMode('register');
      setIsAddingUser(false);
    } else {
      setCameraMode('authenticate');
    }
    setShowCamera(true);
  };

  const handleCameraCapture = async (imageUri: string) => {
    setShowCamera(false);
    setIsLoading(true);

    try {
      if (cameraMode === 'register') {
        await handleAddUser(imageUri);
      } else {
        await handleAuthentication(imageUri);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (imageUri: string) => {
    try {
      const result = await faceRecognitionService.registerUser(newUserName.trim(), imageUri);
      
      if (result.success) {
        setNewUserName('');
        await loadRegisteredUsers(); // Reload the user list
        Alert.alert('Success', `${newUserName} has been registered successfully!`);
      } else {
        Alert.alert('Registration Failed', result.message || 'Failed to register user');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register user. Please try again.');
    }
  };

  const handleAuthentication = async (imageUri: string) => {
    try {
      const result = await faceRecognitionService.authenticateUser(imageUri);
      
      if (result.success && result.userId && result.userName) {
        const now = Date.now();
        
        setAuthStatus({
          isAuthenticated: true,
          userId: result.userId,
          userName: result.userName,
          authenticatedAt: now,
          expiresAt: now + AUTH_DURATION,
        });

        // Update user's last authentication in local state
        setRecognizedUsers(prev => 
          prev.map(user => 
            user.id === result.userId 
              ? { ...user, lastAuthenticated: now }
              : user
          )
        );

        Alert.alert(
          'Authentication Successful', 
          `Welcome back, ${result.userName}!\nConfidence: ${Math.round((result.confidence || 0) * 100)}%`
        );
      } else {
        Alert.alert('Authentication Failed', result.message || 'Face not recognized. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };

  const handleDoorControl = (action: 'lock' | 'unlock') => {
    if (!authStatus.isAuthenticated) {
      Alert.alert('Authentication Required', 'Please authenticate first to control the door.');
      return;
    }

    Alert.alert(
      'Door Control',
      `Door has been ${action}ed successfully.`,
      [{ text: 'OK' }]
    );
  };

  const removeUser = async (userId: string) => {
    Alert.alert(
      'Remove User',
      'Are you sure you want to remove this user from face recognition?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const result = await faceRecognitionService.removeUser(userId);
              
              if (result.success) {
                await loadRegisteredUsers(); // Reload the user list
                
                // If the removed user was authenticated, clear auth
                if (authStatus.userId === userId) {
                  setAuthStatus({ isAuthenticated: false });
                }
                
                Alert.alert('Success', 'User removed successfully');
              } else {
                Alert.alert('Error', result.message || 'Failed to remove user');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove user. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getTimeRemaining = () => {
    if (!authStatus.expiresAt) return '';
    const remaining = authStatus.expiresAt - Date.now();
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Face Recognition</Text>
          <Text style={styles.subtitle}>Secure door access control</Text>
        </View>

        {/* Authentication Status */}
        <View style={styles.authStatusContainer}>
          <View style={[
            styles.authStatusCard,
            authStatus.isAuthenticated ? styles.authStatusActive : styles.authStatusInactive
          ]}>
            <View style={styles.authIconContainer}>
              {authStatus.isAuthenticated ? (
                <CheckCircle size={24} color={colors.primary} />
              ) : (
                <XCircle size={24} color={colors.textSecondary} />
              )}
            </View>
            <View style={styles.authTextContainer}>
              <Text style={styles.authStatusText}>
                {authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Text>
              {authStatus.isAuthenticated && authStatus.userName && (
                <Text style={styles.authUserText}>Welcome, {authStatus.userName}</Text>
              )}
              {authStatus.isAuthenticated && (
                <Text style={styles.authTimeText}>
                  Expires in: {getTimeRemaining()}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Face Recognition Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.authenticateButton]}
            onPress={() => startFaceScanning('auth')}
            disabled={isLoading}
          >
            <Shield size={20} color="white" />
            <Text style={styles.actionButtonText}>
              {isLoading ? 'Processing...' : 'Authenticate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.addUserButton]}
            onPress={startAddingUser}
            disabled={isLoading}
          >
            <UserPlus size={20} color="white" />
            <Text style={styles.actionButtonText}>Add User</Text>
          </TouchableOpacity>
        </View>

        {/* Door Controls */}
        <View style={styles.doorControlContainer}>
          <Text style={styles.sectionTitle}>Door Control</Text>
          <View style={styles.doorButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.doorButton,
                styles.unlockButton,
                !authStatus.isAuthenticated && styles.doorButtonDisabled
              ]}
              onPress={() => handleDoorControl('unlock')}
              disabled={!authStatus.isAuthenticated}
            >
              <Unlock size={20} color={authStatus.isAuthenticated ? "white" : colors.textSecondary} />
              <Text style={[
                styles.doorButtonText,
                !authStatus.isAuthenticated && styles.doorButtonTextDisabled
              ]}>
                Unlock
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.doorButton,
                styles.lockButton,
                !authStatus.isAuthenticated && styles.doorButtonDisabled
              ]}
              onPress={() => handleDoorControl('lock')}
              disabled={!authStatus.isAuthenticated}
            >
              <Lock size={20} color={authStatus.isAuthenticated ? "white" : colors.textSecondary} />
              <Text style={[
                styles.doorButtonText,
                !authStatus.isAuthenticated && styles.doorButtonTextDisabled
              ]}>
                Lock
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recognized Users */}
        <View style={styles.usersContainer}>
          <Text style={styles.sectionTitle}>Recognized Users ({recognizedUsers.length})</Text>
          {recognizedUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Camera size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No users added yet</Text>
              <Text style={styles.emptyStateSubtext}>Add users to enable face recognition</Text>
            </View>
          ) : (
            recognizedUsers.map(user => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userDetails}>
                    Added: {formatTimeAgo(user.addedAt)}
                  </Text>
                  {user.lastAuthenticated && (
                    <Text style={styles.userDetails}>
                      Last auth: {formatTimeAgo(user.lastAuthenticated)}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeUser(user.id)}
                >
                  <XCircle size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={isAddingUser}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddingUser(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New User</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter user name"
              placeholderTextColor={colors.textSecondary}
              value={newUserName}
              onChangeText={setNewUserName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddingUser(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.scanButton]}
                onPress={() => {
                  if (newUserName.trim()) {
                    startFaceScanning('add');
                  } else {
                    Alert.alert('Error', 'Please enter a user name');
                  }
                }}
                disabled={isLoading}
              >
                <Scan size={16} color="white" />
                <Text style={styles.scanButtonText}>
                  {isLoading ? 'Processing...' : 'Scan Face'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Face Camera */}
      <FaceCamera
        isVisible={showCamera}
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
        mode={cameraMode}
      />
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
  authStatusContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  authStatusCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  authStatusActive: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  authStatusInactive: {
    borderLeftWidth: 4,
    borderLeftColor: colors.textSecondary,
  },
  authIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  authTextContainer: {
    flex: 1,
  },
  authStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  authUserText: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 2,
  },
  authTimeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  authenticateButton: {
    backgroundColor: colors.primary,
  },
  addUserButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  doorControlContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  doorButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  doorButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  unlockButton: {
    backgroundColor: '#10b981',
  },
  lockButton: {
    backgroundColor: '#ef4444',
  },
  doorButtonDisabled: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  doorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  doorButtonTextDisabled: {
    color: colors.textSecondary,
  },
  usersContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  userCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  removeButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    gap: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

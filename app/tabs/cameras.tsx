import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useSmartHomeStore } from '@/store/smartHomeStore';
import colors from '@/constants/colors';
import { Camera, UserPlus, Lock, Unlock, Shield, Clock, CheckCircle, XCircle, Scan } from 'lucide-react-native';

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

  // Authentication expires after 5 minutes (300,000 ms)
  const AUTH_DURATION = 5 * 60 * 1000;

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const startAddingUser = () => {
    setIsAddingUser(true);
    setNewUserName('');
  };

  const startFaceScanning = (mode: 'add' | 'auth') => {
    setScanMode(mode);
    setIsScanning(true);
    
    // Simulate face scanning process
    setTimeout(() => {
      if (mode === 'add') {
        handleAddUser();
      } else {
        handleAuthentication();
      }
      setIsScanning(false);
      setScanMode(null);
    }, 3000);
  };

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const newUser: User = {
        id: Date.now().toString(),
        name: newUserName.trim(),
        addedAt: Date.now(),
      };
      
      setRecognizedUsers(prev => [...prev, newUser]);
      setIsAddingUser(false);
      setNewUserName('');
      
      Alert.alert('Success', `${newUser.name} has been added to face recognition database.`);
    }
  };

  const handleAuthentication = () => {
    // Simulate face recognition - randomly pick a user or fail
    if (recognizedUsers.length === 0) {
      Alert.alert('Authentication Failed', 'No users found in the database.');
      return;
    }

    const isRecognized = Math.random() > 0.3; // 70% success rate for demo
    
    if (isRecognized) {
      const randomUser = recognizedUsers[Math.floor(Math.random() * recognizedUsers.length)];
      const now = Date.now();
      
      setAuthStatus({
        isAuthenticated: true,
        userId: randomUser.id,
        userName: randomUser.name,
        authenticatedAt: now,
        expiresAt: now + AUTH_DURATION,
      });

      // Update user's last authentication
      setRecognizedUsers(prev => 
        prev.map(user => 
          user.id === randomUser.id 
            ? { ...user, lastAuthenticated: now }
            : user
        )
      );

      Alert.alert('Authentication Successful', `Welcome back, ${randomUser.name}!`);
    } else {
      Alert.alert('Authentication Failed', 'Face not recognized. Please try again.');
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

  const removeUser = (userId: string) => {
    Alert.alert(
      'Remove User',
      'Are you sure you want to remove this user from face recognition?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setRecognizedUsers(prev => prev.filter(user => user.id !== userId));
            
            // If the removed user was authenticated, clear auth
            if (authStatus.userId === userId) {
              setAuthStatus({ isAuthenticated: false });
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
            disabled={isScanning}
          >
            <Shield size={20} color="white" />
            <Text style={styles.actionButtonText}>
              {isScanning && scanMode === 'auth' ? 'Scanning...' : 'Authenticate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.addUserButton]}
            onPress={startAddingUser}
            disabled={isScanning}
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
                    setIsAddingUser(false);
                    startFaceScanning('add');
                  } else {
                    Alert.alert('Error', 'Please enter a user name');
                  }
                }}
              >
                <Scan size={16} color="white" />
                <Text style={styles.scanButtonText}>Scan Face</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Scanning Modal */}
      <Modal
        visible={isScanning}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.scanningOverlay}>
          <View style={styles.scanningContainer}>
            <Camera size={64} color={colors.primary} />
            <Text style={styles.scanningText}>
              {scanMode === 'add' ? 'Scanning face for registration...' : 'Authenticating...'}
            </Text>
            <Text style={styles.scanningSubtext}>
              Please look at the camera
            </Text>
          </View>
        </View>
      </Modal>
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
  scanningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  scanningText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  scanningSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

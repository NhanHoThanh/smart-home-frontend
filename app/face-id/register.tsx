import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import colors from '@/constants/colors';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';

interface MessageModalProps {
  visible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  onConfirm?: () => void;
}

const MessageModal = ({ visible, title, message, type, onClose, onConfirm }: MessageModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={[
              styles.modalTitle,
              { color: type === 'success' ? colors.primary : '#FF3B30' }
            ]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalMessage}>{message}</Text>
          
          <View style={styles.modalButtons}>
            {onConfirm ? (
              <>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={onClose}
                >
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={onConfirm}
                >
                  <Text style={styles.modalButtonTextPrimary}>OK</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={onClose}
              >
                <Text style={styles.modalButtonTextPrimary}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function FaceRegistrationScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
    onConfirm?: () => void;
  }>({
    title: '',
    message: '',
    type: 'error',
  });
  const router = useRouter();

  const showModal = (title: string, message: string, type: 'success' | 'error', onConfirm?: () => void) => {
    setModalConfig({ title, message, type, onConfirm });
    setModalVisible(true);
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      const { status } = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showModal(
          'Permission Required',
          'Permission is required to access your photos.',
          'error'
        );
        return;
      }

      const result = await (useCamera 
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
          }));

      if (!result.canceled && result.assets[0].base64) {
        setSelectedImage(result.assets[0].uri);
        setImageBase64(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showModal(
        'Error',
        'Failed to capture image. Please try again.',
        'error'
      );
    }
  };

  const registerFace = async () => {
    if (!name.trim()) {
      showModal('Error', 'Please enter your name.', 'error');
      return;
    }

    if (!imageBase64) {
      showModal('Error', 'Please select an image first.', 'error');
      return;
    }

    try {
      setIsRegistering(true);
      
      const userId = name.trim().toLowerCase().replace(/\s+/g, '_');

      const response = await api.post('cameras/register_face', {
        user_id: userId,
        image_base64: imageBase64
      });

      if (response.status === 201) {
        showModal(
          'Success',
          'Face registered successfully!',
          'success',
          () => router.back()
        );
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      console.error('Error registering face:', error);
      let errorMessage = 'Failed to register face. Please try again.';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Invalid image data or user ID. Please try again.';
        } else if (error.response.status === 500) {
          if (error.response.data?.detail?.includes('Failed to extract embedding')) {
            errorMessage = 'Could not detect a clear face in the image. Please ensure:\n\n' +
              '• Your face is clearly visible\n' +
              '• There is good lighting\n' +
              '• Only one face is in the frame\n' +
              '• Your face is not at an extreme angle';
          } else {
            errorMessage = 'Server error. Please try again later.';
          }
        }
      }
      
      showModal('Error', errorMessage, 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {selectedImage ? (
          <View>
            <Image
              source={{ uri: selectedImage }}
              style={styles.preview}
            />
            <Text style={styles.imageTip}>
              Make sure your face is clearly visible and well-lit
            </Text>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Camera size={48} color={colors.primary} />
            <Text style={styles.placeholderText}>
              Take a photo of your face
            </Text>
            <Text style={styles.placeholderSubtext}>
              Ensure good lighting and a clear view of your face
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.text + '80'}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={() => pickImage(true)}
            disabled={isRegistering}
          >
            <Camera size={24} color="#fff" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.galleryButton]}
            onPress={() => pickImage(false)}
            disabled={isRegistering}
          >
            <ImageIcon size={24} color="#fff" />
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton, (!selectedImage || !name.trim() || isRegistering) && styles.disabledButton]}
            onPress={registerFace}
            disabled={!selectedImage || !name.trim() || isRegistering}
          >
            {isRegistering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register Face</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <MessageModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalVisible(false)}
        onConfirm={modalConfig.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  preview: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginBottom: 20,
  },
  placeholder: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  placeholderSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text + '80',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: colors.text,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: colors.primary,
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: '#E5E5EA',
  },
  modalButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  imageTip: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text + '80',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 
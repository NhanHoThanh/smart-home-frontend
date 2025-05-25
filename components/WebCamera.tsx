import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Camera, RotateCcw, CheckCircle, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { generateMockCameraCapture, isBrowser } from '@/utils/mockImages';

interface WebCameraProps {
  isVisible: boolean;
  onCapture: (imageUri: string) => void;
  onClose: () => void;
  mode: 'register' | 'authenticate';
}

export default function WebCamera({ isVisible, onCapture, onClose, mode }: WebCameraProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    console.log('START CAMERA CALLED - videoRef.current:', !!videoRef.current);
    
    if (isStartingCamera) {
      console.log('Camera start already in progress, skipping...');
      return;
    }

    try {
      console.log('Starting camera with facingMode:', facingMode);
      setIsStartingCamera(true);
      setError(null);
      
      // Wait for video element to be available if not ready
      if (!videoRef.current) {
        console.log('⏳ Video element not ready, waiting...');
        let attempts = 0;
        while (!videoRef.current && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
          console.log(`⏳ Waiting for video element - attempt ${attempts}`);
        }
        
        if (!videoRef.current) {
          throw new Error('Video element not available after waiting');
        }
      }
      
      console.log('✅ Video element is ready:', !!videoRef.current);
      
      // Stop existing stream if any
      if (stream) {
        console.log('Stopping existing stream');
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      console.log('Requesting camera with constraints:', constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', mediaStream);
      
      // Check if component is still mounted and visible
      if (!isVisible) {
        console.log('Component no longer visible, stopping new stream');
        mediaStream.getTracks().forEach(track => track.stop());
        return;
      }
      
      setStream(mediaStream);
      setHasPermission(true);

      // Set video source with improved approach
      if (videoRef.current && mediaStream.active) {
        console.log('Setting video source');
        const video = videoRef.current;
        
        // Stop any existing playback
        // video.pause();
        
        // Reset the video element completely
        video.removeAttribute('src');
        video.srcObject = null;
        
        // Configure video properties BEFORE setting source (removed await/delay)
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.controls = false;
        
        // Set the source
        console.log('Assigning mediaStream to video.srcObject');
        video.srcObject = mediaStream;
        
        console.log('Video srcObject assigned:', !!video.srcObject);
        console.log('MediaStream active:', mediaStream.active);
        console.log('MediaStream video tracks:', mediaStream.getVideoTracks().map(track => ({
          kind: track.kind,
          enabled: track.enabled,
          readyState: track.readyState,
          settings: track.getSettings()
        })));
        
        // Force load
        video.load();
        
        // Set up event listeners for debugging
        const handleLoadStart = () => console.log('Video: loadstart event');
        const handleLoadedMetadata = () => {
          console.log('Video: loadedmetadata event - dimensions:', video.videoWidth, 'x', video.videoHeight);
        };
        const handleCanPlay = () => console.log('Video: canplay event');
        const handlePlaying = () => console.log('Video: playing event');
        const handleError = (e: Event) => {
          console.error('Video: error event', e);
          console.error('Video error object:', video.error);
        };
        
        video.addEventListener('loadstart', handleLoadStart, { once: true });
        video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        video.addEventListener('canplay', handleCanPlay, { once: true });
        video.addEventListener('playing', handlePlaying, { once: true });
        video.addEventListener('error', handleError, { once: true });
        
        // Try to play (with error handling)
        // try {
        //   await video.play();
        //   console.log('Video playback started successfully');
        // } catch (playError) {
        //   console.warn('Video play() failed (this is sometimes normal):', playError);
        // }
        video.addEventListener('canplay', () => {
          video.play().catch(err => console.error('Play error:', err));
        }, { once: true });
        
        // Give it time to initialize and check status
        setTimeout(() => {
          console.log('Video status after 2 seconds abcs:', {
            readyState: video.readyState,
            networkState: video.networkState,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            currentTime: video.currentTime,
            paused: video.paused,
            ended: video.ended,
            srcObject: !!video.srcObject,
            error: video.error?.message
          });
          
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error('Video dimensions are still 0x0 after 2 seconds');
            setError('Camera feed not displaying properly. Please try refreshing the page.');
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access and try again.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else if (err.name === 'NotSupportedError') {
          setError('Camera not supported on this browser.');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is busy or not accessible. Please close other applications using the camera and try again.');
        } else {
          setError('Failed to access camera. Please try again.');
        }
      } else {
        setError('Failed to access camera. Please try again.');
      }
    } finally {
      setIsStartingCamera(false);
    }
  }, [facingMode, isVisible, isStartingCamera, stream]);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera');
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      setStream(null);
    }
    if (videoRef.current) {
      // videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Function to save image to downloads folder
  const saveImageToDownloads = async (blob: Blob, filename: string) => {
    try {
      if ('showSaveFilePicker' in window) {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'JPEG Images',
            accept: {
              'image/jpeg': ['.jpg', '.jpeg'],
            },
          }],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        console.log('Image saved successfully:', filename);
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Image downloaded:', filename);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const takePicture = async () => {

    
    if (!videoRef.current || !canvasRef.current) {
      Alert.alert('Error', 'Camera not ready. Please try again.');
      return;
    }

    if (!stream || !stream.active) {
      Alert.alert('Error', 'Camera stream not active. Please restart the camera.');
      return;
    }

    const video = videoRef.current;
    
    try {
      console.log('Taking picture - video state:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        paused: video.paused,
        currentTime: video.currentTime
      });

      // Check if video has valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video has no dimensions');
        Alert.alert('Error', 'Camera feed not ready. Please wait a moment and try again.');
        return;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        Alert.alert('Error', 'Unable to capture image. Please try again.');
        return;
      }

      console.log('Capturing image from video stream');
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (blob && blob.size > 1000) {
          console.log('Image blob created, size:', blob.size, 'bytes');
          
          const reader = new FileReader();
          reader.onloadend = async () => {
            const dataUrl = reader.result as string;
            console.log('Image captured successfully, data URL length:', dataUrl.length);
            
            // Save image to downloads folder
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `face_${mode}_${timestamp}.jpg`;
            await saveImageToDownloads(blob, filename);
            
            onCapture(dataUrl);
          };
          reader.readAsDataURL(blob);
        } else {
          console.error('Blob is too small or null:', blob?.size);
          Alert.alert('Error', 'Captured image is invalid. Please try again.');
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const toggleCamera = async () => {
    if (isStartingCamera) {
      console.log('Camera start in progress, cannot toggle now');
      return;
    }
    
    console.log('Toggling camera facing mode');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    console.log('Switching to facing mode:', newFacingMode);
    setFacingMode(newFacingMode);
  };

  const requestPermission = async () => {
    await startCamera();
  };

  // Effect to handle camera initialization and cleanup
  useEffect(() => {
    if (isVisible && hasPermission !== false && !stream) {
      console.log('Starting camera due to visibility change');
      startCamera();
    } else if (!isVisible) {
      console.log('Stopping camera due to visibility change');
      stopCamera();
    }

    return () => {
      if (stream) {
        console.log('Cleanup: stopping camera');
        stopCamera();
      }
    };
  }, [isVisible, hasPermission]);

  // Separate effect for handling facing mode changes
  useEffect(() => {
    if (isVisible && hasPermission === true) {
      console.log('Restarting camera due to facing mode change');
      if (stream) {
        stopCamera();
      }
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [facingMode]);

  // Check if browser supports getUserMedia
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not supported on this browser.');
      setHasPermission(false);
    }
  }, []);

  console.log('🖼️ COMPONENT RENDER - isVisible:', isVisible, 'hasPermission:', hasPermission);

  // Always render the main container but control visibility
  const containerStyle = {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
    display: isVisible ? 'flex' as 'flex' : 'none' as 'none',
  };

  // Always render the video element to ensure ref consistency
  const videoElement = (
    <video
      ref={videoRef}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
        backgroundColor: '#000',
      } as any}
      playsInline
      muted
      autoPlay
      onLoadedMetadata={() => {
        console.log('Video metadata loaded event fired');
      }}
      onError={(e) => {
        console.error('Video element error:', e);
        setError('Error displaying camera feed. Please try again.');
      }}
    />
  );

  const canvasElement = (
    <canvas
      ref={canvasRef}
      style={{ display: 'none' } as any}
    />
  );

  if (hasPermission === null || isStartingCamera) {
    return (
      <View style={containerStyle}>
        {videoElement}
        {canvasElement}
        <View style={styles.permissionContainer}>
          <Camera size={64} color={colors.textSecondary} />
          <Text style={styles.permissionText}>
            {isStartingCamera ? 'Starting Camera...' : 'Initializing Camera...'}
          </Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false || error) {
    return (
      <View style={containerStyle}>
        {videoElement}
        {canvasElement}
        <View style={styles.permissionContainer}>
          <Camera size={64} color={colors.textSecondary} />
          <Text style={styles.permissionText}>Camera Access Required</Text>
          <Text style={styles.permissionSubtext}>
            {error || 'Please grant camera access to use face recognition'}
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={styles.cameraContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {mode === 'register' ? 'Register Face' : 'Authenticate'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.videoContainer}>
          {videoElement}
          {canvasElement}
          
          <View style={styles.overlay}>
            <View style={styles.faceFrame} />
            <Text style={styles.instructionText}>
              {mode === 'register' 
                ? 'Position your face in the frame and take a photo'
                : 'Look at the camera for authentication'
              }
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
            <RotateCcw size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner}>
              <CheckCircle size={32} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  permissionText: {
    fontSize: 20,
    fontWeight: 'bold' as any,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center' as any,
  },
  permissionSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center' as any,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as any,
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as any,
    justifyContent: 'space-between' as any,
    alignItems: 'center' as any,
    padding: 16,
    paddingTop: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600' as any,
  },
  videoContainer: {
    flex: 1,
    position: 'relative' as any,
  },
  overlay: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as any,
    alignItems: 'center' as any,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  faceFrame: {
    width: 200,
    height: 250,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center' as any,
    marginTop: 24,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row' as any,
    justifyContent: 'space-between' as any,
    alignItems: 'center' as any,
    padding: 32,
    paddingBottom: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as any,
    alignItems: 'center' as any,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center' as any,
    alignItems: 'center' as any,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as any,
    alignItems: 'center' as any,
  },
});

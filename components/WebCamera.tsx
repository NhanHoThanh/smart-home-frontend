import React, { useEffect, useRef } from 'react';
import { View, StyleSheet,TouchableOpacity } from 'react-native';

interface WebCameraProps {
  isVisible: boolean;
  onCapture?: (imageDataUrl: string) => void; // Callback for captured image data
}

export default function WebCamera({ isVisible,onCapture }: WebCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to start the camera
  const startCamera = async () => {
    try {
      // Request camera access with basic constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      // Assign the stream to the video element if it exists
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

    const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context && video.videoWidth && video.videoHeight) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data as base64 string
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Call the onCapture callback with the image data
        if (onCapture) {
          onCapture(imageDataUrl);
        }
        
        console.log('Image captured successfully');
      }
    }
  };

  // Effect to manage camera lifecycle based on visibility
  useEffect(() => {
    if (isVisible) {
      startCamera();
    } else {
      stopCamera();
    }
    // Cleanup on unmount or when isVisible changes to false
    return () => {
      stopCamera();
    };
  }, [isVisible]);
return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        style={styles.video}
        autoPlay
        playsInline
        muted
      />
      
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} style={{ display: 'none' } as any} />
      
      {/* Capture Button */}
      <View style={styles.captureContainer}>
        <TouchableOpacity 
          style={styles.captureButton}
          onPress={captureImage}
          activeOpacity={0.8}
        >
          <View style={styles.captureButtonInner}>
            <View style={styles.captureButtonCore} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Camera Frame Overlay (optional) */}
      <View style={styles.overlay}>
        <View style={styles.frameCorners}>
          {/* Top Left Corner */}
          <View style={[styles.corner, styles.topLeft]} />
          {/* Top Right Corner */}
          <View style={[styles.corner, styles.topRight]} />
          {/* Bottom Left Corner */}
          <View style={[styles.corner, styles.bottomLeft]} />
          {/* Bottom Right Corner */}
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    display: 'flex',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: '#000',
  },
  
  // Capture Button Styles
  captureContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonCore: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },

  // Camera Frame Overlay Styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none', // Allow touches to pass through
  },
  frameCorners: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    right: '15%',
    bottom: '30%',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});
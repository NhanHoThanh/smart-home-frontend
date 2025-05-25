// Image storage utilities for face recognition captures

export interface CapturedImageInfo {
  id: string;
  timestamp: number;
  filename: string;
  dataUrl: string;
  mode: 'register' | 'authenticate';
  size: number;
}

// In-memory storage for captured images (persists during session)
let capturedImages: CapturedImageInfo[] = [];

// Save a captured image to local storage and return image info
export const saveCapturedImage = (dataUrl: string, mode: 'register' | 'authenticate'): CapturedImageInfo => {
  const timestamp = Date.now();
  const id = `img_${timestamp}`;
  const filename = `face_${mode}_${timestamp}.jpg`;
  
  const imageInfo: CapturedImageInfo = {
    id,
    timestamp,
    filename,
    dataUrl,
    mode,
    size: dataUrl.length,
  };
  
  // Add to in-memory storage
  capturedImages.push(imageInfo);
  
  // Save to localStorage for persistence
  try {
    localStorage.setItem('faceRecognitionImages', JSON.stringify(capturedImages));
    console.log('Image saved to localStorage:', filename);
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
  
  return imageInfo;
};

// Get all captured images
export const getCapturedImages = (): CapturedImageInfo[] => {
  // Try to load from localStorage first
  try {
    const stored = localStorage.getItem('faceRecognitionImages');
    if (stored) {
      capturedImages = JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
  }
  
  return capturedImages;
};

// Clear all captured images
export const clearCapturedImages = (): void => {
  capturedImages = [];
  try {
    localStorage.removeItem('faceRecognitionImages');
    console.log('Cleared all captured images');
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
};

// Download an image as a file
export const downloadImage = (imageInfo: CapturedImageInfo): void => {
  try {
    const link = document.createElement('a');
    link.href = imageInfo.dataUrl;
    link.download = imageInfo.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Downloaded image:', imageInfo.filename);
  } catch (error) {
    console.error('Failed to download image:', error);
  }
};

// Download all images as a zip (simplified - just individual downloads)
export const downloadAllImages = (): void => {
  const images = getCapturedImages();
  images.forEach((image, index) => {
    setTimeout(() => {
      downloadImage(image);
    }, index * 500); // Stagger downloads to avoid browser blocking
  });
};

// Create a folder structure for organizing images
export const createImageFolder = async (): Promise<void> => {
  if ('showDirectoryPicker' in window) {
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      
      // Create subfolders for organization
      const registerFolder = await dirHandle.getDirectoryHandle('register', { create: true });
      const authFolder = await dirHandle.getDirectoryHandle('authenticate', { create: true });
      
      console.log('Image folders created successfully');
      
      // Save all images to appropriate folders
      const images = getCapturedImages();
      for (const image of images) {
        const targetFolder = image.mode === 'register' ? registerFolder : authFolder;
        
        // Convert data URL to blob
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        
        // Save file
        const fileHandle = await targetFolder.getFileHandle(image.filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      }
      
      console.log('All images saved to organized folders');
    } catch (error) {
      console.error('Error creating image folder:', error);
    }
  } else {
    console.warn('Directory picker not supported, using individual downloads');
    downloadAllImages();
  }
};

// Mock image utilities for face recognition development

// Generate a simple data URL for a colored rectangle representing a face
export const generateMockFaceImage = (name: string): string => {
  // Create a canvas to generate a mock face image
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    // Fallback to a simple data URL
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  }
  
  // Create a simple gradient background
  const gradient = ctx.createLinearGradient(0, 0, 400, 400);
  gradient.addColorStop(0, '#4F46E5'); // Indigo
  gradient.addColorStop(1, '#7C3AED'); // Purple
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 400);
  
  // Add a circle for face outline
  ctx.beginPath();
  ctx.arc(200, 200, 150, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Add text with the user's name
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(name, 200, 200);
  
  // Add "MOCK" text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '16px Arial';
  ctx.fillText('MOCK FACE', 200, 240);
  
  // Convert to data URL
  return canvas.toDataURL('image/jpeg', 0.8);
};

// Generate mock camera capture from canvas
export const generateMockCameraCapture = async (): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate camera processing delay
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=');
        return;
      }
      
      // Create a realistic camera view simulation
      const gradient = ctx.createRadialGradient(320, 240, 0, 320, 240, 400);
      gradient.addColorStop(0, '#2D3748');
      gradient.addColorStop(1, '#1A202C');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 640, 480);
      
      // Add some noise/grain effect
      for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * 640, Math.random() * 480, 1, 1);
      }
      
      // Add face frame outline
      ctx.strokeStyle = '#10B981'; // Green color like the face frame
      ctx.lineWidth = 3;
      ctx.strokeRect(220, 115, 200, 250);
      
      // Add capture timestamp
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '14px monospace';
      ctx.fillText(`Captured: ${new Date().toLocaleTimeString()}`, 10, 30);
      
      // Add mock face detection indicator
      ctx.fillStyle = '#10B981';
      ctx.font = '12px Arial';
      ctx.fillText('✓ Face Detected', 10, 460);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    }, 500);
  });
};

// Check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

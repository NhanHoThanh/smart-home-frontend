# Face Recognition Authentication System

## Overview

The face recognition system provides secure door access control using real camera-based facial authentication. Users can register their faces and then authenticate using live camera capture.

## Features

### 🔐 Real Face Authentication
- Live camera capture for registration and authentication
- Real-time face recognition using server-side AI
- Confidence scoring for authentication results
- Session-based authentication with automatic expiry

### 📱 Cross-Platform Support
- Works on iOS, Android, and Web
- Automatic camera permission requests
- Responsive UI with face detection overlay

### 🏠 Smart Door Control
- Lock/unlock controls (requires authentication)
- Authentication status with timer display
- Secure session management (5-minute sessions)

## How It Works

### User Registration
1. Click "Add User" button
2. Enter the user's name
3. Click "Scan Face" to open camera
4. Position face in the frame and capture
5. Image is sent to server for face encoding
6. User is added to the recognition database

### Authentication Process
1. Click "Authenticate" button
2. Camera opens for face capture
3. Live image is sent to server for recognition
4. Server compares against registered faces
5. Returns success/failure with confidence score
6. If successful, unlocks door controls for 5 minutes

### Door Control
- **Unlock**: Opens the door (requires active authentication)
- **Lock**: Secures the door (requires active authentication)
- Controls are disabled when not authenticated

## API Endpoints

### Register User
```
POST /face-recognition/register
Content-Type: multipart/form-data

Body:
- name: string (user's name)
- image: file (face image JPEG/PNG)

Response:
{
  "success": boolean,
  "userId": string,
  "message": string
}
```

### Authenticate User
```
POST /face-recognition/authenticate
Content-Type: multipart/form-data

Body:
- image: file (face image for auth)

Response:
{
  "success": boolean,
  "userId": string,
  "userName": string,
  "confidence": number (0-1),
  "message": string
}
```

### Get Registered Users
```
GET /face-recognition/users

Response:
[
  {
    "id": string,
    "name": string,
    "addedAt": timestamp,
    "lastAuthenticated": timestamp
  }
]
```

### Remove User
```
DELETE /face-recognition/users/{userId}

Response:
{
  "success": boolean,
  "message": string
}
```

## Security Features

- **Session Expiry**: Authentication sessions expire after 5 minutes
- **Confidence Threshold**: Server can set minimum confidence for authentication
- **Secure Image Transfer**: Images are sent over HTTPS
- **User Management**: Admin can remove users from the system

## Camera Permissions

The app automatically requests camera permissions when needed:

### iOS
- Adds `NSCameraUsageDescription` to Info.plist
- Requests permission on first camera use

### Android
- Adds `CAMERA` permission to AndroidManifest.xml
- Runtime permission request

### Web
- Uses browser's getUserMedia API
- Permission prompt appears automatically

## Usage Tips

### Best Practices for Registration
- Ensure good lighting when capturing faces
- Position face clearly in the frame
- Avoid sunglasses or face coverings
- Use front-facing camera for better results

### Authentication Tips
- Use the same lighting conditions as registration
- Keep face centered in the frame
- Allow 2-3 seconds for capture
- Retry if confidence is low

## Troubleshooting

### Camera Not Working
1. Check camera permissions in device settings
2. Restart the app
3. Ensure camera is not being used by another app

### Authentication Failing
1. Check server connectivity
2. Ensure good lighting
3. Try re-registering the user
4. Check server logs for errors

### Permission Issues
1. Go to device settings
2. Find the app in permissions
3. Enable camera access
4. Restart the app

## Server Implementation Notes

The face recognition server should:

1. **Image Processing**: Accept JPEG/PNG images
2. **Face Detection**: Extract facial features from images
3. **Encoding**: Convert faces to numerical vectors
4. **Storage**: Store face encodings with user metadata
5. **Comparison**: Compare new faces against stored encodings
6. **Confidence**: Return similarity confidence scores
7. **Security**: Validate image formats and sizes

### Recommended Libraries
- **Python**: face_recognition, OpenCV, dlib
- **Node.js**: face-api.js, opencv4nodejs
- **Storage**: PostgreSQL, MongoDB for user data
- **Security**: bcrypt for any passwords, JWT for sessions

## Performance Considerations

- Images are compressed to 80% quality for faster upload
- Face detection happens server-side for better accuracy
- Local user list is cached and refreshed on demand
- Authentication sessions prevent repeated API calls

## Future Enhancements

- [ ] Multiple face angles during registration
- [ ] Liveness detection (blink detection)
- [ ] Face recognition confidence adjustment
- [ ] Backup PIN authentication
- [ ] Admin dashboard for user management
- [ ] Audit logs for access attempts

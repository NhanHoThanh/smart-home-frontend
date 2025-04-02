# Smart Home Control App

A React Native application built with Expo for monitoring and controlling smart home devices.

## How to Run the Project

### Prerequisites
- Node.js (v14 or higher)
- npm
- Expo CLI (`npm install -g expo-cli`)

### Installation Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   # For web development
   npm start -- --web
   # OR
   npm run start-web
   
   # For mobile development with tunnel (for external access)
   npm start
   ```

4. For mobile testing:
   - Download the Expo Go app on your mobile device
   - Scan the QR code from the terminal

## App Features

### 1. Home Dashboard
- Overview of smart home status
- Quick access to frequently used devices
- Room selector for filtering devices

### 2. Environment Monitoring
- Real-time temperature, humidity, and light level data
- Historical data visualization with line charts
- Air quality monitoring

### 3. Security Cameras
- Live camera feeds from around the home
- Motion detection alerts
- Person/animal/object recognition
- Camera status monitoring (online/offline)

### 4. AI Assistant
- Voice-controlled smart home management
- Command history tracking
- Natural language processing for home control

### 5. Settings
- App appearance customization
- Notification preferences
- Privacy and security settings
- Account management

## Project Structure

### Root Directory
```
/
├── app/               # Main app screens and navigation
├── assets/            # Static assets (images, fonts)
├── components/        # Reusable UI components
├── constants/         # App constants and configuration
├── store/             # State management
├── types/             # TypeScript type definitions
├── app.json           # Expo configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

### App Directory (`/app/`)
The app directory uses an Expo Router file-based routing system:

- `_layout.tsx` - Root layout component for the app
- `index.tsx` - Redirects to the tabs screen
- `tabs/` - Contains the main tab screens
  - `_layout.tsx` - Tab navigation configuration
  - `index.tsx` - Home dashboard screen
  - `environment.tsx` - Environment monitoring screen
  - `cameras.tsx` - Security cameras screen
  - `assistant.tsx` - AI assistant screen
  - `settings.tsx` - App settings screen
- `camera-detail.tsx` - Detailed camera view
- `error-boundary.tsx` - Error handling component
- `modal.tsx` - Modal screen component
- `not-found.tsx` - 404 page

### Components Directory (`/components/`)
Reusable UI components used throughout the app:

- `AIAssistant.tsx` - AI assistant interface component
- `CameraCard.tsx` - Camera preview card component
- `DeviceCard.tsx` - Smart device control card
- `EnvironmentPanel.tsx` - Environment data display
- `LineChart.tsx` - Data visualization component
- `QuickActions.tsx` - Quick action buttons component
- `RoomSelector.tsx` - Room selection and filtering component

### Constants Directory (`/constants/`)
App-wide constants:

- `colors.ts` - Color theme definitions
- `mockData.ts` - Simulated data for development

### Store Directory (`/store/`)
State management using Zustand:

- `smartHomeStore.ts` - Global state store for smart home data

### Types Directory (`/types/`)
TypeScript type definitions:

- `smartHome.ts` - Type definitions for smart home entities

## Screenshots

_Place screenshot images here to showcase the app's interface._

Example format:
```
### Home Dashboard
![Home Dashboard](path/to/screenshot1.png)

### Environment Monitoring
![Environment Screen](path/to/screenshot2.png)

### Security Cameras
![Cameras Screen](path/to/screenshot3.png)
```

## Future Work

### API Integration
The app currently uses mock data defined in `constants/mockData.ts`. To integrate with real APIs:

1. Create an `api` directory with service files for different endpoints:
   ```
   /api/
   ├── deviceService.ts
   ├── cameraService.ts
   ├── environmentService.ts
   ```

2. Update the store in `store/smartHomeStore.ts` to fetch data from these services instead of using mock data.

3. Implement authentication for secure API access.

### Additional Features to Consider
- User authentication and multi-user support
- Push notifications for important events
- Device automation rules
- Energy usage tracking and optimization


## Troubleshooting

If you encounter issues with the app:

1. Ensure all dependencies are installed: `npm install`
2. Clear cache: `expo start -c`
3. For TypeScript errors, check the type definitions in the `types` directory


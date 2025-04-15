# Smart Home App API Documentation

## Overview

This document outlines the API endpoints needed for the Smart Home mobile application. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

```
https://api.smarthome.com/v1
```

## Endpoints

### Rooms

#### Get All Rooms

```
GET /rooms
```

**Response:**

```json
[
  {
    "id": "1",
    "name": "Living Room",
    "icon": "sofa"
  },
  {
    "id": "2",
    "name": "Kitchen",
    "icon": "utensils"
  }
]
```

#### Get Room by ID

```
GET /rooms/:id
```

**Response:**

```json
{
  "id": "1",
  "name": "Living Room",
  "icon": "sofa"
}
```

#### Create Room

```
POST /rooms
```

**Request Body:**

```json
{
  "name": "Garage",
  "icon": "garage"
}
```

#### Update Room

```
PUT /rooms/:id
```

**Request Body:**

```json
{
  "name": "Updated Room Name",
  "icon": "bed"
}
```

#### Delete Room

```
DELETE /rooms/:id
```

### Devices

#### Get All Devices

```
GET /devices
```

**Query Parameters:**
- `roomId` (optional): Filter devices by room

**Response:**

```json
[
  {
    "id": "1",
    "name": "Main Light",
    "type": "light",
    "roomId": "1",
    "status": true,
    "icon": "lamp-ceiling",
    "brightness": 80
  },
  {
    "id": "2",
    "name": "AC",
    "type": "climate",
    "roomId": "1",
    "status": true,
    "icon": "air-vent",
    "temperature": 23
  }
]
```

#### Get Device by ID

```
GET /devices/:id
```

**Response:**

```json
{
  "id": "1",
  "name": "Main Light",
  "type": "light",
  "roomId": "1",
  "status": true,
  "icon": "lamp-ceiling",
  "brightness": 80
}
```

#### Create Device

```
POST /devices
```

**Request Body:**

```json
{
  "name": "New Light",
  "type": "light",
  "roomId": "1",
  "icon": "lamp-ceiling"
}
```

#### Update Device

```
PUT /devices/:id
```

**Request Body:**

```json
{
  "name": "Updated Light",
  "status": false,
  "brightness": 50
}
```

#### Toggle Device

```
PATCH /devices/:id/toggle
```

**Response:**

```json
{
  "id": "1",
  "status": false
}
```

#### Update Device Brightness

```
PATCH /devices/:id/brightness
```

**Request Body:**

```json
{
  "brightness": 75
}
```

#### Update Device Temperature

```
PATCH /devices/:id/temperature
```

**Request Body:**

```json
{
  "temperature": 24
}
```

#### Delete Device

```
DELETE /devices/:id
```

### Cameras

#### Get All Cameras

```
GET /cameras
```

**Query Parameters:**
- `roomId` (optional): Filter cameras by room

**Response:**

```json
[
  {
    "id": "1",
    "name": "Front Door Camera",
    "roomId": "6",
    "isOnline": true,
    "hasMotion": true,
    "imageUrl": "https://example.com/camera1.jpg",
    "lastMotionTime": "2 min ago",
    "hasRecording": true,
    "detectedEntities": [
      {
        "type": "person",
        "confidence": 0.98,
        "personType": "owner",
        "personName": "John",
        "timestamp": "2 min ago"
      }
    ]
  }
]
```

#### Get Camera by ID

```
GET /cameras/:id
```

**Response:**

```json
{
  "id": "1",
  "name": "Front Door Camera",
  "roomId": "6",
  "isOnline": true,
  "hasMotion": true,
  "imageUrl": "https://example.com/camera1.jpg",
  "lastMotionTime": "2 min ago",
  "hasRecording": true,
  "detectedEntities": [
    {
      "type": "person",
      "confidence": 0.98,
      "personType": "owner",
      "personName": "John",
      "timestamp": "2 min ago"
    }
  ]
}
```

#### Create Camera

```
POST /cameras
```

**Request Body:**

```json
{
  "name": "New Camera",
  "roomId": "1"
}
```

#### Update Camera

```
PUT /cameras/:id
```

**Request Body:**

```json
{
  "name": "Updated Camera",
  "isOnline": true
}
```

#### Toggle Camera Motion Detection

```
PATCH /cameras/:id/motion
```

**Response:**

```json
{
  "id": "1",
  "hasMotion": true,
  "lastMotionTime": "Just now"
}
```

#### Toggle Camera Online Status

```
PATCH /cameras/:id/online
```

**Response:**

```json
{
  "id": "1",
  "isOnline": true
}
```

#### Add Detected Entity

```
POST /cameras/:id/entities
```

**Request Body:**

```json
{
  "type": "person",
  "confidence": 0.95,
  "personType": "family",
  "personName": "Emma",
  "timestamp": "Just now"
}
```

#### Delete Camera

```
DELETE /cameras/:id
```

### Environment

#### Get Environment Data

```
GET /environment
```

**Response:**

```json
{
  "temperature": 23.5,
  "humidity": 45,
  "lightLevel": 68,
  "airQuality": "Good"
}
```

#### Update Environment Data

```
PUT /environment
```

**Request Body:**

```json
{
  "temperature": 24.0,
  "humidity": 46
}
```

### AI Assistant

#### Start Listening

```
POST /assistant/listen
```

**Response:**

```json
{
  "isListening": true
}
```

#### Stop Listening

```
POST /assistant/stop
```

**Request Body:**

```json
{
  "command": "Turn on the living room lights"
}
```

**Response:**

```json
{
  "isListening": false,
  "lastCommand": "Turn on the living room lights",
  "lastResponse": "I've turned on the living room lights."
}
```

#### Get Command History

```
GET /assistant/history
```

**Response:**

```json
[
  {
    "command": "Turn on the living room lights",
    "response": "I've turned on the living room lights.",
    "timestamp": 1621234567890
  },
  {
    "command": "What's the temperature?",
    "response": "The current temperature is 23.5°C.",
    "timestamp": 1621234567000
  }
]
```

#### Clear Command History

```
DELETE /assistant/history
```

## WebSocket Endpoints

### Real-time Device Updates

```
ws://api.smarthome.com/v1/ws/devices
```

**Events:**
- `device:status` - When a device status changes
- `device:brightness` - When a device brightness changes
- `device:temperature` - When a device temperature changes

### Real-time Camera Updates

```
ws://api.smarthome.com/v1/ws/cameras
```

**Events:**
- `camera:motion` - When motion is detected
- `camera:entity` - When an entity is detected
- `camera:online` - When camera online status changes

### Real-time Environment Updates

```
ws://api.smarthome.com/v1/ws/environment
```

**Events:**
- `environment:temperature` - When temperature changes
- `environment:humidity` - When humidity changes
- `environment:light` - When light level changes
- `environment:air` - When air quality changes

## Error Handling

All API errors follow this format:

```json
{

    "status": "error",
    "message": "Human-readable error message"

}
```

Common error codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error


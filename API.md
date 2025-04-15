# Smart Home App API Documentation


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
    "room_id": "1",
    "status": true,
    "icon": "lamp-ceiling",
    "brightness": 80
  },
  {
    "id": "2",
    "name": "AC",
    "type": "climate",
    "room_id": "1",
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
  "room_id": "1",
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
  "roomm_id": "1",
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
  "brightness": 50,
  "temperature": 24
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
    "is_online": true,
    "has_motion": true,
    "image_url": "https://example.com/camera1.jpg",
    "last_motion_time": "2 min ago",
    "has_recording": true,
    "detected_entities": [
        {
        "type": "person",
        "confidence": 0.98,
        "person_type": "owner",
        "person_name": "John",
        "timestamp": "12:00:00" 
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
  "is_online": true,
  "has_motion": true,
  "image_url": "https://example.com/camera1.jpg",
  "last_motion_time": "2 min ago",
  "has_recording": true,
  "detected_entities": [
    {
      "type": "person",
      "confidence": 0.98,
      "person_type": "owner",
      "person_name": "John",
      "timestamp": "12:00:00" 
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
  "room_id": "1"
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
  "is_online": true
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
  "has_motion": true,
  "last_motion_time": "Just now"
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
  "is_online": true
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
  "person_type": "family",
  "person_name": "Emma",
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

#### Update Environment Data (For test)

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

#### Send text
```
POST /assistant/text
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
    "response": "oke"
}
```

#### Send voice
```
POST /assistant/voice
```

**Request Body:**

```json
voice file?
```

**Response:**

```json
{
    "user_command": "alo",
    "response": "lo cc"
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

## WebSocket Endpoints (Cuối kì)

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


# Smart Home API Documentation

## Environment API

### Get Current Environment Data

Retrieves the current environment data including temperature, humidity, and light level.

**Endpoint:** `GET /environment`

**Response:**
```json
{
  "temperature": 22.5,
  "humidity": 45,
  "lightLevel": 80,
  "airQuality": "good"
}
```

### Get Historical Environment Data

Retrieves historical environment data with timestamps for temperature, humidity, and light level.

**Endpoint:** `GET /environment/history`

**Response:**
```json
{
  "temperature": [
    {
      "created_at": "2023-04-16 12:00:00",
      "value": "22.5"
    },
    {
      "created_at": "2023-04-16 12:05:00",
      "value": "22.7"
    }
  ],
  "humidity": [
    {
      "created_at": "2023-04-16 12:00:00",
      "value": "45"
    },
    {
      "created_at": "2023-04-16 12:05:00",
      "value": "46"
    }
  ],
  "lightLevel": [
    {
      "created_at": "2023-04-16 12:00:00",
      "value": "80"
    },
    {
      "created_at": "2023-04-16 12:05:00",
      "value": "82"
    }
  ]
}
```

### Update Environment Data

Updates the current environment data.

**Endpoint:** `PUT /environment`

**Request Body:**
```json
{
  "temperature": 23.0,
  "humidity": 50,
  "lightLevel": 85,
  "airQuality": "excellent"
}
```

**Response:**
```json
{
  "temperature": 23.0,
  "humidity": 50,
  "lightLevel": 85,
  "airQuality": "excellent"
}
```

## Rooms API

### Get All Rooms

Retrieves all rooms in the smart home.

**Endpoint:** `GET /rooms`

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

## Devices API

### Get All Devices

Retrieves all devices in the smart home.

**Endpoint:** `GET /devices`

**Query Parameters:**
- `roomId` (optional): Filter devices by room ID

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
    "status": false,
    "icon": "air-vent",
    "temperature": 23
  }
]
```

### Toggle Device

Toggles a device on or off.

**Endpoint:** `PATCH /devices/{id}/toggle`

**Response:**
```json
{
  "id": "1",
  "status": true
}
```

### Update Device Brightness

Updates the brightness of a light device.

**Endpoint:** `PATCH /devices/{id}/brightness`

**Request Body:**
```json
{
  "brightness": 75
}
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
  "brightness": 75
}
```

### Update Device Temperature

Updates the temperature of a climate device.

**Endpoint:** `PATCH /devices/{id}/temperature`

**Request Body:**
```json
{
  "temperature": 24
}
```

**Response:**
```json
{
  "id": "2",
  "name": "AC",
  "type": "climate",
  "room_id": "1",
  "status": true,
  "icon": "air-vent",
  "temperature": 24
}
``` 
### add user
endpoint; POST localhost:8000/v1/cameras/register_face
{
  "user_id": "ThuThao",
  "image_base64": "string"
}

this return {
    "message": "Embedding added for user QuynhAnh. User now has 1 registered embedding(s).",
    "user_id": "QuynhAnh"
}

### remove user
endpoint: PUT http://localhost:8000/v1/cameras/0f964b74-2f5a-4766-bad5-aa8b11a0f09a?delete=true
this return {
    "user_ids": [],
    "room_id": "6d503645-9de8-49a0-8562-3e44324c4405",
    "status": true,
    "name": "Living Room Camera",
    "id": "0f964b74-2f5a-4766-bad5-aa8b11a0f09a"
}

### get all user
endpoint: GET localhost:8000/v1/cameras/all_users
this return: [
    "doan_hue",
    "ho_long",
    "manh_tuan",
    "nhat_tan",
    "QuynhAnh"
]

###  auth user: 
first call endpoint: PUT http://192.168.1.187:8000/v1/cameras/0f964b74-2f5a-4766-bad5-aa8b11a0f09a
this return {
    "user_ids": [
        "QuynhAnh"
    ],
    "room_id": "6d503645-9de8-49a0-8562-3e44324c4405",
    "status": true,
    "name": "Living Room Camera",
    "id": "0f964b74-2f5a-4766-bad5-aa8b11a0f09a"
}

then call: POST localhost:8000/v1/cameras/verify_face
this return: {
    "is_signed_person": "QuynhAnh",
    "confidence_score": 1.0,
    "min_distance_found": 0.0,
    "threshold_used_for_distance": 1.2,
    "confidence_threshold_used": 0.6
}
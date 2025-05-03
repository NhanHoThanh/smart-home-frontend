import React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, ActivityIndicator } from "react-native";
import { useSmartHomeStore } from "@/store/smartHomeStore";
import colors from "@/constants/colors";
import * as Icons from "lucide-react-native";
import { Device } from "@/types/smartHome";
import Slider from "@react-native-community/slider";

interface DeviceCardProps {
  device: Device;
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const COLORS = [
    "[31m#FF0000[0m",
    "[38;5;214m#FFA500[0m",
    "[33m#FFFF00[0m",
    "[32m#00FF00[0m",
    "[34m#0000FF[0m",
    "[35m#4B0082[0m",
    "[35m#EE82EE[0m",
  ];
  const { toggleDevice } = useSmartHomeStore();
  const [showFaceIdModal, setShowFaceIdModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<"pending" | "success" | "fail" | null>(null);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[
      iconName.charAt(0).toUpperCase() + iconName.slice(1)
    ];
    return IconComponent ? (
      <IconComponent
        size={24}
        color={device.status ? colors.primary : colors.inactive}
      />
    ) : null;
  };

  const startFaceRecognition = async () => {
    setIsAuthenticating(true);
    setAuthStatus("pending");
    setShowFaceIdModal(true);

    // Mô phỏng quá trình quét mặt
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mô phỏng kết quả xác thực (thành công hoặc thất bại ngẫu nhiên)
    const isAuthSuccessful = Math.random() > 0.5;

    if (isAuthSuccessful) {
      setAuthStatus("success");
      toggleDevice(device.id);
    } else {
      setAuthStatus("fail");
    }

    // Giữ modal hiển thị trong một khoảng thời gian ngắn sau khi xác thực
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setShowFaceIdModal(false);
    setIsAuthenticating(false);
    setAuthStatus(null); // Reset trạng thái xác thực
  };

  const handlePress = () => {
    if (device.type === "security" && !device.status && !isAuthenticating) {
      startFaceRecognition();
    } else if(device.type === "security" && device.status) {
      // Xử lý trường hợp thiết bị bảo mật đang bật (nếu cần)
      toggleDevice(device.id);
    } 
    else {
      toggleDevice(device.id);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.card, device.status && styles.activeCard]}
        onPress={handlePress}
      >
        <View style={styles.parentIconContainer}>
          <View style={styles.iconContainer}>
            {getIconComponent(device.icon)}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceStatus}>
              {device.status ? "On" : "Off"}
              {device.type === "light" &&
              device.brightness !== undefined &&
              device.status
                ? ` • ${device.brightness}%`
                : ""}
              {device.type === "climate" &&
              device.temperature !== undefined &&
              device.status
                ? ` • ${device.temperature}°C`
                : ""}
            </Text>
          </View>
          <View style={styles.toggleContainer}>
            <View
              style={[
                styles.toggleButton,
                device.status ? styles.toggleActive : styles.toggleInactive,
              ]}
            >
              <View
                style={[
                  styles.toggleCircle,
                  device.status
                    ? styles.toggleCircleActive
                    : styles.toggleCircleInactive,
                ]}
              />
            </View>
          </View>
        </View>
        {device.type === "light" && device.status && (
          <View style={styles.parentControlContainer}>
            <View style={styles.controlsContainer}>
              <Text style={styles.controlLabel}>Brightness</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={device.brightness || 50}
                onValueChange={(value: number) => {
                  useSmartHomeStore
                    .getState()
                    .updateDeviceBrightness(device.id, value);
                }}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
              />

              <View style={styles.controlsContainer}>
                <Text style={styles.controlLabel}>Color</Text>
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={0}
                  maximumValue={COLORS.length - 1}
                  step={1}
                  value={COLORS.indexOf(device.color ?? '')}
                  onValueChange={(value: number) => {
                    const selectedColor = COLORS[value];
                    useSmartHomeStore
                      .getState()
                      .updateDeviceColor(device.id, selectedColor);
                  }}
                  minimumTrackTintColor={device.color}
                  maximumTrackTintColor={device.color}
                  thumbTintColor={device.color}
                />
              </View>

            </View>
          </View>
        )}
        {device.type === "fan" && device.status && (
          <View style={styles.controlsContainer}>
            <Text style={styles.controlLabel}>Fan Speed</Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={device.speed || 50}
              onValueChange={(value: number) => {
                useSmartHomeStore
                  .getState()
                  .updateDeviceSpeed(device.id, value);
              }}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
          </View>
        )}
      </TouchableOpacity>
      <Modal visible={showFaceIdModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          {authStatus === "pending" && (
            <Image
              source={require("@/assets/images/face-id.gif")}
              style={styles.faceIdGif}
              resizeMode="contain"
            />
          )}
          {authStatus === "success" && (
            <Image
              source={require("@/assets/images/face-id-success.gif")}
              style={styles.faceIdGif}
              resizeMode="contain"
            />
          )}
          {authStatus === "fail" && (
            <Image
              source={require("@/assets/images/face-id.gif")} // Bạn có thể dùng một ảnh GIF khác cho trạng thái thất bại nếu có
              style={styles.faceIdGif}
              resizeMode="contain"
            />
          )}

          <Text style={styles.modalText}>
            {authStatus === "pending" && "Đang quét khuôn mặt..."}
            {authStatus === "success" && "Xác thực thành công"}
            {authStatus === "fail" && "Xác thực thất bại"}
          </Text>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  parentIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}10`,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  toggleContainer: {
    marginLeft: 8,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: `${colors.primary}30`,
  },
  toggleInactive: {
    backgroundColor: colors.border,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleCircleActive: {
    backgroundColor: colors.primary,
    alignSelf: "flex-end",
  },
  toggleCircleInactive: {
    backgroundColor: colors.inactive,
    alignSelf: "flex-start",
  },
  parentControlContainer: {
    marginTop: 12,
    width: "100%",
  },
  controlsContainer: {
    marginTop: 12,
    width: "100%",
  },
  controlLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20
  },
  faceIdGif: {
    // width: "100%",
    // height: "80%", // Chiếm phần lớn màn hình
    resizeMode: "contain",
    maxWidth: 150, 
    maxHeight: 150, 
  },
  modalText: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
  },
});
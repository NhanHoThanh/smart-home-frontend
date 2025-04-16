import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
    "#FF0000",
    "#FFA500",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#EE82EE",
  ];
  const { toggleDevice } = useSmartHomeStore();

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

  return (
    <TouchableOpacity
      style={[styles.card, device.status && styles.activeCard]}
      onPress={() => toggleDevice(device.id)}
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
    </TouchableOpacity>
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
});

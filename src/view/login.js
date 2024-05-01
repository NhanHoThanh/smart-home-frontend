// import React, { Component } from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   StyleSheet,
//
//   StatusBar,
// } from "react-native";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../../Button";
const Login = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <ImageBackground
      source={require("../img/background.png")}
      resizeMode="cover"
      style={{
        height: "100%",
        width: "100%",
      }}>
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            style={{
              flex: 1,
              marginHorizontal: 22,
            }}>
            <View
              style={{
                marginVertical: 22,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.black,
                }}>
                {/* Chào mừng bạn! 👋 */}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginVertical: 12,
                color: COLORS.black,
                justifyContent: "center",
              }}>
              ĐĂNG NHẬP
            </Text>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                Địa chỉ email
              </Text>

              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}>
                <TextInput
                  placeholder="Nhập địa chỉ email"
                  placeholderTextColor={COLORS.black}
                  keyboardType="email-address"
                  style={{
                    width: "100%",
                  }}
                />
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                }}>
                Mật khẩu
              </Text>

              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}>
                <TextInput
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={COLORS.black}
                  secureTextEntry={isPasswordShown}
                  style={{
                    width: "100%",
                  }}
                />

                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={{
                    position: "absolute",
                    right: 12,
                  }}>
                  {isPasswordShown == true ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.black} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 6,
              }}>
              <Checkbox
                style={{ marginRight: 8 }}
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? COLORS.primary : undefined}
              />

              <Text>Ghi nhớ đăng nhập</Text>
            </View>

            <Button
              title="Đăng nhập"
              filled
              style={{
                marginTop: 18,
                marginBottom: 4,
              }}
              onPress={() => {
                navigation.navigate("MyTabs");
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 20,
              }}>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: COLORS.primary,
                  marginHorizontal: 10,
                }}
              />
              <Text style={{ fontSize: 14 }}>hoặc đăng nhập bằng</Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: COLORS.primary,
                  marginHorizontal: 10,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}>
              <TouchableOpacity
                onPress={() => console.log("Pressed")}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  height: 52,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  marginRight: 4,
                  borderRadius: 10,
                }}>
                <Image
                  source={require("../img/facebook.png")}
                  style={{
                    height: 36,
                    width: 36,
                    marginRight: 8,
                  }}
                  resizeMode="contain"
                />

                <Text>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => console.log("Pressed")}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  height: 52,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  marginRight: 4,
                  borderRadius: 10,
                }}>
                <Image
                  source={require("../img/google.png")}
                  style={{
                    height: 36,
                    width: 36,
                    marginRight: 8,
                  }}
                  resizeMode="contain"
                />

                <Text>Google</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 22,
              }}>
              <Text style={{ fontSize: 16, color: COLORS.black }}>
                Bạn chưa có tài khoản?{" "}
              </Text>
              <Pressable onPress={() => navigation.navigate("Signup")}>
                <Text
                  style={{
                    fontSize: 17,
                    color: COLORS.primary,
                    fontWeight: "bold",
                    marginLeft: 6,
                  }}>
                  Đăng ký
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Login;

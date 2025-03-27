import React, { useState } from "react";
import {
  View,
  Image,
  ImageBackground,
  Keyboard,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Surface, Text, TextInput, Button, IconButton, TouchableRipple } from 'react-native-paper';
import COLORS from "../../colors";
import { useNavigation } from '@react-navigation/native';  // Add this

const { width } = Dimensions.get("window");

const Login = () => {
  const navigation = useNavigation();  // Add this hook
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Temporary login logic without backend
    if (true) {
      navigation.navigate("MyTabs");
    }
  };

  return (
    <ImageBackground
      source={require("../img/background.png")}
      resizeMode="cover"
      style={styles.backgroundImage}>
      <Pressable onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Surface style={styles.header} elevation={1}>
              <Text variant="titleLarge" style={styles.welcomeText}>Welcome Back! 👋</Text>
              <Text variant="headlineLarge" style={styles.title}>LOGIN</Text>
            </Surface>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Email Address"
                  mode="outlined"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  mode="outlined"
                  placeholder="Enter your password"
                  secureTextEntry={!isPasswordShown}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  right={<TextInput.Icon
                    icon={isPasswordShown ? "eye-off" : "eye"}
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                  />}
                />
              </View>

              <TouchableRipple
                onPress={() => {}}
                style={styles.forgotPassword}>
                <Text variant="bodyLarge" style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableRipple>

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}>
                Login
              </Button>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or login with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableRipple style={styles.socialButton} onPress={() => {}}>
                  <Image
                    source={require("../img/google.png")}
                    style={styles.socialIcon}
                  />
                </TouchableRipple>
                <TouchableRipple style={styles.socialButton} onPress={() => {}}>
                  <Image
                    source={require("../img/facebook.png")}
                    style={styles.socialIcon}
                  />
                </TouchableRipple>
              </View>

              <View style={styles.footer}>
                <Text variant="bodyLarge" style={styles.footerText}>Don't have an account? </Text>
                <TouchableRipple onPress={() => {}}>
                  <Text variant="bodyLarge" style={styles.signupText}>Sign Up</Text>
                </TouchableRipple>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Pressable>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  inputWrapper: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  input: {
    flex: 1,
    height: "100%",
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    marginTop: 12,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
  },
  signupText: {
    fontWeight: "500",
  },
});

export default Login;

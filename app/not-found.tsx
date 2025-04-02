import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();

  const goHome = () => {
    try {
      router.replace('/tabs');
    } catch (e) {
      console.error(e);
      // Fallback to a basic navigation
      window.location.href = '/tabs';
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <TouchableOpacity 
          style={styles.link}
          onPress={goHome}
        >
          <Text style={styles.linkText}>Go to home screen!</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
}); 
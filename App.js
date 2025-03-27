import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import RootComponent from "./src/view/index";
import home from "./src/view/home";
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <StatusBar style="auto" />
      <RootComponent />
    </PaperProvider>
  );
}

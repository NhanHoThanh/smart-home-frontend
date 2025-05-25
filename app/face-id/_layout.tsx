import { Stack } from 'expo-router';
import colors from '@/constants/colors';

export default function FaceIDLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="register"
        options={{
          title: 'Register Face',
        }}
      />
    </Stack>
  );
} 
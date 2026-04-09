import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { VitaminsProvider } from '../VitaminsContext';

export default function RootLayout() {
  return (
    <VitaminsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </VitaminsProvider>
  );
}

import { VitaminsProvider } from '@/VitaminContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function RootLayout() {

  return (
    <VitaminsProvider>
      <Stack>
        <Stack.Screen name="login"/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </VitaminsProvider>
  );
}
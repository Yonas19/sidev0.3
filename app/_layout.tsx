import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Privacy" options={{ headerShown: false }} />
      <Stack.Screen name="CompanyForm" options={{ headerShown: false }} />
      <Stack.Screen name="WorkerForm" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="Company" options={{ headerShown: false }} />
    </Stack>
  );
}

import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="channel/list" options={{ headerShown: false }} />
      <Stack.Screen name="channel/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="image/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="contact/list" options={{ headerShown: false }} />
      <Stack.Screen
        name="route-manifest/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="store-profile/[id]"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="po-data/[id]"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
};

export default RootLayout;

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { RootProvider, useRootContext } from "@/context/RootContext";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { themes } from "@/config/tamagui.config";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootContext />;
}

function RootContext() {
  return (
    <RootProvider>
      <RootLayoutNav />
    </RootProvider>
  );
}

function RootLayoutNav() {
  const { mode } = useRootContext();
  const config = createTamagui({
    ...defaultConfig,
    themes,
  });

  return (
    <ThemeProvider value={mode === "dark" ? DarkTheme : DefaultTheme}>
      <TamaguiProvider
        config={config}
        defaultTheme={mode === "dark" ? "dark" : "light"}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </TamaguiProvider>
    </ThemeProvider>
  );
}

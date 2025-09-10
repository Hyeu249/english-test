import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import {
  Circle,
  ScrollView,
  Square,
  XStack,
  YStack,
  Theme,
  Button,
  Text,
} from "tamagui";
import { useRootContext } from "@/context/RootContext";
import { useRouter } from "expo-router";

export default function TabOneScreen() {
  const { setMode } = useRootContext();
  const router = useRouter();

  return (
    <YStack flex={1}>
      <Text>Tab One</Text>
      <Button
        onPress={() => {
          router.push("/QuizBox");
        }}
      >
        Plain
      </Button>
    </YStack>
  );
}

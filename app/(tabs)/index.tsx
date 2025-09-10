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

export default function TabOneScreen() {
  const { setMode } = useRootContext();
  return (
    <YStack flex={1}>
      <Text>Tab One</Text>
      <Button
        onPress={() =>
          setMode((state) => (state === "dark" ? "light" : "dark"))
        }
      >
        Plain
      </Button>
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

import React from "react";
import { YStack, XStack, Text, Input, Button } from "tamagui";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { BookOpen } from "@tamagui/lucide-icons";

export default function LeftReaderHeader() {
  const router = useRouter();

  return (
    <XStack
      onPress={() => router.back()}
      borderWidth={1}
      borderColor={"$black4"}
      marginLeft={"$6"}
      paddingVertical={"$2"}
      paddingHorizontal={"$3"}
      borderRadius={30}
      alignItems="center"
      cursor="pointer"
    >
      <BookOpen size={19} />
      <Text marginLeft="$2" fontWeight={"500"} fontSize={14}>
        Kindgaye Library
      </Text>
    </XStack>
  );
}

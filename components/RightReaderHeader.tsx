import React, { useState } from "react";
import { XStack, YStack, Text, Button } from "tamagui";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Notebook, Expand } from "@tamagui/lucide-icons";
import { handlePickDocument } from "@/api/action";

type Props = {
  setOpenOutline: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLayoutEditer: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RightReaderHeader({
  setOpenOutline,
  setOpenLayoutEditer,
}: Props) {
  return (
    <XStack gap="$1" paddingRight="$4">
      <Button
        size="$3"
        backgroundColor="transparent"
        onPress={() => setOpenOutline((prev) => !prev)}
      >
        <FontAwesome name="list-ul" size={18} color="#000" />
      </Button>
      <Button
        size="$3"
        backgroundColor="transparent"
        onPress={handlePickDocument}
      >
        <FontAwesome name="search" size={18} color="#000" />
      </Button>
      <Button
        size="$3"
        backgroundColor="transparent"
        onPress={() => setOpenLayoutEditer((prev) => !prev)}
      >
        <FontAwesome name="font" size={18} color="#000" />
      </Button>
      <Button size="$3" backgroundColor="transparent">
        <Notebook size={18} color="#000" />
      </Button>
      <Button size="$3" backgroundColor="transparent">
        <Expand size={18} color="#000" />
      </Button>
      <Button size="$3" backgroundColor="transparent">
        <FontAwesome name="ellipsis-v" size={18} color="#000" />
      </Button>
    </XStack>
  );
}

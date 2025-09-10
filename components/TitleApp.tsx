import React from "react";
import { YStack, XStack, Text, Input, Button } from "tamagui";

export default function TitleApp() {
  return (
    <XStack alignItems="center">
      <Text fontFamily="$Bookerly" fontSize={18} fontWeight="400">
        Kindgaye
      </Text>

      <Input
        width={300}
        marginLeft="$8"
        height={36}
        borderRadius={3}
        backgroundColor="$white1"
        placeholder="Search your gaye"
        borderColor={"$white7"}
      />
    </XStack>
  );
}

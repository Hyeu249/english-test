import React, { useState, useEffect } from "react";
import { YStack, XStack, Text, Input, Button } from "tamagui";
import { useAIVoiceContext } from "@/context/AIVoiceContext";
import {
  SystemVoiceProvider,
  useSystemVoiceContext,
} from "@/context/SystemVoiceContext";
import { useReadingContext } from "@/context/ReadingContext";

export default function SliderPlayButton({
  marginLeft = 0,
  marginRight = 0,
}: {
  marginLeft?: number;
  marginRight?: number;
}) {
  const { isAiVoice } = useReadingContext();
  const { isPlay: isPlay1, togglePlay: togglePlay1 } = useAIVoiceContext();
  const { isPlay: isPlay2, togglePlay: togglePlay2 } = useSystemVoiceContext();
  const isPlay = isAiVoice ? isPlay1 : isPlay2;
  const togglePlay = isAiVoice ? togglePlay1 : togglePlay2;

  return (
    <XStack
      width={70}
      height={70}
      borderWidth={1}
      borderRadius={6}
      marginLeft={marginLeft}
      marginRight={marginRight}
      justifyContent="center"
      alignItems="center"
      padding={"$1"}
      boxShadow={"rgb(0 0 0 / 32%) 0px 2px 4px 0px"}
      cursor="pointer"
      userSelect="none"
      pressStyle={{
        scale: 0.95,
      }}
      onPress={togglePlay}
    >
      <Text textAlign="center" fontSize={14}>
        {isPlay ? "Stop" : "Play"}
      </Text>
    </XStack>
  );
}

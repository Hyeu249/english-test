import React, { useState } from "react";
import {
  YStack,
  XStack,
  ScrollView,
  Text,
  AnimatePresence,
  Button,
  Separator,
  Slider,
  View,
  Circle,
} from "tamagui";
import { SquareMinus, SquareEqual } from "@tamagui/lucide-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useReadingContext } from "@/context/ReadingContext";

export function OutlneRow({
  line,
  paddingLeft = 0,
}: {
  line: any;
  paddingLeft?: number;
}) {
  const { setIdnum } = useReadingContext();

  return (
    <XStack
      padding={15}
      marginBottom={"$1"}
      borderRadius={7}
      hoverStyle={{
        backgroundColor: "$blue3",
        cursor: "pointer",
      }}
      pressStyle={{
        backgroundColor: "$blue1",
      }}
      onPress={() => setIdnum(line.idnum)}
    >
      <Text
        fontSize={14}
        fontWeight="400"
        paddingLeft={paddingLeft}
        fontFamily={"$AmazonEmber"}
      >
        {line.title}
      </Text>
    </XStack>
  );
}
export function Line({ line, text }: { text: string; line: any }) {
  const isArray = Array.isArray(line);

  if (isArray) {
    return line.map((res: any, index) => (
      <OutlneRow key={index} line={res} paddingLeft={16} />
    ));
  }
  return <OutlneRow line={line} />;
}

export default function Outline() {
  const { outline } = useReadingContext();

  return (
    <YStack flex={1}>
      <Text fontSize={16} fontWeight={"600"} padding={15}>
        Tables of Contents
      </Text>
      <ScrollView paddingBottom={10}>
        {outline.map((line, index) => (
          <Line key={index} text="Review" line={line} />
        ))}
      </ScrollView>
    </YStack>
  );
}

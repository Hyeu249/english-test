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

type Props = {
  outline: any[];
  setIdnum: React.Dispatch<React.SetStateAction<number>>;
};
export function OutlneRow({
  line,
  paddingLeft = 0,
  setIdnum,
}: {
  line: any;
  paddingLeft?: number;
  setIdnum: React.Dispatch<React.SetStateAction<number>>;
}) {
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
export function Line({
  line,
  text,
  setIdnum,
}: {
  text: string;
  line: any;
  setIdnum: React.Dispatch<React.SetStateAction<number>>;
}) {
  const isArray = Array.isArray(line);

  if (isArray) {
    return line.map((res: any, index) => (
      <OutlneRow key={index} line={res} paddingLeft={16} setIdnum={setIdnum} />
    ));
  }
  return <OutlneRow line={line} setIdnum={setIdnum} />;
}

export default function Outline({ outline, setIdnum }: Props) {
  return (
    <YStack flex={1}>
      <Text fontSize={16} fontWeight={"600"} padding={15}>
        Tables of Contents
      </Text>
      <ScrollView paddingBottom={10}>
        {outline.map((line, index) => (
          <Line key={index} text="Review" line={line} setIdnum={setIdnum} />
        ))}
      </ScrollView>
    </YStack>
  );
}

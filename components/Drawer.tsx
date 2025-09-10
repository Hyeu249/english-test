import React, { useState, useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { YStack, ZStack, Text } from "tamagui";
import { X } from "@tamagui/lucide-icons";

type DrawerProps = {
  padding?: number;
  children: React.ReactNode;
  side?: "right" | "left" | "bottom";
  size?: number;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DrawerWrapper({
  children,
  padding = 24,
  side = "right",
  size = 400,
  isOpen = false,
  setOpen,
}: DrawerProps) {
  const offset = useSharedValue(isOpen ? 0 : size);

  useEffect(() => {
    offset.value = withTiming(isOpen ? 0 : size, { duration: 250 });
  }, [isOpen]);

  // Drawer animation style
  const drawerStyle = useAnimatedStyle(() => {
    const base = { position: "absolute", zIndex: 100 } as const;
    switch (side) {
      case "left":
        return {
          ...base,
          top: 0,
          bottom: 0,
          left: 0,
          width: size,
          transform: [{ translateX: -offset.value }],
        };
      case "bottom":
        return {
          ...base,
          left: 0,
          right: 0,
          bottom: 0,
          height: size,
          transform: [{ translateY: offset.value }],
        };
      default: // right
        return {
          ...base,
          top: 0,
          bottom: 0,
          right: 0,
          width: size,
          transform: [{ translateX: offset.value }],
        };
    }
  });

  return (
    <Animated.View style={drawerStyle}>
      {/* Drawer content */}
      <YStack
        flex={1}
        background="$background"
        padding={padding}
        gap="$4"
        boxShadow={"0 2px 4px 0 rgba(0,0,0,.4)"}
      >
        {children}
      </YStack>

      {/* Nút X nằm ngoài mép drawer */}
      {isOpen && <CloseButton side={side} setOpen={setOpen} />}
    </Animated.View>
  );
}
export function CloseButton({
  setOpen,
  side,
}: {
  side: "right" | "left" | "bottom";
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // Vị trí nút X trồi ra ngoài
  const closeBtnPos: Record<string, any> = {
    right: { left: -55, top: 20 },
    left: { right: -55, top: 20 },
    bottom: { top: -55, right: 20 },
  };

  return (
    <YStack
      position="absolute"
      {...closeBtnPos[side]}
      onPress={() => setOpen((prev) => !prev)}
      borderRadius={9999}
      height={45}
      width={45}
      background="$white1"
      alignItems="center"
      justifyContent="center"
      boxShadow={"0 2px 4px 0 rgba(0,0,0,.4)"}
      elevation={4}
      cursor="pointer"
      userSelect="none"
    >
      <X size={25} color={"#050505"} />
    </YStack>
  );
}

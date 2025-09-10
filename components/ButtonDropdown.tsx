import React, { useState } from "react";
import {
  ScrollView,
  XStack,
  YStack,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "tamagui";

type Option = {
  label: string;
  value: string;
  onSelect: (value: string) => void;
};

type DropdownOption = {
  title?: string;
  icon?: React.ReactNode;
  options: Option[];
  value: string;
};

export default function ButtonDropdown({
  title,
  icon,
  value,
  options,
}: DropdownOption) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="$3" backgroundColor="transparent">
          <XStack alignItems="center" gap="$2">
            {icon && icon}
            {title && <Text>{title}</Text>}
          </XStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          "quick",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        padding={"$2"}
      >
        <YStack cursor="pointer" gap="$1" minWidth={240} maxHeight={500}>
          <ScrollView style={{ paddingBottom: 20 }}>
            {options.map((res) => {
              return (
                <PopoverClose asChild key={res.value}>
                  <XStack
                    onPress={() => res.onSelect(res.value)}
                    hoverStyle={{
                      backgroundColor:
                        value === res.value ? "#D0E8FF" : "$blue3",
                    }}
                    backgroundColor={
                      value === res.value ? "#D0E8FF" : "transparent"
                    }
                    paddingHorizontal={14}
                    paddingVertical={12}
                    borderRadius={"$4"}
                  >
                    <Text>{res.label}</Text>
                  </XStack>
                </PopoverClose>
              );
            })}
          </ScrollView>
        </YStack>
      </PopoverContent>
    </Popover>
  );
}

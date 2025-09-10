import React, { useState } from "react";
import {
  XStack,
  YStack,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "tamagui";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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

export function ButtonDropdown({
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
        <YStack cursor="pointer" gap="$1" minWidth={240}>
          {options.map((res) => {
            return (
              <PopoverClose asChild key={res.value}>
                <XStack
                  onPress={() => res.onSelect(res.value)}
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
        </YStack>
      </PopoverContent>
    </Popover>
  );
}

export default function RightAppHeader() {
  const [filter, setFilter] = useState("Kindgayeunlimited");
  return (
    <XStack gap="$3" paddingRight="$4">
      <ButtonDropdown
        title="Filter"
        icon={<FontAwesome name="sliders" size={18} color="#000" />}
        options={[
          {
            label: "Kindgaye Unlimited",
            value: "Kindgayeunlimited",
            onSelect: () => setFilter("Kindgayeunlimited"),
          },
          {
            label: "Prime",
            value: "prime",
            onSelect: () => setFilter("prime"),
          },
          {
            label: "Comixology Unlimited",
            value: "comixologyunlimited",
            onSelect: () => setFilter("comixologyunlimited"),
          },
        ]}
        value={filter}
      />

      <ButtonDropdown
        title="Sort by: Recent"
        icon={<FontAwesome name="sort" size={18} color="#000" />}
        options={[
          { label: "Filter by Date", value: "date", onSelect: () => {} },
          {
            label: "Filter by Category",
            value: "category",
            onSelect: () => {},
          },
          { label: "Filter by Price", value: "price", onSelect: () => {} },
        ]}
        value={"date"}
      />

      <ButtonDropdown
        title="View"
        icon={<FontAwesome name="th-large" size={18} color="#000" />}
        options={[
          { label: "Filter by Date", value: "date", onSelect: () => {} },
          {
            label: "Filter by Category",
            value: "category",
            onSelect: () => {},
          },
          { label: "Filter by Price", value: "price", onSelect: () => {} },
        ]}
        value={"date"}
      />

      <ButtonDropdown
        icon={<FontAwesome name="shopping-cart" size={18} color="#000" />}
        options={[
          { label: "Filter by Date", value: "date", onSelect: () => {} },
          {
            label: "Filter by Category",
            value: "category",
            onSelect: () => {},
          },
          { label: "Filter by Price", value: "price", onSelect: () => {} },
        ]}
        value={"date"}
      />

      <ButtonDropdown
        icon={<FontAwesome name="ellipsis-v" size={18} color="#000" />}
        options={[
          { label: "Filter by Date", value: "date", onSelect: () => {} },
          {
            label: "Filter by Category",
            value: "category",
            onSelect: () => {},
          },
          { label: "Filter by Price", value: "price", onSelect: () => {} },
        ]}
        value={"date"}
      />
    </XStack>
  );
}

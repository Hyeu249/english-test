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
import ButtonDropdown from "@/components/ButtonDropdown";
import { handlePickDocument } from "@/api/action";

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
          {
            label: "Tải sách lên",
            value: "load_pdf",
            onSelect: handlePickDocument,
          },
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

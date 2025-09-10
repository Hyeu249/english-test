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
import { Font, Margin, Column } from "@/types";

type Props = {
  font: string;
  setFont: React.Dispatch<React.SetStateAction<Font>>;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  margin: Margin;
  setMargin: React.Dispatch<React.SetStateAction<Margin>>;
  height: number;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  column: Column;
  setColumn: React.Dispatch<React.SetStateAction<Column>>;
};

export default function LayoutEditer({
  font,
  setFont,
  size,
  setSize,
  margin,
  setMargin,
  height,
  setHeight,
  column,
  setColumn,
}: Props) {
  return (
    <ScrollView flex={1}>
      <FontEditer font={font} setFont={setFont} />

      <Divider />
      <FontSizeEditer size={size} setSize={setSize} />

      <Divider />
      <PageColorEditer />

      <Divider />
      <ColumnEditer column={column} setColumn={setColumn} />

      <Divider />
      <MarginEditor margin={margin} setMargin={setMargin} />

      <Divider />
      <LineSpacingEditer height={height} setHeight={setHeight} />
    </ScrollView>
  );
}

type MarginProps = {
  margin: Margin;
  setMargin: React.Dispatch<React.SetStateAction<Margin>>;
};
export function MarginEditor({ margin, setMargin }: MarginProps) {
  const narrow = 0;
  const medium = 50;
  const wide = 100;
  return (
    <YStack width={"65%"}>
      <Text fontSize={16} fontWeight={"600"}>
        Margin
      </Text>
      <XStack marginTop={"$7"} justifyContent="space-between">
        <YStack
          justifyContent="center"
          alignItems="center"
          onPress={() => setMargin(narrow)}
        >
          <MarginSelector size="narrow" selected={margin == narrow} />
          <Text fontSize={13} marginTop={"$1.5"}>
            Narrow
          </Text>
        </YStack>
        <YStack
          justifyContent="center"
          alignItems="center"
          onPress={() => setMargin(medium)}
        >
          <MarginSelector size="medium" selected={margin == medium} />
          <Text fontSize={13} marginTop={"$1.5"}>
            Medium
          </Text>
        </YStack>

        <YStack
          justifyContent="center"
          alignItems="center"
          onPress={() => setMargin(wide)}
        >
          <MarginSelector size="wide" selected={margin == wide} />
          <Text fontSize={13} marginTop={"$1.5"}>
            Wide
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}

type FontProps = {
  font: string;
  setFont: React.Dispatch<React.SetStateAction<Font>>;
};

export function FontEditer({ font, setFont }: FontProps) {
  const fonts = ["Bookerly", "AmazonEmber", "Bookerly2"];
  return (
    <YStack>
      <Text fontSize={16} fontWeight={"600"}>
        Font
      </Text>

      <XStack
        marginTop={"$2"}
        alignItems="center"
        justifyContent="space-between"
        width={"70%"}
      >
        {fonts.map((fontResult, index) => {
          return (
            <YStack
              key={index}
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              userSelect="none"
              onPress={() => setFont(fontResult as any)}
            >
              <Text
                fontSize={35}
                lineHeight={45}
                fontFamily={`$${fontResult}`}
                textDecorationLine={font == fontResult ? "underline" : "unset"}
                color={font == fontResult ? "#1d78ba" : ""}
              >
                Aa
              </Text>
              <Text
                fontSize={12}
                fontWeight={font == fontResult ? "600" : ""}
                color={font == fontResult ? "#1d78ba" : ""}
              >
                {fontResult}
              </Text>
            </YStack>
          );
        })}
      </XStack>
    </YStack>
  );
}
const Divider = () => (
  <Separator marginVertical={"$4"} backgroundColor={"$black11"} />
);

type SizeProps = {
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
};
export function FontSizeEditer({ size, setSize }: SizeProps) {
  return (
    <XStack
      marginVertical={"$2"}
      alignItems="center"
      justifyContent="space-between"
      width={"90%"}
    >
      {/* Chữ a ở đầu */}
      <Text marginRight={"$5"} fontSize={16}>
        A
      </Text>

      {/* Slider */}
      <Slider
        flex={1}
        defaultValue={[50]}
        max={70}
        step={1}
        value={[size]}
        onValueChange={(vals) => {
          setSize(vals[0]);
        }}
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb size="$2" index={0} circular />
      </Slider>

      {/* Chữ b ở cuối */}
      <Text marginLeft={"$5"} fontSize={26}>
        A
      </Text>
    </XStack>
  );
}

type LineSpacingProps = {
  height: number;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
};
export function LineSpacingEditer({ height, setHeight }: LineSpacingProps) {
  return (
    <YStack>
      <Text fontSize={16} fontWeight={"600"} marginBottom={"$7"}>
        Line Spacing
      </Text>

      {/* Slider */}
      <Slider
        flex={1}
        defaultValue={[50]}
        min={17}
        max={70}
        step={1}
        value={[height]}
        onValueChange={(vals) => {
          setHeight(vals[0]);
        }}
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb size="$2" index={0} circular />
      </Slider>
    </YStack>
  );
}

export function PageColorEditer() {
  const [color, setColor] = useState<
    "$white1" | "$black1" | "#fbefd8" | "#c5e7ce"
  >("$white1");

  const colors = ["$white1", "$black1", "#fbefd8", "#c5e7ce"];

  return (
    <YStack width={"70%"}>
      <Text fontSize={16} fontWeight={"600"}>
        Page Color
      </Text>

      <XStack
        marginTop={"$3"}
        justifyContent="space-between"
        alignItems="center"
        userSelect="none"
      >
        {colors.map((res, index) => {
          return (
            <Circle
              key={index}
              size={"$3.5"}
              backgroundColor={res}
              borderWidth={1}
              borderColor={color == res ? "$black11" : "transparent"}
              cursor="pointer"
              onPress={() => setColor(res as any)}
            />
          );
        })}
      </XStack>
    </YStack>
  );
}
export function TwoPageIcon({ selected = false }: { selected: boolean }) {
  return (
    <YStack
      width={60}
      height={40}
      justifyContent="center"
      alignItems="center"
      borderRadius={4}
      borderWidth={selected ? 2 : 1.5}
      borderColor={selected ? "#1d78ba" : "transparent"}
      cursor="pointer"
    >
      <XStack
        width={45}
        height={25}
        borderWidth={1.5}
        borderColor={selected ? "#1d78ba" : "transparent"}
      >
        {/* Trang trái */}
        <YStack
          flex={1}
          borderRightWidth={1.5}
          borderColor={selected ? "#1d78ba" : "transparent"}
          justifyContent="center"
          padding="$1"
          gap="$1"
        >
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
        </YStack>

        {/* Trang phải */}
        <YStack flex={1} justifyContent="center" padding="$1" gap="$1">
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
        </YStack>
      </XStack>
    </YStack>
  );
}
export function OnePageIcon({ selected = false }: { selected: boolean }) {
  return (
    <YStack
      width={60}
      height={40}
      justifyContent="center"
      alignItems="center"
      borderRadius={4}
      cursor="pointer"
      borderWidth={selected ? 2 : 1.5}
      borderColor={selected ? "#1d78ba" : "transparent"}
    >
      <XStack
        width={30}
        height={25}
        borderWidth={1.5}
        borderColor={selected ? "#1d78ba" : "transparent"}
      >
        <YStack flex={1} justifyContent="center" padding="$1" gap="$1">
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
          <YStack
            height={1.5}
            backgroundColor={selected ? "#1d78ba" : "$black1"}
          />
        </YStack>
      </XStack>
    </YStack>
  );
}
type ColumnProps = {
  column: Column;
  setColumn: React.Dispatch<React.SetStateAction<Column>>;
};
export function ColumnEditer({ column, setColumn }: ColumnProps) {
  return (
    <YStack width={"50%"}>
      <Text fontSize={16} fontWeight={"600"}>
        Layout
      </Text>
      <XStack marginTop={"$7"} justifyContent="space-between">
        <YStack
          justifyContent="center"
          alignItems="center"
          onPress={() => setColumn(2)}
        >
          <TwoPageIcon selected={column == 2} />
          <Text fontSize={13} marginTop={"$1.5"}>
            Two Colunms
          </Text>
        </YStack>
        <YStack
          justifyContent="center"
          alignItems="center"
          onPress={() => setColumn(1)}
        >
          <OnePageIcon selected={column == 1} />
          <Text fontSize={13} marginTop={"$1.5"}>
            One Colunms
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}

export function MarginSelector({
  selected = false,
  size,
}: {
  size: "narrow" | "medium" | "wide";
  selected: boolean;
}) {
  const padding = { narrow: "$2", medium: "$4", wide: "$5" };
  return (
    <YStack
      width={60}
      height={40}
      justifyContent="center"
      alignItems="center"
      borderRadius={4}
      cursor="pointer"
      borderWidth={selected ? 2 : 1.5}
      borderColor={selected ? "#1d78ba" : "$black1"}
      paddingHorizontal={padding[size]}
      gap={"$1.5"}
    >
      <YStack
        width={"100%"}
        height={1.5}
        backgroundColor={selected ? "#1d78ba" : "$black1"}
      />
      <YStack
        width={"100%"}
        height={1.5}
        backgroundColor={selected ? "#1d78ba" : "$black1"}
      />
      <YStack
        width={"100%"}
        height={1.5}
        backgroundColor={selected ? "#1d78ba" : "$black1"}
      />
      <YStack
        width={"100%"}
        height={1.5}
        backgroundColor={selected ? "#1d78ba" : "$black1"}
      />
    </YStack>
  );
}

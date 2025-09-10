import React, { useState, useEffect } from "react";
import {
  YStack,
  XStack,
  ScrollView,
  Text,
  AnimatePresence,
  Button,
  Separator,
  Slider,
} from "tamagui";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import RightReaderHeader from "@/components/RightReaderHeader";
import LeftReaderHeader from "@/components/LeftReaderHeader";
import Paper from "@/components/Paper";
import Drawer from "@/components/Drawer";
import LayoutEditer from "@/components/LayoutEditer";
import Outline from "@/components/Outline";
import { getDocList } from "@/api/action";
import { Font, Margin, Column, Language } from "@/types";
import { ReadingProvider, useReadingContext } from "@/context/ReadingContext";
import { AIVoiceProvider } from "@/context/AIVoiceContext";
import {
  SystemVoiceProvider,
  useSystemVoiceContext,
} from "@/context/SystemVoiceContext";
import SliderPlayButton from "@/components/SliderPlayButton";

export function DrawersHeader({
  font,
  margin,
  height,
  size,
  setSize,
  column,
  setFont,
  setMargin,
  setHeight,
  setColumn,
}: {
  margin: Margin;
  height: number;
  font: string;
  size: number;
  column: Column;
  setMargin: React.Dispatch<React.SetStateAction<Margin>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  setFont: React.Dispatch<React.SetStateAction<Font>>;
  setColumn: React.Dispatch<React.SetStateAction<Column>>;
}) {
  const { language, setLanguage, title } = useReadingContext();
  const { voice, setVoice } = useSystemVoiceContext();

  const navigation = useNavigation();
  const [openLayoutEditer, setOpenLayoutEditer] = useState(false);
  const [openOutline, setOpenOutline] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerShadowVisible: false,
      headerTitleAlign: "center",
      headerLeft: () => <LeftReaderHeader />,
      headerTitle: () => (
        <Text fontWeight={"400"} fontSize={22}>
          {title}
        </Text>
      ),
      headerRight: () => (
        <RightReaderHeader
          voice={voice}
          setVoice={setVoice}
          language={language}
          setLanguage={setLanguage}
          setOpenOutline={setOpenOutline}
          setOpenLayoutEditer={setOpenLayoutEditer}
        />
      ),
    });
  }, [title, voice]);

  return (
    <>
      <Drawer isOpen={openLayoutEditer} setOpen={setOpenLayoutEditer}>
        <LayoutEditer
          font={font}
          setFont={setFont}
          size={size}
          setSize={setSize}
          margin={margin}
          setMargin={setMargin}
          height={height}
          setHeight={setHeight}
          column={column}
          setColumn={setColumn}
        />
      </Drawer>
      <Drawer padding={10} isOpen={openOutline} setOpen={setOpenOutline}>
        <Outline />
      </Drawer>
    </>
  );
}
export default function RootReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ReadingProvider id={id}>
      <AIVoiceProvider>
        <SystemVoiceProvider>
          <ReaderScreen id={id} />
        </SystemVoiceProvider>
      </AIVoiceProvider>
    </ReadingProvider>
  );
}

export function ReaderScreen({ id }: { id: string }) {
  const { page, setPage, length } = useReadingContext();
  const [oldPage, setOldPage] = useState(1);
  const [font, setFont] = useState<Font>("Bookerly");
  const [size, setSize] = useState<number>(18);
  const [margin, setMargin] = useState<Margin>(100);
  const [height, setHeight] = useState<number>(36);
  const [column, setColumn] = useState<Column>(2);

  return (
    <YStack flex={1} backgroundColor={"$background"}>
      <DrawersHeader
        font={font}
        setFont={setFont}
        size={size}
        setSize={setSize}
        margin={margin}
        setMargin={setMargin}
        height={height}
        setHeight={setHeight}
        column={column}
        setColumn={setColumn}
      />
      <XStack flex={1}>
        <MoveTab
          type="left"
          onPress={() => setPage((prev) => (prev > 1 ? prev - 1 : 1))}
        />
        <XStack flex={1}>
          <Paper
            font={font}
            size={size}
            margin={margin}
            height={height}
            column={column}
          />
        </XStack>
        <MoveTab
          type="right"
          isBookmark={true}
          onPress={() => setPage((prev) => (prev < length ? prev + 1 : prev))}
        />
      </XStack>
      <YStack height={106}>
        <XStack
          width={"100%"}
          alignItems="center"
          paddingLeft={70}
          paddingRight={150}
        >
          <XStack
            width={70}
            height={70}
            borderWidth={1}
            borderRadius={6}
            marginRight={20}
            justifyContent="center"
            alignItems="center"
            padding={"$1"}
            boxShadow={"rgb(0 0 0 / 32%) 0px 2px 4px 0px"}
            cursor="pointer"
            userSelect="none"
            pressStyle={{
              scale: 0.95,
            }}
            onPress={() => setPage(oldPage)}
          >
            <Text textAlign="center" fontSize={14}>
              Back to {oldPage}
            </Text>
          </XStack>
          <Progress
            value={page}
            onChange={(value) => {
              setOldPage(page);
              setPage(value);
            }}
            max={length}
          />
          <SliderPlayButton marginLeft={20} />
        </XStack>
        <XStack justifyContent="center">
          <Text fontSize={12}>
            Page {page} of {length} • {Math.round((page / (length - 1)) * 100)}%
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}

export function Progress({
  max,
  value,
  onChange,
}: {
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Slider
      flex={1}
      defaultValue={[50]}
      value={[value]}
      min={1}
      max={max}
      step={1}
      onValueChange={(vals) => {
        onChange(vals[0]);
      }}
    >
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb size="$2" index={0} circular />
    </Slider>
  );
}
export function Bookmark() {
  const [isMark, setIsMark] = useState(false);

  return (
    <YStack
      onPress={() => setIsMark((prev) => !prev)}
      userSelect="none"
      cursor="pointer"
    >
      {isMark ? (
        <FontAwesome size={24} name={"bookmark"} color="#1d78ba" />
      ) : (
        <FontAwesome size={24} name={"bookmark-o"} />
      )}
    </YStack>
  );
}

export function MoveTab({
  type,
  onPress,
  isBookmark = false,
}: {
  type: "left" | "right";
  onPress?: () => void;
  isBookmark?: boolean;
}) {
  return (
    <YStack width={153} justifyContent="space-between" alignItems="center">
      {isBookmark ? <Bookmark /> : <YStack></YStack>}
      <YStack
        justifyContent="center"
        alignItems="center"
        width={50}
        height={50}
        borderRadius={100}
        borderWidth={1}
        borderColor="#8e8e93"
        cursor="pointer"
        hoverStyle={{
          backgroundColor: "#f2f2f7",
          borderColor: "#6c6c70",
        }}
        pressStyle={{
          scale: 0.95,
        }}
        onPress={onPress}
        userSelect="none"
      >
        <FontAwesome
          size={34}
          name={type === "left" ? "angle-left" : "angle-right"}
          color="#8e8e93"
        />
      </YStack>
      <YStack></YStack>
    </YStack>
  );
}

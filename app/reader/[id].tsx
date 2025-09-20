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

export function DrawersHeader({
  title,
  outline,
  id,
  setIdnum,
}: {
  title: string;
  outline: any[];
  id: string;
  setIdnum: React.Dispatch<React.SetStateAction<number>>;
}) {
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
          setOpenOutline={setOpenOutline}
          setOpenLayoutEditer={setOpenLayoutEditer}
        />
      ),
    });
  }, [title]);

  return (
    <>
      <Drawer isOpen={openLayoutEditer} setOpen={setOpenLayoutEditer}>
        <LayoutEditer />
      </Drawer>
      <Drawer padding={10} isOpen={openOutline} setOpen={setOpenOutline}>
        <Outline outline={outline} setIdnum={setIdnum} />
      </Drawer>
    </>
  );
}
export default function ReaderScreen() {
  const [idnum, setIdnum] = useState(0);
  const [oldPage, setOldPage] = useState(1);
  const [page, setPage] = useState(16);
  const [text, setText] = useState("");
  const [title, setTitle] = useState<string>("");
  const [outline, setOutline] = useState<any[]>([]);
  const [length, setLength] = useState<number>(0);

  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    const init = async () => {
      const book = await getDocList(
        "studio.sheet",
        [["id", "=", id]],
        ["name", "outline", "page_ids"]
      );
      if (book.length) setTitle(book[0].name);
      if (book.length) setOutline(book[0].outline);
      if (book.length) setLength(book[0].page_ids.length);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const data = await getDocList(
        "studio.page",
        [
          ["book_id", "=", Number(id)],
          ["page", "=", page],
        ],
        ["text"]
      );

      if (!data.length) return;
      setText(data[0].text);
    };

    init();
  }, [page]);

  useEffect(() => {
    const init = async () => {
      const data = await getDocList(
        "studio.page",
        [
          ["book_id", "=", Number(id)],
          ["idnum", "=", idnum],
        ],
        ["page"]
      );

      if (!data.length) return;
      setPage(data[0].page);
    };

    if (idnum != 0) init();
  }, [idnum]);

  return (
    <YStack flex={1} backgroundColor={"$background"}>
      <DrawersHeader
        id={id}
        setIdnum={setIdnum}
        title={title}
        outline={outline}
      />
      <XStack flex={1}>
        <MoveTab
          type="left"
          onPress={() => setPage((prev) => (prev > 1 ? prev - 1 : 1))}
        />
        <XStack flex={1}>
          <Paper text={text} />
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
        console.log("Đang chọn:", vals[0]);
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

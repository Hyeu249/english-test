// App.tsx
import React, { useState, useEffect } from "react";
import {
  TamaguiProvider,
  YStack,
  XStack,
  ScrollView,
  Text,
  AnimatePresence,
} from "tamagui";
import { Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import TitleApp from "@/components/TitleApp";
import RightAppHeader from "@/components/RightAppHeader";
import { BookOpen } from "@tamagui/lucide-icons";
import { getDocList, url } from "@/api/action";

const rawBooks = [
  {
    title: "Sapiens [Tenth Anniver…",
    author: "Harari, Yuval Noah",
    image: "https://m.media-amazon.com/images/I/41heRvvFOtL._SY400_.jpg",
    sample: false,
  },
  {
    title: "The Lean Startup: How …",
    author: "Ries, Eric",
    image: "https://m.media-amazon.com/images/I/51N-u8AsmdL._SY400_.jpg",
    sample: true,
  },
  {
    title: "How to Win Friends an…",
    author: "CARNEGIE, DALE",
    image: "https://m.media-amazon.com/images/I/41SAdhgPwRL._SY400_.jpg",
    sample: false,
  },
  {
    title: "Secrets of Professional …",
    author: "Little, Jonathan",
    image: "https://m.media-amazon.com/images/I/51dow32cp4L._SY400_.jpg",
    sample: false,
  },
  {
    title: "Zero to One: Notes on …",
    author: "Thiel, Peter; Masters, Blake",
    image: "https://m.media-amazon.com/images/I/41PZRSHF-NL._SY400_.jpg",
    sample: true,
  },
  {
    title: "Blue Ocean Strategy, E…",
    author: "W. Chan Kim",
    image: "https://m.media-amazon.com/images/I/51-HhCCG6CL._SY400_.jpg",
    sample: true,
  },
  {
    title: "Atomic Habits: An Easy…",
    author: "James Clear",
    image: "https://m.media-amazon.com/images/I/51b4CfdTSDL._SY400_.jpg",
    sample: true,
  },
  {
    title: "Disrupt You!: Master Pe…",
    author: "Jay Samit",
    image: "https://m.media-amazon.com/images/I/513VYZazC8L._SY400_.jpg",
    sample: false,
  },
  {
    title: "Crossing The Chasm, 3r…",
    author: "Geoffrey A. Moore",
    image: "https://m.media-amazon.com/images/I/41qAc+VG7SL._SY400_.jpg",
    sample: true,
  },
  {
    title: "The Psychology of Mon…",
    author: "Morgan Housel",
    image: "https://m.media-amazon.com/images/I/418fUvCTllL._SY400_.jpg",
    sample: true,
  },
];

const titles = ["All Titles", "Books", "Comics", "Samples"];

export default function App() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <TitleApp />,
      headerRight: () => <RightAppHeader />,
    });
  }, []);

  return (
    <XStack flex={1}>
      <YStack
        backgroundColor="$white1"
        padding="$2"
        width={230}
        cursor="pointer"
      >
        <LibraryTitleWithTopics />
        <NoteAndHighlight />
      </YStack>
      <YStack background="#e3e5ec" flex={1}>
        <ScrollView>
          <BookGrid />
        </ScrollView>
      </YStack>
    </XStack>
  );
}

function LibraryTitleWithTopics() {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      {/* Title */}
      <XStack
        alignItems="center"
        paddingTop={"$4"}
        paddingBottom={"$5"}
        borderRadius="$2"
        paddingLeft={"$4"}
      >
        <BookOpen size={22} color="#1d78ba" />
        <Text marginLeft="$3" fontWeight={"600"} fontSize={14}>
          Library
        </Text>
        <XStack
          marginLeft="auto"
          marginRight={"$2"}
          userSelect="none"
          onPress={() => setExpanded((prev) => !prev)}
        >
          <FontAwesome
            size={18}
            name={expanded ? "angle-down" : "angle-right"}
            color="gray"
          />
        </XStack>
      </XStack>

      {/* Animated Topics */}
      <AnimatePresence>
        {expanded && (
          <YStack
            key="topics"
            animation="bouncy"
            enterStyle={{ opacity: 0, y: -10 }}
            exitStyle={{ opacity: 0, y: -10 }}
          >
            <Topic />
          </YStack>
        )}
      </AnimatePresence>
    </>
  );
}

function Topic() {
  const [selected, setSelected] = useState("All Titles");
  return titles.map((title) => (
    <TopicItem
      key={title}
      text={title}
      checked={selected === title}
      onPress={() => setSelected(title)}
    />
  ));
}

function TopicItem({
  text,
  checked = false,
  onPress,
}: {
  text: string;
  checked?: boolean;
  onPress?: () => void;
}) {
  return (
    <XStack
      onPress={onPress}
      alignItems="center"
      background={checked ? "#D0E8FF" : "transparent"}
      paddingVertical="$3.5"
      borderRadius="$2"
      hoverStyle={{
        backgroundColor: checked ? "#D0E8FF" : "#e4f2ffff",
      }}
      marginBottom={"$1.5"}
    >
      <Text
        marginLeft="$9"
        fontWeight={checked ? "600" : "400"}
        color={checked ? "#254973" : "black"}
        fontSize={14}
      >
        {text}
      </Text>
    </XStack>
  );
}
function NoteAndHighlight() {
  return (
    <XStack
      alignItems="center"
      paddingTop={"$4"}
      paddingBottom={"$5"}
      borderRadius="$2"
      paddingLeft={"$4"}
    >
      <FontAwesome size={20} name="file-o" />
      <Text marginLeft="$3" fontWeight={"600"} fontSize={14}>
        Notes & Highlights
      </Text>
    </XStack>
  );
}

function BookGrid() {
  const [books, setBooks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const data = await getDocList(
        "studio.sheet",
        [],
        ["name", "author", "image_id"]
      );
      console.log("data: ", data);
      setBooks([
        ...data.map((res: any) => {
          const name = res?.name ? res.name : "";
          return {
            title: `${name.slice(0, 20)}...`,
            author: res.author,
            image: url + "/web/content/" + res.image_id,
            id: res.id,
            sample: false,
          };
        }),
      ]);
    };
    init();
  }, []);

  return (
    <XStack flexWrap="wrap" gap={"$7"} padding={"$6"}>
      {books.map((book, index) => (
        <YStack
          key={index}
          cursor="pointer"
          onPress={() => router.push(`/reader/${book.id}`)}
        >
          <XStack
            width={170}
            height={250}
            overflow="hidden"
            boxShadow={"0 2px 4px 0 rgba(0,0,0,.4)"}
            marginBottom={"$3"}
          >
            <Image
              source={{ uri: book.image }}
              style={{
                width: 170,
                height: 250,
              }}
              resizeMode="cover"
            />
          </XStack>
          <Text
            fontSize={14}
            fontWeight="700"
            numberOfLines={1} // cắt tiêu đề dài
          >
            {book.title}
          </Text>
          <Text fontSize={12} color="#212121" numberOfLines={1}>
            {book.author}
          </Text>
        </YStack>
      ))}
    </XStack>
  );
}

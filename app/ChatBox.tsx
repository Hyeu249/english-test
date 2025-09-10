import { useState, useEffect } from "react";
import { YStack, XStack, Input, Button, ScrollView, Text } from "tamagui";
import { sendMessageStream, translateAudio } from "@/api/index";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { blobUrlToBase64 } from "@/utils/index";

type Part = {
  text: string;
};
type Message = {
  role: "user" | "model" | "system";
  parts: Part[];
};

export default function ChatBox() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      parts: [{ text: "You are a cat." }],
    },
    {
      role: "system",
      parts: [{ text: "Your name is Neko." }],
    },
    {
      role: "system",
      parts: [{ text: "And you are gay." }],
    },
    {
      role: "system",
      parts: [{ text: "you are born in 1996." }],
    },
  ]);

  const [input, setInput] = useState("");

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        console.log("Permission to access microphone was denied");
        return;
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    if (!audioRecorder.uri) return;

    const base64Data = await blobUrlToBase64(audioRecorder.uri);
    if (!base64Data) return;

    const text = await translateAudio(base64Data as string);
    console.log("text:", text);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // thêm tin nhắn user
    setMessages((prev) => [
      ...prev,
      { role: "user", parts: [{ text: input }] },
    ]);

    // reset input
    setInput("");
    console.log("message: ", messages);
    const text_instructions = messages
      .filter((res) => res.role == "system")
      .map((res) => res.parts?.[0]?.text);

    const instruction = {
      role: "user",
      parts: [
        {
          text: `
            You are an AI assistant that helps users answer questions.
            You must always respond in Vietnamese no other language.,
            and here are the system instructions:
            ${text_instructions.join("\n")}
          `,
        },
      ],
    };
    const history = [
      instruction,
      ...messages.filter((res) => res.role !== "system"),
    ];

    const bot_text = await sendMessageStream(input, history);

    // Giả lập gọi API model (ở đây dùng setTimeout mock)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: bot_text }] },
      ]);
    }, 800);
  };

  return (
    <YStack
      width="100%" // chiều rộng full
      height="100%" // chiều cao 500px
      padding="$2" // padding 2 đơn vị theme
      flexDirection="column" // đảm bảo xếp theo cột
      justifyContent="flex-start"
      alignItems="stretch"
    >
      {/* Chat content */}
      <ScrollView
        flex={1} // chiếm hết không gian còn lại
        padding="$2"
        showsVerticalScrollIndicator={false}
      >
        {messages
          .filter((res) => res.role != "system")
          .map((msg, idx) => (
            <XStack
              key={idx}
              justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
              marginBottom="$2"
              flexDirection="row"
              alignItems="flex-start"
              width="100%"
            >
              <Text
                backgroundColor={msg.role === "user" ? "$blue9" : "$black6"}
                color="white"
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$4"
                maxWidth="70%"
                fontSize="$4"
                lineHeight={20}
              >
                {msg?.parts?.[0]?.text}
              </Text>
            </XStack>
          ))}
      </ScrollView>

      {/* Input + Send */}
      <XStack
        marginTop="$2"
        gap="$2"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Input
          flex={1}
          value={input}
          onChangeText={setInput}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Nhập tin nhắn..."
          fontSize="$4"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$3"
          borderColor="$black7"
          borderWidth={1}
          backgroundColor="white"
          color="black"
        />
        <Button
          onPress={handleSend}
          backgroundColor="$blue10"
          color="white"
          borderRadius="$3"
          paddingHorizontal="$3"
          paddingVertical="$2"
        >
          Gửi
        </Button>
        <Button
          backgroundColor="$blue10"
          color="white"
          borderRadius="$3"
          paddingHorizontal="$3"
          paddingVertical="$2"
          onPress={recorderState.isRecording ? stopRecording : record}
        >
          {recorderState.isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </XStack>
    </YStack>
  );
}

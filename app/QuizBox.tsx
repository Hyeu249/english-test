import { useState, useEffect } from "react";
import { YStack, XStack, Button, Text } from "tamagui";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { blobUrlToBase64 } from "@/utils/index";
import { translateAudio } from "@/api/index";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const quiz: Question[] = [
  {
    question: "What color is the sky?",
    options: ["Blue", "Green", "Red", "Yellow"],
    answer: "Blue",
  },
  {
    question: "How many legs does a cat have?",
    options: ["Two", "Four", "Six", "Eight"],
    answer: "Four",
  },
  {
    question: "Which fruit is typically red?",
    options: ["Banana", "Apple", "Grapes", "Orange"],
    answer: "Apple",
  },
  {
    question: "Which animal barks?",
    options: ["Cat", "Dog", "Cow", "Sheep"],
    answer: "Dog",
  },
];

export default function Quiz() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        console.log("Permission denied");
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
    setStatus("Recording...");
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    setStatus("Processing...");

    if (!audioRecorder.uri) return;

    const base64Data = await blobUrlToBase64(audioRecorder.uri);
    if (!base64Data) return;

    const correctAnswer = quiz[currentIndex].answer.toLowerCase();
    const spokenText = (
      await translateAudio(base64Data as string, correctAnswer)
    )?.trim();
    console.log("Spoken text:", spokenText);

    if (spokenText?.toLowerCase() == correctAnswer) {
      setScore(score + 1);
      setStatus("Correct!");
    } else {
      setStatus(`Wrong! Correct: ${quiz[currentIndex].answer}`);
    }

    // Chuyển câu tiếp theo sau 1 giây
    setTimeout(() => {
      if (currentIndex + 1 < quiz.length) {
        setCurrentIndex(currentIndex + 1);
        setStatus("");
      } else {
        setStatus(
          `Quiz finished! Your score: ${
            score + (spokenText?.toLowerCase() === correctAnswer ? 1 : 0)
          }/${quiz.length}`
        );
      }
    }, 1000);
  };

  const currentQuestion = quiz[currentIndex];

  return (
    <YStack padding="$3" flex={1} justifyContent="flex-start">
      <Text fontSize="$6" marginBottom="$3">
        Question {currentIndex + 1}: {currentQuestion.question}
      </Text>

      <YStack marginBottom="$3">
        {currentQuestion.options.map((opt, idx) => (
          <Text key={idx} fontSize="$5" marginBottom="$1">
            {idx + 1}. {opt}
          </Text>
        ))}
      </YStack>

      <XStack gap="$2">
        <Button
          onPress={recorderState.isRecording ? stopRecording : record}
          backgroundColor="$blue10"
          color="white"
          borderRadius="$3"
          paddingHorizontal="$3"
          paddingVertical="$2"
        >
          {recorderState.isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        <Text fontSize="$5" color="$black10">
          {status}
        </Text>
      </XStack>
    </YStack>
  );
}

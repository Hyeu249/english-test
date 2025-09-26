import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { getDocList } from "@/api/action";
import { formatParagraphs } from "@/utils/index";
import { Font, Margin, Column, Language } from "@/types";
import { sendMessageStream } from "@/api/index";
import { useReadingContext } from "@/context/ReadingContext";
import * as Speech from "expo-speech";

type ThemeContextType = {
  isPlay: boolean;
  before: any;
  highlight: any;
  after: any;
  isIndex: boolean;
  words: string;

  voice: string;
  setVoice: React.Dispatch<React.SetStateAction<string>>;

  togglePlay: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const SystemVoiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { pageData, setIsLoading, language, setPage } = useReadingContext();
  const [isPlay, setIsPlay] = useState(false);

  const [cWordIndex, setCWordIndex] = useState<number | null>(null);
  const [translated, setTranslated] = useState("");
  const [voice, setVoice] = useState("");

  const text = pageData.text;

  const words = useMemo(() => {
    return formatParagraphs(translated);
  }, [translated]);

  useEffect(() => {
    const init = async () => {
      const input = `
              Translate the following text fully and naturally into ${language}. 
              Write every word of your response only in ${language}, 
              without adding explanations or any other languages:
              ${text}
      
          `;
      const bot_text = await sendMessageStream(input);
      setTranslated(bot_text);
      setIsLoading(false);
    };
    if (language === "") return setTranslated(text);
    setIsLoading(true);
    init();
  }, [text, language]);

  const isIndex = cWordIndex !== null;
  const indexBase = 35;
  const textTo = isIndex
    ? cWordIndex <= indexBase
      ? 0
      : cWordIndex - indexBase
    : 0;

  const hello1 = isIndex ? words.slice(textTo, cWordIndex + 30) : "";
  const hello2 = isIndex ? words.slice(textTo, cWordIndex) : "";
  const hello3 = isIndex ? hello1?.split(hello2)?.[1]?.split(" ")?.[0] : "";

  const before = words.slice(0, textTo);
  const highlight = isIndex
    ? words.slice(textTo, cWordIndex + hello3?.length)
    : "";
  const after = isIndex ? words.slice(cWordIndex + hello3?.length, -1) : "";

  const speak = () => {
    setCWordIndex(null);
    Speech.stop();

    Speech.speak(words, {
      voice: voice,
      onBoundary: (event: any) => {
        if (event.name === "word") setCWordIndex(event.charIndex);
      },
      onDone: () => {
        setPage((prev) => prev + 1);
      },
    });
  };

  useEffect(() => {
    if (isPlay) speak();
  }, [words]);

  useEffect(() => {
    setCWordIndex(null);
  }, [words]);

  useEffect(() => {
    return () => {
      Speech.stop();
      setCWordIndex(null);
      setIsPlay(false);
    };
  }, []);

  const togglePlay = async () => {
    if (cWordIndex === null) {
      speak();
      setIsPlay(true);
    } else if (isPlay) {
      Speech.pause();
      setIsPlay(false);
    } else {
      Speech.resume();
      setIsPlay(true);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isIndex,
        words,
        isPlay,
        before,
        highlight,
        after,
        voice,
        setVoice,
        togglePlay,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useSystemVoiceContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useSystemVoiceContext must be used within SystemVoiceProvider"
    );
  }
  return context;
};

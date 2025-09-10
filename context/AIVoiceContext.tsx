import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { getDocList, url } from "@/api/action";
import { formatParagraphs } from "@/utils/index";
import { Font, Margin, Column, Language } from "@/types";
import { sendMessageStream } from "@/api/index";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useReadingContext } from "@/context/ReadingContext";

type ThemeContextType = {
  isPlay: boolean;
  words: any;
  before: any;
  highlight: any;
  after: any;
  isIndex: boolean;

  togglePlay: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const AIVoiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id, pageData } = useReadingContext();

  const [isPlay, setIsPlay] = useState(false);
  const player = useAudioPlayer(url + "/api/audio/studio.sheet/" + id);
  const status = useAudioPlayerStatus(player);

  const words = React.useMemo(() => {
    let i = 0;
    let indent = false;
    return pageData.data
      .flatMap((segment: any) => segment.words)
      .map((res: any, index: number) => {
        let word = res.word;
        const numberIndent = "        ";
        if (indent) {
          word = numberIndent + res.word;
          indent = false;
        }
        if (res.word.includes(".")) {
          i++;
          if (i == 2) {
            const hasCharAfterDot = /\../.test(word);
            if (hasCharAfterDot) {
              word = word.replace(".", ".\n" + numberIndent);
            } else {
              word = word.replace(".", ".\n");
              indent = true;
            }
            i = 0;
          }
        }
        return {
          index,
          word: word,
          start: res.start,
          end: res.end,
        };
      });
  }, [pageData]);

  const togglePlay = useCallback(async () => {
    if (isPlay) {
      player.pause();
      setIsPlay(false);
    } else {
      player.play();
      setIsPlay(true);
    }
  }, [isPlay, player]);

  const currentTime = status.currentTime ?? 0;

  // Tìm từ đang active
  const text = words.find(
    (w: any) =>
      currentTime >= w.start && currentTime <= w.end && currentTime !== 0
  );
  const highlight = text?.word;

  const activeIndex = text?.index ?? -1;
  const isIndex = activeIndex >= 0;

  // Slice trước và sau từ active
  const before = isIndex ? words.slice(0, text?.index) : [];
  const after = isIndex ? words.slice(activeIndex + 1) : [];

  return (
    <ThemeContext.Provider
      value={{
        isIndex,
        isPlay,
        highlight,
        words,
        before,
        after,
        togglePlay,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAIVoiceContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAIVoiceContext must be used within AIVoiceProvider");
  }
  return context;
};

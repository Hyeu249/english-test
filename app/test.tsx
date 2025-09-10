import React, { useState, useCallback } from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { url } from "@/api/action";
import { data } from "@/utils/text";

const HighlightWord = React.memo(function Word({ word }: { word: string }) {
  return (
    <Text color={"$blue11"} backgroundColor={"$blue5"} fontFamily={`$Bookerly`}>
      {word}
    </Text>
  );
});

export default function Test() {
  const [isPlay, setIsPlay] = useState(false);
  const player = useAudioPlayer(url + "/api/audio/studio.sheet/1");
  const status = useAudioPlayerStatus(player);

  const words = React.useMemo(() => {
    let i = 0;
    let indent = false;
    return data
      .flatMap((segment) => segment.words)
      .map((res, index) => {
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
  }, []);

  const togglePlay = useCallback(async () => {
    if (isPlay) {
      player.pause();
      setIsPlay(false);
    } else {
      await player.seekTo(0);
      player.play();
      setIsPlay(true);
    }
  }, [isPlay, player]);

  const currentTime = status.currentTime ?? 0;

  // Tìm từ đang active
  const text = words.find(
    (w) => currentTime >= w.start && currentTime <= w.end && currentTime !== 0
  );

  const activeIndex = text?.index ?? -1;
  const isIndex = activeIndex >= 0;

  // Slice trước và sau từ active
  const before = isIndex ? words.slice(0, text?.index) : [];
  const after = isIndex ? words.slice(activeIndex + 1) : [];

  const before_after_text = () => {
    return (
      <>
        {before.map((w) => w.word)}

        {text && <HighlightWord word={text.word} />}

        {after.map((w) => w.word)}
      </>
    );
  };

  const render_text = () => {
    return <>{words.map((w) => w.word)}</>;
  };

  return (
    <YStack padding="$4" gap="$2">
      <Button onPress={togglePlay}>{isPlay ? "Pause" : "Play"}</Button>

      <XStack flexWrap="wrap">
        <Text
          style={{
            columnCount: 2,
          }}
          fontFamily={`$Bookerly`}
          fontSize={18}
          lineHeight={36}
          textAlign="justify"
        >
          {isIndex ? before_after_text() : render_text()}
        </Text>
      </XStack>
    </YStack>
  );
}

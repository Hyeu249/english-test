import { ScrollView, Text, XStack, Paragraph, Spinner, Theme } from "tamagui";
import React, { useState, useEffect } from "react";
import { Font, Margin, Column, Language } from "@/types";
import { sendMessageStream, translateAudio } from "@/api/index";
import { getDocList } from "@/api/action";
import * as Speech from "expo-speech";
import { useReadingContext } from "@/context/ReadingContext";
import { useAIVoiceContext } from "@/context/AIVoiceContext";
import {
  SystemVoiceProvider,
  useSystemVoiceContext,
} from "@/context/SystemVoiceContext";

type Props = {
  font: string;
  size: number;
  margin: Margin;
  height: number;
  column: Column;
};

export default ({ font, size, margin, height, column }: Props) => {
  const { isLoading, isAiVoice } = useReadingContext();
  const {
    highlight: highlight1,
    words: words1,
    before: before1,
    after: after1,
    isIndex: isIndex1,
  } = useAIVoiceContext();
  const {
    highlight: highlight2,
    before: before2,
    after: after2,
    isIndex: isIndex2,
    words: words2,
  } = useSystemVoiceContext();

  const before_after_text = () => {
    return (
      <>
        {before1.map((w: any) => w.word)}

        <Text
          color={`$blue11`}
          backgroundColor={"$blue5"}
          fontFamily={`$${font}`}
        >
          {highlight1}
        </Text>

        {after1.map((w: any) => w.word)}
      </>
    );
  };

  const render_text = () => {
    return <>{words1.map((w: any) => w.word)}</>;
  };

  const aiVoice = () => {
    return isIndex1 ? before_after_text() : render_text();
  };

  const systemVoice = () => {
    if (!isIndex2) {
      return words2;
    }
    return (
      <>
        {before2 && `${before2}`}
        <Text
          color={`$blue11`}
          backgroundColor={"$blue5"}
          fontFamily={`$${font}`}
        >
          {highlight2}
        </Text>
        {after2 && `${after2}`}
      </>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingHorizontal: margin }}
    >
      <Theme name="blue">
        {isLoading && <Spinner size="large" color="#007AFF" />}
        <Text
          style={{
            columnCount: column,
          }}
          fontFamily={`$${font}`}
          fontSize={size}
          lineHeight={height}
          textAlign="justify"
        >
          {isAiVoice ? aiVoice() : systemVoice()}
        </Text>
      </Theme>
    </ScrollView>
  );
};

import { ScrollView, Text, XStack, Paragraph } from "tamagui";
import React, { useState, useEffect } from "react";
import { Font, Margin, Column } from "@/types";

type Props = {
  text: string;
  font: string;
  size: number;
  margin: Margin;
  height: number;
  column: Column;
};

type PageProps = {
  left: string;
  right: string;
  font: string;
  size: number;
  height: number;
};

export default ({ text, font, size, margin, height, column }: Props) => {
  const [left, right] = splitBalanced(text);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingHorizontal: margin }}
    >
      {column == 1 ? (
        <OnePage
          left={left}
          right={right}
          font={font}
          size={size}
          height={height}
        />
      ) : (
        <TwoPage
          left={left}
          right={right}
          font={font}
          size={size}
          height={height}
        />
      )}
    </ScrollView>
  );
};

export function OnePage({ left, right, font, size, height }: PageProps) {
  return (
    <XStack gap={60}>
      <Text
        fontFamily={`$${font}`}
        fontSize={size}
        lineHeight={height}
        textAlign="justify"
      >
        {formatParagraphs(left)}
        <br />
        {formatParagraphs(right)}
      </Text>
    </XStack>
  );
}

export function TwoPage({ left, right, font, size, height }: PageProps) {
  return (
    <XStack gap={60}>
      <Text
        width={"50%"}
        fontFamily={`$${font}`}
        fontSize={size}
        lineHeight={height}
        textAlign="justify"
      >
        {formatParagraphs(left)}
      </Text>
      <Text
        width={"50%"}
        fontFamily={`$${font}`}
        fontSize={size}
        lineHeight={height}
        textAlign="justify"
      >
        {formatParagraphs(right)}
      </Text>
    </XStack>
  );
}

// ------------- HÀM CHÍNH CHIA HAI CỘT -------------
function splitBalanced(text: string): [string, string] {
  const clean = text.trim().replace(/\s*\n\s*/g, " ");
  const half = Math.floor(clean.length / 2);

  // tìm dấu chấm gần nhất về phía trước
  let cut = clean.lastIndexOf(" ", half);
  if (cut === -1) cut = half; // không có dấu chấm

  const left = clean.slice(0, cut + 1).trim();
  const right = clean.slice(cut + 1).trim();
  return [left, right];
}

// ------------- XỬ LÝ ĐOẠN / THỤT LỀ -------------
function formatParagraphs(text: string, length: number = 150): string {
  const words = text.trim().split(/\s+/);
  const result: string[] = [];
  const INDENT = "        "; // 8 dấu space

  let buffer: string[] = [];
  let dotCount = 0;
  let lastDotIndex = -1;

  words.forEach((w) => {
    buffer.push(w);

    if (w.endsWith(".")) {
      dotCount++;
      lastDotIndex = buffer.length - 1;
    }

    const reached400 = buffer.length >= length;
    const reached3Dots = dotCount >= 2;

    if (reached3Dots || reached400) {
      if (reached3Dots) {
        result.push(INDENT + buffer.join(" "));
        buffer = [];
        dotCount = 0;
        lastDotIndex = -1;
        return;
      }

      if (reached400 && lastDotIndex !== -1) {
        const sliceEnd = lastDotIndex + 1;
        result.push(INDENT + buffer.slice(0, sliceEnd).join(" "));
        buffer = buffer.slice(sliceEnd);
        dotCount = buffer.filter((w) => w.endsWith(".")).length;
        lastDotIndex = buffer
          .map((w, idx) => (w.endsWith(".") ? idx : -1))
          .reduce((a, b) => Math.max(a, b), -1);
      }
    }
  });

  if (buffer.length) {
    result.push(INDENT + buffer.join(" "));
  }

  return result.join("\n");
}

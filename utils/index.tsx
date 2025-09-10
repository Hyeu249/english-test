import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

export async function blobUrlToBase64(blobUrl: string) {
  if (Platform.OS !== "web") {
    return await FileSystem.readAsStringAsync(blobUrl, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  // Lấy Blob từ url
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = (reader.result as string).split(",")[1];
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function formatParagraphs(text: string, length: number = 150): string {
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

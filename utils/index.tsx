import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

export async function blobUrlToBase64(blobUrl: string) {
  if (Platform.OS !== "web") {
    return await FileSystem.readAsStringAsync(blobUrl, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  // Lấy Blob từ URL
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

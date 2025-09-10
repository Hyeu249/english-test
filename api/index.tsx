// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI, Content, ContentUnion } from "@google/genai";

const GEMINI_API_KEY = "AIzaSyDCGi-scJLa2c4f9eYpieAZFxG6FB2VLy8";

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

type Config = {
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
  systemInstruction?: ContentUnion;
};

export const sendMessageStream = async (
  text: string,
  history?: Content[],
  config?: Config
): Promise<string> => {
  try {
    const chunks = [];

    const model = config?.model || "gemma-3n-e2b-it";

    const chat = ai.chats.create({
      model: model,
      config: {
        maxOutputTokens: config?.maxOutputTokens,
        responseMimeType: "text/plain",
        temperature: config?.temperature || 1,
        systemInstruction: config?.systemInstruction,
      },
      history: history || undefined,
    });
    const stream1 = await chat.sendMessageStream({
      message: text,
    });
    for await (const chunk of stream1) {
      if (chunk.usageMetadata?.candidatesTokensDetails) {
        console.log("chunk?.usageMetadata: ", chunk?.usageMetadata);
        console.log("-------------------------");
      }
      chunks.push(chunk.text);
    }

    return chunks.join("");
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Lỗi khi gọi Gemini API.";
  }
};

export const translateAudio = async (
  data: string,
  text?: string
): Promise<string> => {
  try {
    const chunks = [];

    const model2 = "gemma-3n-e2b-it";
    const model3 = "gemini-2.0-flash-lite";
    const model = "learnlm-2.0-flash-experimental";

    const contents = [
      {
        role: "user",
        parts: [
          { inlineData: { data: data, mimeType: "audio/ogg" } },
          {
            text: `
You are an English teacher grading a multiple-choice question.
You will listen to the audio file I just sent (the student's spoken answer).
The correct answer is: "${text}".
Instructions:
- If the student's spoken answer is close in meaning or wording to the correct answer "${text}", output exactly: Correct
- Otherwise, output exactly what user said in the audio file and explain why it is incorrect in one sentence.

        `,
          },
        ],
      },
    ];

    const config = {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    };

    const response = await ai.models.generateContentStream({
      model,
      contents,
    });
    for await (const chunk of response) {
      if (chunk.usageMetadata?.candidatesTokensDetails) {
        console.log("chunk?.usageMetadata: ", chunk?.usageMetadata);
        console.log("-------------------------");
      }
      chunks.push(chunk.text);
    }
    console.log("chunks:222", chunks);
    console.log("text:222", text);

    return chunks.join("");
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Lỗi khi gọi Gemini API.";
  }
};

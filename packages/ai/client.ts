import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Walk upward from this file's directory until we find the repo root .env
function findRootEnv(startDir: string): string | null {
  let dir = startDir;
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, ".env");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const rootEnvPath = findRootEnv(__dirname);
if (rootEnvPath) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is not set. Check your root .env file."
  );
}

const ai = new GoogleGenAI({ apiKey });

const MODEL = "gemini-3.6-flash";

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: systemInstruction ? { systemInstruction } : undefined,
  });

  return response.text ?? "";
}

export async function generateJSON<T = any>(
  prompt: string,
  systemInstruction?: string
): Promise<T> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  const text = response.text ?? "{}";
  return JSON.parse(text) as T;
}

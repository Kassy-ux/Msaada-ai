import { generateJSON } from "../client";
import { CLASSIFICATION_SYSTEM_PROMPT } from "../prompts/classify";

export interface ClassificationResult {
  category:
    | "EMPLOYMENT"
    | "HOUSING"
    | "LAND"
    | "POLICE"
    | "FAMILY"
    | "CONSUMER"
    | "DEBT"
    | "GBV"
    | "PUBLIC_SERVICE"
    | "OTHER";
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  reasoning: string;
}

export async function classifyIssue(userText: string): Promise<ClassificationResult> {
  const result = await generateJSON<ClassificationResult>(
    `User's problem: "${userText}"`,
    CLASSIFICATION_SYSTEM_PROMPT
  );

  return result;
}

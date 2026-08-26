import { searchLegalChunks, RetrievedChunk } from "../../legal/embeddings/searchChunks";
import { generateJSON } from "../client";
import { TRIAGE_SYSTEM_PROMPT } from "../prompts/triage";
import { classifyIssue, ClassificationResult } from "../tools/classifyIssue";
import { runSafetyCheck } from "../safety/safetyCheck";

export interface TriageResponse {
  classification: ClassificationResult;
  area_summary: string;
  explanation: string;
  next_steps: string[];
  evidence_to_preserve: string[];
  sources_used: string[];
  requires_human_help: boolean;
  disclaimer: string;
  retrieved_chunks: RetrievedChunk[];
  safety: {
    passed: boolean;
    flags: string[];
  };
}

export async function runTriage(userText: string): Promise<TriageResponse> {
  // Classification and retrieval are independent. Run them together so the
  // request waits for the slower operation once, rather than serially.
  const [classification, retrievedChunks] = await Promise.all([
    classifyIssue(userText),
    searchLegalChunks(userText, 5),
  ]);

  // 3. Build context block for the model — ONLY verified sources go in
  const contextBlock =
    retrievedChunks.length > 0
      ? retrievedChunks
          .map(
            (c, i) =>
              `[${i + 1}] Source: ${c.documentTitle} (${c.source})\nSection: ${c.section ?? "N/A"}\nContent: ${c.content}`
          )
          .join("\n\n")
      : "No matching verified legal context was found for this query.";

  const prompt = `User's problem: "${userText}"

Detected category: ${classification.category}
Detected urgency: ${classification.urgency}

Retrieved legal context:
${contextBlock}`;

  // 4. Generate grounded response
  const raw = await generateJSON<Omit<TriageResponse, "classification" | "retrieved_chunks" | "safety">>(
    prompt,
    TRIAGE_SYSTEM_PROMPT
  );

  // 5. Run safety validation before returning to the user
  const safety = runSafetyCheck(raw, retrievedChunks);

  return {
    classification,
    ...raw,
    retrieved_chunks: retrievedChunks,
    safety,
  };
}

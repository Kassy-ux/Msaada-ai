import { RetrievedChunk } from "../../legal/embeddings/searchChunks";

export interface SafetyCheckInput {
  explanation: string;
  sources_used: string[];
  next_steps: string[];
}

export interface SafetyCheckResult {
  passed: boolean;
  flags: string[];
}

// Basic heuristics — not perfect, but catches the clearest hallucination patterns
export function runSafetyCheck(
  response: SafetyCheckInput,
  retrievedChunks: RetrievedChunk[]
): SafetyCheckResult {
  const flags: string[] = [];

  // 1. Flag phone-number-like patterns in the explanation/next steps
  //    (Msaada should only surface provider phone numbers from the verified providers table,
  //    never numbers invented inline by the model)
  const phonePattern = /(\+?254|0)[17]\d{8}\b/g;
  const combinedText = `${response.explanation} ${response.next_steps.join(" ")}`;
  const phoneMatches = combinedText.match(phonePattern);
  if (phoneMatches && phoneMatches.length > 0) {
    flags.push(`Possible invented phone number(s) detected: ${phoneMatches.join(", ")}`);
  }

  // 2. Flag if sources_used references a document not actually retrieved
  const retrievedTitles = new Set(retrievedChunks.map((c) => c.documentTitle));
  for (const cited of response.sources_used) {
    const matchesRetrieved = [...retrievedTitles].some((title) => cited.includes(title));
    if (!matchesRetrieved && retrievedChunks.length > 0) {
      flags.push(`Cited source not found in retrieved context: "${cited}"`);
    }
  }

  // 3. Flag overconfident language that guarantees outcomes
  const overconfidentPhrases = [
    "you will definitely win",
    "you definitely have a case",
    "guaranteed to",
    "you will win",
    "this is illegal, full stop",
  ];
  const lowerExplanation = response.explanation.toLowerCase();
  for (const phrase of overconfidentPhrases) {
    if (lowerExplanation.includes(phrase)) {
      flags.push(`Overconfident/guaranteeing language detected: "${phrase}"`);
    }
  }

  // 4. Flag if no legal context was retrieved but the model still gave a confident explanation
  if (retrievedChunks.length === 0 && response.explanation.length > 100) {
    flags.push("No verified legal context was retrieved, but a detailed explanation was still generated — review for possible hallucination.");
  }

  return {
    passed: flags.length === 0,
    flags,
  };
}

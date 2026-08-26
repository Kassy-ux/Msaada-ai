const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface TriageClassification {
  category: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  reasoning: string;
}

export interface RetrievedChunk {
  id: string;
  content: string;
  section: string | null;
  documentTitle: string;
  source: string;
  sourceUrl: string | null;
  similarity: number;
}

export interface TriageResponse {
  classification: TriageClassification;
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

export async function submitTriage(message: string): Promise<TriageResponse> {
  const response = await fetch(`${API_URL}/api/triage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to process your request.");
  }

  return response.json();
}

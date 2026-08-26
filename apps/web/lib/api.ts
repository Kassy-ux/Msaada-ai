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

export interface CaseRecord {
  id: string;
  code: string;
  category: string;
  description: string;
  urgency: string;
  status: string;
  createdAt: string;
}

export async function createCase(
  category: string,
  description: string,
  urgency: string
): Promise<CaseRecord> {
  const response = await fetch(`${API_URL}/api/cases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, description, urgency }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to create case.");
  }

  return response.json();
}

export interface CaseEvent {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

export interface CaseDetail extends CaseRecord {
  events: CaseEvent[];
}

export async function getCases(): Promise<CaseRecord[]> {
  const response = await fetch(`${API_URL}/api/cases`);
  if (!response.ok) throw new Error("Failed to load cases.");
  return response.json();
}

export async function getCase(id: string): Promise<CaseDetail> {
  const response = await fetch(`${API_URL}/api/cases/${id}`);
  if (!response.ok) throw new Error("Failed to load case.");
  return response.json();
}

export interface Provider {
  id: string;
  name: string;
  organization: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  verified: boolean;
}

export async function getProviders(category?: string): Promise<Provider[]> {
  const url = category
    ? `${API_URL}/api/providers?category=${category}`
    : `${API_URL}/api/providers`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to load providers.");
  return response.json();
}

// ------------------------
// ADMIN
// ------------------------

export interface AdminProvider {
  id: string;
  name: string;
  organization: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  verified: boolean;
  createdAt: string;
  services: { id: string; category: string }[];
}

export async function getAdminProviders(): Promise<AdminProvider[]> {
  const response = await fetch(`${API_URL}/api/admin/providers`);
  if (!response.ok) throw new Error("Failed to load providers.");
  return response.json();
}

export async function createAdminProvider(data: {
  name: string;
  organization?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  categories?: string[];
}): Promise<AdminProvider> {
  const response = await fetch(`${API_URL}/api/admin/providers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create provider.");
  return response.json();
}

export async function verifyAdminProvider(id: string, verified: boolean): Promise<AdminProvider> {
  const response = await fetch(`${API_URL}/api/admin/providers/${id}/verify`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verified }),
  });
  if (!response.ok) throw new Error("Failed to update provider.");
  return response.json();
}

export async function deleteAdminProvider(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/admin/providers/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete provider.");
}

export interface AdminUser {
  id: string;
  phone: string;
  name: string | null;
  location: string | null;
  role: string;
  createdAt: string;
  _count: { cases: number };
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await fetch(`${API_URL}/api/admin/users`);
  if (!response.ok) throw new Error("Failed to load users.");
  return response.json();
}

export interface AdminCase {
  id: string;
  code: string;
  category: string;
  description: string;
  urgency: string;
  status: string;
  createdAt: string;
  user: { id: string; phone: string; name: string | null };
  _count: { events: number; evidence: number };
}

export async function getAdminCases(): Promise<AdminCase[]> {
  const response = await fetch(`${API_URL}/api/admin/cases`);
  if (!response.ok) throw new Error("Failed to load cases.");
  return response.json();
}

export async function updateAdminCaseStatus(id: string, status: string): Promise<AdminCase> {
  const response = await fetch(`${API_URL}/api/admin/cases/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update case status.");
  return response.json();
}

export interface AdminLegalDocument {
  id: string;
  title: string;
  source: string;
  sourceUrl: string | null;
  documentType: string;
  jurisdiction: string;
  version: string | null;
  publishedAt: string | null;
  verifiedAt: string | null;
  _count: { chunks: number };
}

export async function getAdminLegalDocuments(): Promise<AdminLegalDocument[]> {
  const response = await fetch(`${API_URL}/api/admin/legal-documents`);
  if (!response.ok) throw new Error("Failed to load legal documents.");
  return response.json();
}

export async function deleteAdminLegalDocument(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/admin/legal-documents/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete document.");
}

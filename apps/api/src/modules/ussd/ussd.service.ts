import { prisma } from "../../../../../packages/database/src/index";

type UssdInput = { sessionId: string; phoneNumber: string; text: string };
type Category = "POLICE" | "EMPLOYMENT" | "HOUSING" | "LAND" | "FAMILY" | "GBV" | "CONSUMER" | "DEBT" | "PUBLIC_SERVICE" | "OTHER";

const CATEGORIES: Record<string, { value: Category; label: string }> = {
  "1": { value: "POLICE", label: "Police / arrest" }, "2": { value: "EMPLOYMENT", label: "Employment" }, "3": { value: "HOUSING", label: "Housing / tenancy" }, "4": { value: "LAND", label: "Land" }, "5": { value: "FAMILY", label: "Family" }, "6": { value: "GBV", label: "Gender-based violence" }, "7": { value: "CONSUMER", label: "Consumer" }, "8": { value: "DEBT", label: "Debt" }, "9": { value: "PUBLIC_SERVICE", label: "Public service" }, "10": { value: "OTHER", label: "Other" },
};

function menu(): string {
  return ["CON MSAADA LEGAL HELP", "Choose a category:", "1. Police / arrest", "2. Employment", "3. Housing / tenancy", "4. Land", "5. Family", "6. GBV", "7. Consumer", "8. Debt", "9. Public service", "10. Other"].join("\n");
}

function adviceFor(category: Category, issue: string): string {
  const lowerIssue = issue.toLowerCase();
  if (category === "GBV") return "If you are in immediate danger, move to a safe place and contact emergency services or someone you trust. Preserve messages, photos, and medical records.";
  if (category === "POLICE") return "Stay calm. Ask why you are being held, record the station and officer details, and ask a trusted person or legal-aid provider to assist.";
  if (category === "HOUSING") return /(lock|evict|outside|padlock)/.test(lowerIssue) ? "Do not force entry. Photograph the lockout, keep rent records, ask for access in writing, and seek urgent legal help." : "Keep your tenancy agreement, rent records, and all messages. Put your concern in writing and seek help before taking action.";
  if (category === "EMPLOYMENT") return /(fired|dismiss|terminate|sack)/.test(lowerIssue) ? "Ask for the reason for dismissal in writing. Keep your contract, payslips, and messages, then seek prompt employment-law help." : "Keep your contract, payslips, and work messages. Raise the issue in writing with your employer and seek legal-aid support.";
  if (category === "LAND") return "Do not sign or hand over documents under pressure. Keep copies of titles, agreements, and messages, then seek land-law guidance.";
  if (category === "FAMILY") return "Keep relevant messages and records. Avoid confrontation, prioritise safety where needed, and seek family-law or legal-aid guidance.";
  if (category === "CONSUMER") return "Keep receipts, contracts, and messages. Write to the seller or provider with what you want resolved and keep proof of delivery.";
  if (category === "DEBT") return "Keep loan statements and all collection messages. Do not ignore formal notices; ask for a written statement and seek advice before agreeing to payments.";
  if (category === "PUBLIC_SERVICE") return "Keep your application or reference number and every response. Make your request or complaint in writing and retain copies.";
  return "Write down what happened, when it happened, and who was involved. Keep all supporting records and seek legal-aid guidance.";
}

async function providerSummary(category: Category): Promise<string> {
  const providers = await prisma.provider.findMany({ where: { verified: true, services: { some: { category } } }, select: { name: true, phone: true }, orderBy: { name: "asc" }, take: 2 });
  return providers.length ? providers.map((provider) => `${provider.name}${provider.phone ? `: ${provider.phone}` : ""}`).join("\n") : "No verified provider is listed for this category yet.";
}

export async function handleUssdSession({ text }: UssdInput): Promise<string> {
  const steps = text.split("*").filter(Boolean);
  if (steps.length === 0) return menu();
  const category = CATEGORIES[steps[0]];
  if (!category) return "END Invalid selection. Please dial again.";
  if (steps.length === 1) return `CON ${category.label}\nBriefly describe what happened:`;
  const issue = steps.slice(1).join(" ").trim();
  if (issue.length < 5) return "CON Please briefly describe the issue (at least 5 characters):";
  const [advice, providers] = await Promise.all([Promise.resolve(adviceFor(category.value, issue)), providerSummary(category.value)]);
  return `END ${category.label}\n${advice}\n\nVerified help:\n${providers}\n\nGeneral legal information, not legal advice.`;
}

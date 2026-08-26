import { generateText } from "../packages/ai/client";

async function main() {
  const result = await generateText(
    "In one sentence, explain what a tenancy agreement is, for someone with no legal background."
  );
  console.log("Gemini response:\n", result);
}

main().catch(console.error);

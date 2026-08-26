import { runTriage } from "../packages/ai/rag/triagePipeline";

async function main() {
  const result = await runTriage(
    "My landlord locked me outside my house because I haven't paid rent."
  );

  console.log("\n=== CLASSIFICATION ===");
  console.log(result.classification);

  console.log("\n=== AREA SUMMARY ===");
  console.log(result.area_summary);

  console.log("\n=== EXPLANATION ===");
  console.log(result.explanation);

  console.log("\n=== NEXT STEPS ===");
  result.next_steps.forEach((s, i) => console.log(`${i + 1}. ${s}`));

  console.log("\n=== EVIDENCE TO PRESERVE ===");
  result.evidence_to_preserve.forEach((e) => console.log(`- ${e}`));

  console.log("\n=== SOURCES USED ===");
  result.sources_used.forEach((s) => console.log(`- ${s}`));

  console.log("\n=== SAFETY CHECK ===");
  console.log(result.safety);

  console.log("\n=== DISCLAIMER ===");
  console.log(result.disclaimer);

  process.exit(0);
}

main().catch((err) => {
  console.error("Triage test failed:", err);
  process.exit(1);
});

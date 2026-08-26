import { ingestDocument } from "../packages/legal/ingestion/ingestDocument";
import path from "path";

async function main() {
  await ingestDocument(
    path.join(__dirname, "../packages/legal/sources/raw/employment-act-sample.txt"),
    {
      title: "Employment Act, 2007 (Kenya) — Selected Provisions",
      source: "Kenya Law / National Council for Law Reporting",
      sourceUrl: "https://www.kenyalaw.org",
      documentType: "STATUTE",
      jurisdiction: "Kenya",
      version: "Rev. 2012",
    }
  );

  console.log("Ingestion complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});

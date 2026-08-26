import { ingestDocument } from "../packages/legal/ingestion/ingestDocument";
import path from "path";

async function main() {
  const documents = [
    {
      file: "employment-act-sample.txt",
      title: "Employment Act, 2007 (Kenya) — Selected Provisions",
      source: "Kenya Law / National Council for Law Reporting",
      documentType: "STATUTE",
    },
    {
      file: "landlord-tenant-sample.txt",
      title: "Landlord and Tenant Rights (Kenya) — Selected Provisions",
      source: "Kenya Law / Business Premises Rent Tribunal guidance",
      documentType: "STATUTE",
    },
    {
      file: "criminal-police-sample.txt",
      title: "Criminal Procedure and Police Powers (Kenya) — Selected Provisions",
      source: "Kenya Law / National Police Service guidance",
      documentType: "STATUTE",
    },
    {
      file: "land-sample.txt",
      title: "Land Rights and Disputes (Kenya) — Selected Provisions",
      source: "Kenya Law / Environment and Land Court guidance",
      documentType: "STATUTE",
    },
    {
      file: "family-sample.txt",
      title: "Family Law (Kenya) — Selected Provisions on Marriage, Custody, and Maintenance",
      source: "Kenya Law / Judiciary guidance",
      documentType: "STATUTE",
    },
    {
      file: "consumer-protection-sample.txt",
      title: "Consumer Protection (Kenya) — Selected Provisions",
      source: "Kenya Law / Competition Authority of Kenya guidance",
      documentType: "STATUTE",
    },
    {
      file: "debt-sample.txt",
      title: "Debt Collection and Borrower Rights (Kenya) — Selected Provisions",
      source: "Kenya Law / Office of the Data Protection Commissioner guidance",
      documentType: "STATUTE",
    },
    {
      file: "gbv-sample.txt",
      title: "Gender-Based Violence (Kenya) — Selected Provisions on Protection and Support",
      source: "Kenya Law / National GBV guidance",
      documentType: "STATUTE",
    },
    {
      file: "public-service-sample.txt",
      title: "Public Service Delivery and Citizen Rights (Kenya) — Selected Provisions",
      source: "Kenya Law / Commission on Administrative Justice guidance",
      documentType: "STATUTE",
    },
  ];

  for (const doc of documents) {
    await ingestDocument(
      path.join(__dirname, `../packages/legal/sources/raw/${doc.file}`),
      {
        title: doc.title,
        source: doc.source,
        sourceUrl: "https://www.kenyalaw.org",
        documentType: doc.documentType,
        jurisdiction: "Kenya",
        version: "Sample/Educational",
      }
    );
  }

  console.log("\nAll documents ingested successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});

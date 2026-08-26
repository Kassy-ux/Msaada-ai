import { prisma } from "../../../../../packages/database/src/index";
import { ingestDocument, DocumentMeta } from "../../../../../packages/legal/ingestion/ingestDocument";
import fs from "fs";
import os from "os";
import path from "path";

export async function listLegalDocuments() {
  return prisma.legalDocument.findMany({
    select: {
      id: true,
      title: true,
      source: true,
      sourceUrl: true,
      documentType: true,
      jurisdiction: true,
      version: true,
      publishedAt: true,
      verifiedAt: true,
      _count: { select: { chunks: true } },
    },
    orderBy: { verifiedAt: "desc" },
  });
}

export async function createLegalDocument(content: string, meta: DocumentMeta) {
  // ingestDocument expects a file path, so write content to a temp file first
  const tempPath = path.join(os.tmpdir(), `msaada-doc-${Date.now()}.txt`);
  fs.writeFileSync(tempPath, content, "utf-8");

  try {
    const document = await ingestDocument(tempPath, meta);
    return document;
  } finally {
    fs.unlinkSync(tempPath);
  }
}

export async function markVerified(id: string) {
  return prisma.legalDocument.update({
    where: { id },
    data: { verifiedAt: new Date() },
  });
}

export async function deleteLegalDocument(id: string) {
  return prisma.legalDocument.delete({ where: { id } });
}

import { prisma } from "../../database/src/index";
import { chunkText } from "../chunking/chunkText";
import { generateEmbeddingsBatch } from "../embeddings/generateEmbedding";
import fs from "fs";

export interface DocumentMeta {
  title: string;
  source: string;
  sourceUrl?: string;
  documentType: string; // "STATUTE" | "CONSTITUTION" | "GUIDE" | "CASE_LAW"
  jurisdiction?: string;
  version?: string;
  publishedAt?: Date;
  verifiedAt?: Date;
}

export async function ingestDocument(filePath: string, meta: DocumentMeta) {
  console.log(`Ingesting: ${meta.title}`);

  const rawText = fs.readFileSync(filePath, "utf-8");

  // 1. Create the parent document record
  const document = await prisma.legalDocument.create({
    data: {
      title: meta.title,
      source: meta.source,
      sourceUrl: meta.sourceUrl,
      documentType: meta.documentType,
      jurisdiction: meta.jurisdiction ?? "Kenya",
      version: meta.version,
      publishedAt: meta.publishedAt,
      verifiedAt: meta.verifiedAt ?? new Date(),
      content: rawText,
    },
  });

  // 2. Chunk the text
  const chunks = chunkText(rawText);
  console.log(`  -> ${chunks.length} chunks created`);

  // 3. Generate embeddings in batch
  const embeddings = await generateEmbeddingsBatch(chunks.map((c) => c.content));

  // 4. Insert chunks with embeddings via raw SQL (pgvector type not natively
  //    supported by Prisma's query builder)
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = embeddings[i];
    const vectorLiteral = `[${embedding.join(",")}]`;

    await prisma.$executeRawUnsafe(
      `INSERT INTO legal_chunks (id, "documentId", content, embedding, section, metadata)
       VALUES (gen_random_uuid(), $1, $2, $3::vector, $4, $5::jsonb)`,
      document.id,
      chunk.content,
      vectorLiteral,
      chunk.section ?? null,
      JSON.stringify({ chunkIndex: chunk.index })
    );
  }

  console.log(`  -> Done. Document ID: ${document.id}`);
  return document;
}

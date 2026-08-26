import { prisma } from "../../database/src/index";
import { chunkText } from "../chunking/chunkText";
import { generateEmbeddingsBatch } from "../embeddings/generateEmbeddingLocal";
import fs from "fs";

export interface DocumentMeta {
  title: string;
  source: string;
  sourceUrl?: string;
  documentType: string;
  jurisdiction?: string;
  version?: string;
  publishedAt?: Date;
  verifiedAt?: Date;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxAttempts: number = 4
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const waitMs = attempt * 2000;
      console.warn(
        `  [retry] ${label} failed (attempt ${attempt}/${maxAttempts}). Retrying in ${waitMs}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  throw lastError;
}

export async function ingestDocument(filePath: string, meta: DocumentMeta) {
  console.log(`Ingesting: ${meta.title}`);

  const rawText = fs.readFileSync(filePath, "utf-8");

  const document = await withRetry(
    () =>
      prisma.legalDocument.create({
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
      }),
    `create document "${meta.title}"`
  );

  const chunks = chunkText(rawText);
  console.log(`  -> ${chunks.length} chunks created`);

  const embeddings = await generateEmbeddingsBatch(chunks.map((c) => c.content));

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = embeddings[i];
    const vectorLiteral = `[${embedding.join(",")}]`;

    await withRetry(
      () =>
        prisma.$executeRawUnsafe(
          `INSERT INTO legal_chunks (id, "documentId", content, embedding, section, metadata)
           VALUES (gen_random_uuid(), $1, $2, $3::vector, $4, $5::jsonb)`,
          document.id,
          chunk.content,
          vectorLiteral,
          chunk.section ?? null,
          JSON.stringify({ chunkIndex: chunk.index })
        ),
      `insert chunk ${i + 1}/${chunks.length}`
    );
  }

  console.log(`  -> Done. Document ID: ${document.id}`);
  return document;
}

import { Prisma, prisma } from "../../database/src/index";
import { generateEmbedding } from "./generateEmbeddingLocal";

export interface RetrievedChunk {
  id: string;
  content: string;
  section: string | null;
  documentId: string;
  documentTitle: string;
  source: string;
  sourceUrl: string | null;
  similarity: number;
}

function isTransientDatabaseTimeout(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ETIMEDOUT"
  );
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function searchLegalChunks(
  query: string,
  topK: number = 5
): Promise<RetrievedChunk[]> {
  if (!Number.isInteger(topK) || topK < 1 || topK > 100) {
    throw new RangeError("topK must be an integer between 1 and 100.");
  }

  const queryEmbedding = await generateEmbedding(query);
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  const searchQuery = Prisma.sql`
    SELECT
       lc.id,
       lc.content,
       lc.section,
       lc."documentId",
       ld.title AS "documentTitle",
       ld.source,
       ld."sourceUrl",
       1 - (lc.embedding <=> ${vectorLiteral}::vector) AS similarity
     FROM legal_chunks lc
     JOIN legal_documents ld ON ld.id = lc."documentId"
     WHERE lc.embedding IS NOT NULL
     ORDER BY lc.embedding <=> ${vectorLiteral}::vector
     LIMIT ${topK}
  `;

  try {
    return await prisma.$queryRaw<RetrievedChunk[]>(searchQuery);
  } catch (error) {
    if (!isTransientDatabaseTimeout(error)) throw error;

    // Neon pooler connections can occasionally time out while being established.
    // Retry once to recover without masking persistent database failures.
    await delay(150);
    return prisma.$queryRaw<RetrievedChunk[]>(searchQuery);
  }

}

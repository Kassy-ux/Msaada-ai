import { prisma } from "../../database/src/index";
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

export async function searchLegalChunks(
  query: string,
  topK: number = 5
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await generateEmbedding(query);
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  const results = await prisma.$queryRawUnsafe<RetrievedChunk[]>(
    `SELECT
       lc.id,
       lc.content,
       lc.section,
       lc."documentId",
       ld.title AS "documentTitle",
       ld.source,
       ld."sourceUrl",
       1 - (lc.embedding <=> $1::vector) AS similarity
     FROM legal_chunks lc
     JOIN legal_documents ld ON ld.id = lc."documentId"
     ORDER BY lc.embedding <=> $1::vector
     LIMIT $2`,
    vectorLiteral,
    topK
  );

  return results;
}

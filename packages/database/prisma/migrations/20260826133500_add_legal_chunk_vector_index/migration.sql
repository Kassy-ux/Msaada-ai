-- pgvector is required by the LegalChunk.embedding column and its similarity search.
CREATE EXTENSION IF NOT EXISTS vector;

-- Matches the cosine-distance operator (<=>) used by searchLegalChunks.
-- HNSW provides low-latency nearest-neighbour retrieval as the legal corpus grows.
CREATE INDEX IF NOT EXISTS "legal_chunks_embedding_hnsw_idx"
ON "legal_chunks"
USING hnsw ("embedding" vector_cosine_ops)
WHERE "embedding" IS NOT NULL;

import { pipeline, env } from "@xenova/transformers";

env.allowRemoteModels = true;
env.allowLocalModels = true;

let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    console.log("Loading local embedding model (first run downloads ~90MB)...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await getEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const model = await getEmbedder();
  const results: number[][] = [];

  for (const text of texts) {
    const output = await model(text, { pooling: "mean", normalize: true });
    results.push(Array.from(output.data as Float32Array));
  }

  return results;
}

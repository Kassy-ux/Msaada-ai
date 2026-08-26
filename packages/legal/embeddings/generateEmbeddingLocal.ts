import { pipeline, env } from "@xenova/transformers";

env.allowRemoteModels = true;
env.allowLocalModels = true;

let embedderPromise: Promise<any> | null = null;

async function getEmbedder() {
  if (!embedderPromise) {
    console.log("Loading local embedding model (first run downloads ~90MB)...");
    embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2").catch(
      (error) => {
        // Allow a later request to retry if startup loading fails.
        embedderPromise = null;
        throw error;
      }
    );
  }
  return embedderPromise;
}

export async function warmEmbeddingModel(): Promise<void> {
  await getEmbedder();
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

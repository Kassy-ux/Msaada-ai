export interface TextChunk {
  content: string;
  section?: string;
  index: number;
}

/**
 * Splits raw legal text into chunks along natural section boundaries
 * (lines starting with SECTION/ARTICLE/CHAPTER), falling back to
 * fixed-size chunking with overlap for unstructured text.
 */
export function chunkText(
  rawText: string,
  options: { maxChunkSize?: number; overlap?: number } = {}
): TextChunk[] {
  const maxChunkSize = options.maxChunkSize ?? 1200;
  const overlap = options.overlap ?? 150;

  const sectionRegex = /^(SECTION|ARTICLE|CHAPTER)\s+[\dA-Z]+.*$/gim;
  const hasSections = sectionRegex.test(rawText);

  if (hasSections) {
    const parts = rawText.split(/(?=^(?:SECTION|ARTICLE|CHAPTER)\s+[\dA-Z]+)/gim).filter(
      (p) => p.trim().length > 0
    );

    const chunks: TextChunk[] = [];
    let index = 0;

    for (const part of parts) {
      const trimmed = part.trim();
      const headingMatch = trimmed.match(/^(SECTION|ARTICLE|CHAPTER)\s+[\dA-Z:]+[^\n]*/i);
      const section = headingMatch ? headingMatch[0].trim() : undefined;

      if (trimmed.length <= maxChunkSize) {
        chunks.push({ content: trimmed, section, index: index++ });
      } else {
        // section itself too long, sub-chunk it
        for (const sub of fixedSizeChunks(trimmed, maxChunkSize, overlap)) {
          chunks.push({ content: sub, section, index: index++ });
        }
      }
    }

    return chunks;
  }

  return fixedSizeChunks(rawText, maxChunkSize, overlap).map((content, index) => ({
    content,
    index,
  }));
}

function fixedSizeChunks(text: string, maxSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxSize, text.length);
    chunks.push(text.slice(start, end).trim());
    start += maxSize - overlap;
  }

  return chunks.filter((c) => c.length > 0);
}

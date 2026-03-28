export type TranslationTarget = 'en' | 'zh-TW';

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
const MAX_CHUNK_CHARS = 450;

function stripFurigana(text: string): string {
  return text.replace(/｜([^｜\n]+)｜[^｜\n]+｜/g, '$1');
}

function chunkByLines(text: string): string[] {
  const lines = text.split('\n');
  const chunks: string[] = [];
  let current = '';

  for (const line of lines) {
    const next = current ? current + '\n' + line : line;
    if (next.length > MAX_CHUNK_CHARS && current) {
      chunks.push(current);
      current = line;
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

interface MyMemoryResponse {
  responseStatus: number;
  responseData: { translatedText: string };
  responseDetails?: string;
}

async function translateChunk(
  text: string,
  target: TranslationTarget,
): Promise<string> {
  const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(`ja|${target}`)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as MyMemoryResponse;
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails ?? 'Translation failed');
  }
  return data.responseData.translatedText;
}

export async function translateLyrics(
  lyrics: string,
  target: TranslationTarget,
): Promise<string> {
  const plain = stripFurigana(lyrics.trim());
  if (!plain) return '';
  const chunks = chunkByLines(plain);
  const results: string[] = [];
  for (const chunk of chunks) {
    results.push(await translateChunk(chunk, target));
  }
  return results.join('\n');
}

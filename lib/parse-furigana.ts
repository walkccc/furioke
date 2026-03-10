export type FuriganaToken =
  | { type: 'text'; value: string }
  | { type: 'ruby'; kanji: string; kana: string };

const RUBY_PATTERN = /｜([^｜]+)｜([^｜]+)｜/g;

export function parseFurigana(text: string): FuriganaToken[][] {
  const lines = text.split(/\r?\n/);

  return lines.map((line) => {
    RUBY_PATTERN.lastIndex = 0;
    const tokens: FuriganaToken[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null = null;

    while ((match = RUBY_PATTERN.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: 'text',
          value: line.slice(lastIndex, match.index),
        });
      }

      tokens.push({ type: 'ruby', kanji: match[1], kana: match[2] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      tokens.push({ type: 'text', value: line.slice(lastIndex) });
    }

    return tokens;
  });
}

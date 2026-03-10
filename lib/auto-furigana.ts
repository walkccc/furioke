import type { Builder, IpadicFeatures, Tokenizer } from 'kuromoji';

type KuromojiModule = {
  builder: (options: { dicPath: string }) => Builder;
};

type TokenWithReading = {
  surface_form: string;
  reading?: string;
  pronunciation?: string;
};

const KANJI_REGEX = /[\u3400-\u4dbf\u4e00-\u9faf]/;
const RUBY_PATTERN = /｜([^｜]+)｜([^｜]+)｜/g;
const WHITESPACE_PATTERN = /(\s+)/;

let tokenizerPromise: Promise<Tokenizer<IpadicFeatures>> | null = null;

const normalizeBasePath = (value?: string) => {
  const trimmed = value?.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return '';
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const getBasePath = () => {
  const envBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
  if (envBasePath) {
    return envBasePath;
  }
  const nextData =
    typeof window === 'undefined'
      ? undefined
      : (window as typeof window & {
          __NEXT_DATA__?: { assetPrefix?: string; basePath?: string };
        }).__NEXT_DATA__;
  return normalizeBasePath(nextData?.assetPrefix ?? nextData?.basePath);
};

const loadKuromoji = async (): Promise<KuromojiModule> => {
  const module = await import('kuromoji/build/kuromoji');
  return ((module as { default?: KuromojiModule }).default ??
    module) as KuromojiModule;
};

const getTokenizer = () => {
  if (!tokenizerPromise) {
    tokenizerPromise = loadKuromoji().then((kuromoji) => {
      const dicPath = `${getBasePath()}/kuromoji/dict`;
      return new Promise<Tokenizer<IpadicFeatures>>((resolve, reject) => {
        kuromoji.builder({ dicPath }).build((error, tokenizer) => {
          if (error || !tokenizer) {
            reject(error ?? new Error('Kuromoji tokenizer failed to load.'));
            return;
          }
          resolve(tokenizer);
        });
      });
    });
  }

  return tokenizerPromise;
};

const toHiragana = (value: string) =>
  value.replace(/[\u30a1-\u30f6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60),
  );

const hasKanji = (value: string) => KANJI_REGEX.test(value);

const formatToken = (token: TokenWithReading) => {
  const surface = token.surface_form ?? '';
  const reading = token.reading || token.pronunciation;

  if (!surface) {
    return '';
  }

  if (!reading || !hasKanji(surface)) {
    return surface;
  }

  const hiragana = toHiragana(reading);

  if (hiragana === surface) {
    return surface;
  }

  return `｜${surface}｜${hiragana}｜`;
};

const applyAutoFurigana = (
  tokenizer: Tokenizer<IpadicFeatures>,
  segment: string,
) =>
  segment
    .split(WHITESPACE_PATTERN)
    .map((chunk) =>
      chunk && !WHITESPACE_PATTERN.test(chunk)
        ? tokenizer
            .tokenize(chunk)
            .map((token) => formatToken(token as TokenWithReading))
            .join('')
        : chunk,
    )
    .join('');

export const autoAddFurigana = async (text: string) => {
  const tokenizer = await getTokenizer();
  const lines = text.split(/\r?\n/);

  return lines
    .map((line) => {
      if (!line) {
        return line;
      }

      const parts: string[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null = null;

      RUBY_PATTERN.lastIndex = 0;
      while ((match = RUBY_PATTERN.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            applyAutoFurigana(tokenizer, line.slice(lastIndex, match.index)),
          );
        }

        parts.push(match[0]);
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(applyAutoFurigana(tokenizer, line.slice(lastIndex)));
      }

      return parts.join('');
    })
    .join('\n');
};

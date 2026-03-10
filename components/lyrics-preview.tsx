import type { FuriganaToken } from '@/lib/parse-furigana';

type LyricsPreviewProps = {
  lines: FuriganaToken[][];
  title: string;
};

export default function LyricsPreview({ lines, title }: LyricsPreviewProps) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm backdrop-blur">
      <h2 className="mb-4 text-sm font-semibold tracking-[0.2em] text-muted">
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-lg leading-relaxed text-foreground">
        {lines.map((line, lineIndex) => (
          <div key={`line-${lineIndex}`} className="min-h-[1.5rem]">
            {line.length === 0
              ? '\u00A0'
              : line.map((token, tokenIndex) => {
                  if (token.type === 'text') {
                    return (
                      <span key={`text-${lineIndex}-${tokenIndex}`}>
                        {token.value}
                      </span>
                    );
                  }

                  return (
                    <ruby
                      key={`ruby-${lineIndex}-${tokenIndex}`}
                      className="font-semibold text-foreground"
                    >
                      {token.kanji}
                      <rt className="text-sm font-normal text-muted">
                        {token.kana}
                      </rt>
                    </ruby>
                  );
                })}
          </div>
        ))}
      </div>
    </div>
  );
}

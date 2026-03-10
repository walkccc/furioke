'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import LyricsEditor from '@/components/lyrics-editor';
import LyricsPreview from '@/components/lyrics-preview';
import { autoAddFurigana } from '@/lib/auto-furigana';
import { parseFurigana } from '@/lib/parse-furigana';

const FILE_NAME = 'lyrics.txt';
const LYRICS_CACHE_KEY = 'furioke:lyrics';
const THEME_KEY = 'furioke:theme';
const LANGUAGE_KEY = 'furioke:language';
const DEFAULT_LYRICS = `｜今日｜きょう｜はいい｜天気｜てんき｜だ
｜私｜わたし｜は｜音楽｜おんがく｜が好き`;

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
] as const;

type Language = (typeof LANGUAGE_OPTIONS)[number]['value'];
type ThemeMode = 'light' | 'dark';
const LANGUAGE_SHORT_LABELS: Record<Language, string> = {
  en: 'EN',
  zh: '繁',
  ja: '日',
};

const COPY: Record<
  Language,
  {
    heading: string;
    description: { leading: string; trailing: string };
    lyricsTitle: string;
    previewTitle: string;
    autoFurigana: string;
    importTxt: string;
    exportTxt: string;
    print: string;
    clear: string;
    dropToImport: string;
    placeholder: string;
    autoFuriganaError: string;
    themeLabel: string;
    languageLabel: string;
    light: string;
    dark: string;
    switchToLight: string;
    switchToDark: string;
  }
> = {
  en: {
    heading: 'Furioke',
    description: {
      leading: 'Paste lyrics using the ',
      trailing: ' format to see furigana rendered instantly.',
    },
    lyricsTitle: 'LYRICS',
    previewTitle: 'PREVIEW',
    autoFurigana: 'Auto Furigana',
    importTxt: 'Import TXT',
    exportTxt: 'Export TXT',
    print: 'Print',
    clear: 'Clear',
    dropToImport: 'Drop to import lyrics',
    placeholder: DEFAULT_LYRICS,
    autoFuriganaError:
      'Auto furigana failed to load. Please try again or refresh the page.',
    themeLabel: 'Theme',
    languageLabel: 'Language',
    light: 'Light',
    dark: 'Dark',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
  },
  zh: {
    heading: 'Furioke',
    description: {
      leading: '使用 ',
      trailing: ' 格式貼上歌詞，即可即時顯示振假名。',
    },
    lyricsTitle: '歌詞',
    previewTitle: '預覽',
    autoFurigana: '自動振假名',
    importTxt: '匯入 TXT',
    exportTxt: '匯出 TXT',
    print: '列印',
    clear: '清空',
    dropToImport: '拖放以匯入歌詞',
    placeholder: DEFAULT_LYRICS,
    autoFuriganaError: '自動振假名載入失敗，請重試或重新整理頁面。',
    themeLabel: '主題',
    languageLabel: '語言',
    light: '淺色',
    dark: '深色',
    switchToLight: '切換到淺色模式',
    switchToDark: '切換到深色模式',
  },
  ja: {
    heading: 'フリオケ',
    description: {
      leading: '「',
      trailing: '」形式で歌詞を貼り付けると、ふりがながすぐに表示されます。',
    },
    lyricsTitle: '歌詞',
    previewTitle: 'プレビュー',
    autoFurigana: '自動振り仮名',
    importTxt: 'TXT取り込み',
    exportTxt: 'TXT書き出し',
    print: '印刷',
    clear: 'クリア',
    dropToImport: 'ドロップして歌詞を読み込み',
    placeholder: DEFAULT_LYRICS,
    autoFuriganaError:
      '自動振り仮名の取得に失敗しました。もう一度お試しください。',
    themeLabel: 'テーマ',
    languageLabel: '言語',
    light: 'ライト',
    dark: 'ダーク',
    switchToLight: 'ライトモードに切り替え',
    switchToDark: 'ダークモードに切り替え',
  },
};

export default function HomePage() {
  const [lyrics, setLyrics] = useState(DEFAULT_LYRICS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasAutoFuriganaError, setHasAutoFuriganaError] = useState(false);
  const [isAutoFuriganaLoading, setIsAutoFuriganaLoading] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<Language>('en');

  const copy = COPY[language];

  const parsedLines = useMemo(() => parseFurigana(lyrics), [lyrics]);

  useEffect(() => {
    const cachedLyrics = localStorage.getItem(LYRICS_CACHE_KEY);
    if (cachedLyrics !== null) {
      setLyrics(cachedLyrics);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
      return;
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (
      storedLanguage === 'en' ||
      storedLanguage === 'zh' ||
      storedLanguage === 'ja'
    ) {
      setLanguage(storedLanguage);
      return;
    }

    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith('ja')) {
      setLanguage('ja');
    } else if (browserLanguage.startsWith('zh')) {
      setLanguage('zh');
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    localStorage.setItem(LYRICS_CACHE_KEY, lyrics);
  }, [isHydrated, lyrics]);

  const handleExport = () => {
    const blob = new Blob([lyrics], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = FILE_NAME;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleImport = (text: string) => {
    setLyrics(text);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClear = () => {
    setLyrics('');
  };

  const handleAutoFurigana = async () => {
    setHasAutoFuriganaError(false);
    setIsAutoFuriganaLoading(true);

    try {
      const nextLyrics = await autoAddFurigana(lyrics);
      setLyrics(nextLyrics);
    } catch (error) {
      console.error('Auto furigana failed', error);
      setHasAutoFuriganaError(true);
    } finally {
      setIsAutoFuriganaLoading(false);
    }
  };

  const handleToggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const handleToggleLanguage = () => {
    const index = LANGUAGE_OPTIONS.findIndex(
      (option) => option.value === language,
    );
    const nextIndex = (index + 1) % LANGUAGE_OPTIONS.length;
    setLanguage(LANGUAGE_OPTIONS[nextIndex].value);
  };

  const isLightTheme = theme === 'light';
  const ThemeIcon = isLightTheme ? Sun : Moon;
  const currentLanguage = LANGUAGE_OPTIONS.find(
    (option) => option.value === language,
  );

  return (
    <main className="app-shell min-h-screen px-6 py-10">
      <div className="container mx-auto flex w-full flex-col gap-8">
        <header className="flex flex-col gap-4">
          {/* Top Row: Title and Controls */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-foreground text-4xl font-black tracking-tight md:text-5xl">
              {copy.heading}
            </h1>

            {/* Controls - Stays vertically aligned with the H1 text only */}
            <div className="no-print bg-surface flex flex-none items-center gap-1 rounded-full px-1.5 py-1 ring-1 ring-[color:var(--border)]">
              <button
                type="button"
                onClick={handleToggleTheme}
                aria-label={
                  isLightTheme ? copy.switchToDark : copy.switchToLight
                }
                title={isLightTheme ? copy.switchToDark : copy.switchToLight}
                className="text-muted hover:bg-surface-hover hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition"
              >
                <ThemeIcon className="h-4 w-4" />
              </button>

              <span className="h-5 w-px bg-[color:var(--border)] opacity-70" />

              <button
                type="button"
                onClick={handleToggleLanguage}
                aria-label={`${copy.languageLabel}: ${currentLanguage?.label}`}
                title={`${copy.languageLabel}: ${currentLanguage?.label}`}
                className="text-muted hover:bg-surface-hover hover:text-foreground flex h-8 min-w-[2.25rem] cursor-pointer items-center justify-center rounded-full px-2 text-xs font-semibold transition"
              >
                {LANGUAGE_SHORT_LABELS[language]}
              </button>
            </div>
          </div>

          {/* Bottom Row: Description */}
          <p className="text-muted text-sm leading-relaxed md:text-base">
            {copy.description.leading}
            <code className="bg-surface-hover text-muted-strong inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ring-1 ring-[color:var(--border)] ring-inset md:text-xs">
              ｜漢字｜かな｜
            </code>
            {copy.description.trailing}
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="no-print">
            <LyricsEditor
              value={lyrics}
              onChange={setLyrics}
              onImport={handleImport}
              onExport={handleExport}
              onAutoFurigana={handleAutoFurigana}
              onClear={handleClear}
              onPrint={handlePrint}
              isAutoFuriganaLoading={isAutoFuriganaLoading}
              labels={{
                title: copy.lyricsTitle,
                autoFurigana: copy.autoFurigana,
                importTxt: copy.importTxt,
                exportTxt: copy.exportTxt,
                print: copy.print,
                clear: copy.clear,
                placeholder: copy.placeholder,
                dropToImport: copy.dropToImport,
              }}
            />
          </div>

          <div className="print-area">
            <LyricsPreview lines={parsedLines} title={copy.previewTitle} />
          </div>
        </section>

        {hasAutoFuriganaError ? (
          <p className="no-print text-error text-sm">
            {copy.autoFuriganaError}
          </p>
        ) : null}
      </div>
    </main>
  );
}

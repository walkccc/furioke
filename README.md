# Furioke

Furioke is a lightweight karaoke-style lyric editor that renders furigana from
`｜漢字｜かな｜` markup and can auto-generate readings with Kuromoji.

## Features

- Live preview for furigana markup.
- Auto furigana generation for Japanese lyrics.
- Import/export plain text and print-friendly preview.
- Static export friendly (GitHub Pages-ready).

## Furigana Format

Wrap kanji + reading like this:

```txt
｜今日｜きょう｜はいい｜天気｜てんき｜だ
｜私｜わたし｜は｜音楽｜おんがく｜が好き
```

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the app.

## Build & Export

```bash
npm run build
```

The app is configured for static export. Production builds assume the repo name
`furioke` for the base path (GitHub Pages).

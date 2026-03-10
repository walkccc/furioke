# Prompt

You are a senior frontend engineer.

Create a **simple web app using Next.js (App Router) + TypeScript +
TailwindCSS**.

The purpose of the app is to help users **practice singing Japanese songs** by
displaying **furigana (振り仮名)** above kanji.

Spotify lyrics usually only contain kanji, which makes it hard to know how to
pronounce them when singing.

Keep the implementation **minimal and clean**. No unnecessary complexity.

## Core Feature

Users can paste lyrics using a **simple inline furigana syntax**:

```
｜今日｜きょう｜
｜君｜きみ｜のことが好き
```

Meaning:

```
｜漢字｜かな｜
```

Render it as **furigana HTML** like:

HTML <ruby>  
 今日  
 <rt>きょう</rt>  
</ruby>

## Requirements

### 1. Editor

A textarea where users can paste lyrics.

Example input:

```
｜今日｜きょう｜はいい｜天気｜てんき｜だ
｜私｜わたし｜は｜音楽｜おんがく｜が好き
```

### 2. Rendered Lyrics

Display formatted lyrics below the editor using proper HTML:

Use:

```
<ruby>
<rt>
```

Each line should preserve line breaks.

### 3. Simple Parser

Implement a small parser that converts:

```
｜漢字｜かな｜
```

into:

<ruby>漢字<rt>かな</rt></ruby>

Rules:

- syntax always starts with `｜`
- format is `｜kanji｜kana｜`
- everything else remains unchanged
- support multiple tags per line

### 4. Import / Export

Add two buttons:

**Export**

Download the lyrics as JSON file:

```json
{
  "lyrics": "...text..."
}
```

**Import**

Upload the JSON file and restore the editor content.

### 5. Print to PDF

Add a **Print button** that calls:

```
window.print()
```

Use simple print CSS so that:

- editor is hidden
- only formatted lyrics appear
- clean A4 layout

### 6. UI Layout

Simple layout:

Title: Easy Japanese Lyrics by Furigara

[ textarea editor ]

[ Import ] [ Export ] [ Print ]

[ rendered lyrics preview ]

Use TailwindCSS.

### 7. Technical Requirements

Use:

- Next.js (App Router)
- TypeScript
- TailwindCSS
- React functional components

Structure example:

```
/app/page.tsx
/components/lyrics-editor.tsx
/components/lyrics-preview.tsx
/lib/parse-furigana.ts
```

### 8. Parsing Function

Example behavior:

Input:

```
｜今日｜きょう｜はいい｜天気｜てんき｜
```

Output HTML equivalent:

<ruby>今日<rt>きょう</rt></ruby>はいい<ruby>天気<rt>てんき</rt></ruby>

### 9. Keep it Simple

Avoid:

- databases
- authentication
- backend APIs
- heavy libraries

Everything runs **client-side only**.

### 10. Bonus (optional)

If easy to implement:

Add a **copy rendered lyrics button**.

Generate **complete working code** for this project.

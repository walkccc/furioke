# Next.js Rules

## Design & Styling

Style: shadcn/ui · Zesty · Minimal · Modern

Colors:

- Primary: #6B8C66
- Secondary: #E68C40

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4

## File Access Rules (Critical)

Default assumption: All files not explicitly named by the user are irrelevant.

Rules:

- Do NOT scan the repository
- Do NOT read files unless explicitly listed
- Do NOT infer behavior from unrelated files
- ASK before reading if required files are missing

## Naming Conventions

Files:

- kebab-case
- lowercase only

Component Props:

- Must use a named `interface`
- Must be named `<ComponentName>Props`
- No inline prop typing

## Component Rules

- Do not use arrow-function components
- Never use `export default`
- Use named exports only

## Import Rules

- Do not use relative imports (`./` or `../`) for shared or reusable code
- Always use absolute imports via the `@/` alias

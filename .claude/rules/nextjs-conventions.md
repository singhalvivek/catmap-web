# Rule: Next.js & TypeScript Conventions

## Component Files
- `PascalCase.tsx` for all React components.
- One component per file. Export the component as a named export.
- Co-locate sub-components in a sub-folder when there are 3+ related pieces:
  ```
  components/details/
    DetailsPanel.tsx      ← orchestrator
    NodeHeader.tsx
    NodeDescription.tsx
    ResourceList.tsx
    ProgressPicker.tsx
    FeedbackForm.tsx
  ```

## Server vs Client Components
- Default to **Server Components** — no directive needed.
- Add `"use client"` only when the component uses: `useState`, `useEffect`, event handlers, browser APIs, or context.
- Never put data loading (JSON imports, Firestore calls) inside a client component — load in a Server Component and pass as props.

## Hooks
- `camelCase.ts`, prefixed with `use`.
- Hooks live in the closest `lib/` folder to where they're used.
- Each hook has one clear responsibility.

## Imports
- Use the `@/*` path alias, never relative `../../` chains longer than one level.
- Order: React → Next.js → third-party → internal (`@/`) → relative.
- No default exports except for `page.tsx`, `layout.tsx`, and `error.tsx` (Next.js requirements).

## TypeScript
- No `any`. Use `unknown` and narrow it, or define a proper type.
- Prefer `type` over `interface` for data shapes; use `interface` only for extensible contracts.
- Enums → use `const` objects with `as const` or TypeScript `enum` (both are fine; be consistent per file).
- JSON imports typed via explicit `as SomeType[]` after load, not inline in the import.

## Styling
- Tailwind utility classes inline on elements.
- Shared multi-class combinations (3+ classes used together in 3+ places) → extract to a CSS utility class in `globals.css`.
- CSS variables for theme tokens — always reference via `var(--token-name)` not the raw hex.
- No inline `style={{}}` except for truly dynamic values (e.g. calculated widths).

## Navigation
- Internal links: `next/link` — never `<a href="/">`.
- External links: `<a href="..." target="_blank" rel="noopener noreferrer">`.

## Images
- Always `next/image` with `alt` text. Never `<img>`.

## API Routes
- Validate the request body before processing.
- Return typed `Response.json()` with correct HTTP status codes.
- Never return `{ success: true }` when the underlying operation failed.

## Metadata
- Each `page.tsx` exports `generateMetadata()` with a unique `title` and `description`.
- Root layout sets defaults; pages override them.

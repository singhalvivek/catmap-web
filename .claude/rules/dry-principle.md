# Rule: DRY Principle

Don't Repeat Yourself. If the same logic, structure, or value appears in two places, it belongs in one.

## Logic
- If a function is called from 2+ places with the same logic, extract it to a util in `lib/`.
- If a hook's logic is needed in 2+ components, it's a custom hook in `lib/`.
- If a Firestore operation is needed in 2+ places, it belongs in `progressStore.ts` or a new service file.

## UI / JSX
- If the same JSX block appears in 2+ components, extract it as a component.
- If the same Tailwind class combination is used in 3+ places, define a utility class in `globals.css`.
- If the same conditional rendering pattern repeats, extract to a component with the logic inside.

## Data & Constants
- String literals used in 2+ places → constant in `src/constants/`.
- Route paths referenced in 2+ places → constant in `src/constants/routes.ts`.
- Event names (like `"progress-updated"`) → constant in `src/constants/events.ts`.
- Tailwind color classes tied to a theme token → CSS variable in `globals.css`.

## Types
- If the same type shape is used in 2+ files, it belongs in `models/`.
- Don't redefine a type inline when one already exists in `models/`.

## What is NOT a DRY violation
- Two components that look similar but have different responsibilities — similarity is not duplication.
- Two functions with the same shape but different domains — don't over-abstract.
- Test code that mirrors implementation code — tests should be readable in isolation.

# U004 — the dark theme

## Goal

A dark theme that follows the reader's system setting by default, with an explicit override
that persists, and no flash of the wrong theme on load.

## Why this is mostly free

U002 moved the site onto a token layer. Where a component reads `var(--ink)` rather than
`#1E3A5F`, dark mode costs nothing: redefine the token and the component follows. So the
work splits into two unrelated halves.

1. **Redefining the tokens** — one block in `globals.css`, plus the handful of rules that
   cannot simply follow a token.
2. **Converting what U002 did not reach** — 443 hardcoded colour literals across 41 files,
   concentrated in three directories that U002 had deferred: the daily challenge (233), the
   PYQ paper and mock (100), the daily essay (67).

The second half is mechanical, has no ordering dependency on the first, and sits in disjoint
directories, which is why it was parallelised.

## The palette

Not an inversion. The light system is cream over navy ink, so the dark one is navy ground
under warm off-white: the newspaper character survives, and a reader at night does not get a
slab of white.

| token | light | dark |
| --- | --- | --- |
| `--paper` | `#fcf9f2` | `#111823` |
| `--paper-sunk` | `#f4efe3` | `#1a2230` |
| `--ink` | `#101a2b` | `#f3ede1` |
| `--ink-soft` | `#35425a` | `#c2bcae` |
| `--ink-faint` | `#5a6478` | `#968f82` |
| `--rule` / `-firm` / `-hard` | `#d7cfbe` / `#ada38e` / `#8c8270` | `#242d3c` / `#333f52` / `#5d6a7e` |
| `--accent` / `-text` | `#0d8b7f` / `#0a675f` | `#2dd4bf` / `#5eead4` |
| `--correct-text` | `#0f6b3c` | `#5fd3a0` |
| `--wrong-text` | `#b3261e` | `#ff9b8f` |
| `--caution-text` | `#8a5200` | `#e3b35f` |
| `--review-text` | `#5b2cc2` | `#bda3ff` |

Every dark pairing was measured before it was written, against the same thresholds the light
system holds: each `-text` on `--paper`, on `--paper-sunk` and on its own `-wash`;
`--rule-hard` against the 3:1 WCAG 1.4.11 asks of a non-text indicator. The weakest is
`--ink-faint` on `--paper-sunk` at 4.98:1, and `--rule-hard` at 3.25:1. Nothing is close
enough to the line to be a guess.

## The three things that could not follow a token

1. **`.ed-invert` and `.site-footer` set `background: var(--ink)` with `color: #fff`.**
   In the dark theme `--ink` is near-white, so that band would have been white on white.
   They take `--invert-bg` / `--invert-ink` / `--invert-ink-soft` / `--invert-rule`, which
   flip independently. In dark the band is a *raised* panel (`#232c3b`) with light type
   rather than a true invert — a cream slab at the foot of a dark page is exactly the glare
   a dark theme exists to avoid.
2. **The paper grain** is a dark turbulence tile multiplied over cream; over a dark ground it
   reads as dirt. It is inverted and dialled back rather than removed, because the texture is
   half of why the page does not look like a template.
3. **`--trust-navy`** is still read as a text colour by files U002 has not reached, and
   `#1e3a5f` on a dark ground is close to invisible. In dark it aliases `--ink`, which is a
   bridge and not an endorsement — Phase 16 still retires it, and new code must not use it.

## Plumbing

- **`ThemeScript`** runs synchronously in `<head>` and sets `data-theme` before any paint.
  It writes the attribute **only** for an explicit choice; with none stored the attribute
  stays absent and the CSS follows `prefers-color-scheme` on its own. So the system default
  needs no JavaScript and survives the script failing.
- **`<html suppressHydrationWarning>`**, because that script changes the element the server
  rendered, by design, on that one node.
- **`color-scheme`** is set per theme, so form controls, scrollbars and the caret follow.
- **`themeColor`** in the viewport export, so the browser chrome follows too.
- **`ThemeToggle`** reads through `useSyncExternalStore`. The theme is an external store in
  two places at once — an explicit choice in `localStorage` and the system setting behind it
  — so the button also tracks the system flipping while the page is open, which it does on a
  machine set to switch at sunset. A `useEffect` + `setState` version would not, and is
  what the project's lint rule objects to.

The attribute carries three states, not two: `dark`, `light`, and absent for "follow the
system". Dropping the third would mean a reader who has never touched the toggle is pinned
to whatever the build decided.

## Acceptance

- `npm run contrast` passes in **both** themes across every surface.
- No flash of the wrong theme on a hard load with an explicit choice stored.
- The system default works with JavaScript disabled.
- No behaviour change anywhere: this is colour, and the two components added are a toggle
  and an inline script.

---

## What the measurement found that reading would not have

The palette was designed against computed ratios before a line of it shipped, so the tokens
themselves were never the problem. Every failure was a component holding a colour the token
layer could not reach. `npm run contrast` in both themes went 30 → 10 → 1 → 0.

**The biggest one was two lines of the Next.js starter.** `body` still read
`--background: #ffffff` and `--foreground: #171717`, so every element that sets no colour of
its own inherited near-black — fine on cream, invisible on navy. That single pair accounted
for most of the first round, and no amount of auditing components would have found it,
because the components were correct.

**Four more were a fill confused with a band.** `background: var(--ink)` means two different
things: a solid button, which inverts correctly and should (a dark page wants a light
button), and a page-wide dark bar, which must NOT invert or the dark theme grows a cream
slab. The second group — the home roadmap plate, the essay header and nav bars, the archive
bar — moved to `--invert-*`. The buttons were left alone.

**Two were text on a fill that does not flip.** `--accent-bright` is the same teal in both
themes, so text on it must be dark in both; it was `--ink`, which becomes near-white and
landed at 1.60:1. That is `--on-accent`, fixed at the ink value, 9.36:1 either way.

**And `#fff` as the text on an ink fill** was white-on-white in dark on every primary button
on the site, and about 2:1 on the correct/wrong option keys where the fill becomes a bright
status colour. `--on-fill` is `var(--paper)`, which needs no dark override at all: text on a
fill is the page ground in both themes.

## Verified behaviour

- System default, nothing stored: the attribute is absent and the CSS alone produces
  `#fcf9f2` or `#111823`. Works with JavaScript off.
- An explicit choice beats the system setting.
- No flash: read at `DOMContentLoaded`, before React hydrates, the attribute is already set
  and the body already painted dark.
- The toggle persists across a reload and reports `aria-pressed` correctly.

## Still carrying literals

53, down from 443. The remainder are deliberate: `subjectMeta.ts` and `progress.ts` hold
per-subject identity colours (data, not theme), `ogImage`/`brand` must stay literal because
`ImageResponse` renders at the edge where custom properties do not resolve, and twelve are
translucent `rgba()` in the daily challenge that no token carries an alpha for.

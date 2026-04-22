# Rule: No Secrets or Credentials in Code

## What counts as a secret
- Firebase API keys (`AIzaSy...`)
- Firebase project IDs used as fallbacks
- Webhook URLs (Google Sheets, Slack, etc.)
- Any `process.env.*` value hardcoded as a fallback: `process.env.X ?? "real-value"`
- Auth tokens, bearer tokens, private keys

## Rules

1. **Never hardcode a secret as a fallback.** If an env var is missing, throw a clear error:
   ```typescript
   if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
     throw new Error("Missing env var: NEXT_PUBLIC_FIREBASE_API_KEY");
   }
   ```

2. **All secrets go in `.env.local` only.** `.env.local` must be in `.gitignore`.

3. **`NEXT_PUBLIC_*` vars are public by design** (compiled into client bundle). They still must not be hardcoded in source — the distinction is that Firebase web keys are low-risk, but the principle of no hardcoded values is non-negotiable.

4. **Before any commit**, grep for known secret patterns:
   ```bash
   grep -r "AIzaSy" src/
   grep -r "webhook" src/ --include="*.ts" --include="*.tsx"
   ```

5. **The `config/env.ts` pattern is the approved way** to validate required env vars at startup. Add new required vars there.

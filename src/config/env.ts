function required(name: string, value?: string) {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const ENV = {
  SHEETS_WEBHOOK_URL: required(
    "SHEETS_WEBHOOK_URL",
    process.env.SHEETS_WEBHOOK_URL
  ),
  FIREBASE_API_KEY: required(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  ),
  FIREBASE_AUTH_DOMAIN: required(
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  ),
  FIREBASE_PROJECT_ID: required(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ),
  FIREBASE_STORAGE_BUCKET: required(
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  ),
  FIREBASE_MESSAGING_SENDER_ID: required(
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  ),
  FIREBASE_APP_ID: required(
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  ),
  FIREBASE_MEASUREMENT_ID: required(
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  ),
};

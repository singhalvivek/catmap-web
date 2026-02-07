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
};

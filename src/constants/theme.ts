// theme — the one spelling of the theme choice, shared by the inline script and the toggle

export const THEME_STORAGE_KEY = "sn_theme";

export type ThemeChoice = "light" | "dark" | "system";

/** The attribute is absent for "system", so the CSS can follow prefers-color-scheme alone. */
export const THEME_ATTRIBUTE = "data-theme";

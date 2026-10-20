// ThemeScript — sets the theme attribute before first paint, so the page never flashes
import { THEME_STORAGE_KEY } from "@/constants/theme";

/**
 * Runs synchronously in <head>, ahead of any paint. Without it a reader who has chosen a
 * theme that differs from their system setting sees the system one for a frame first,
 * which on a cream-to-navy swing is not subtle.
 *
 * It sets the attribute only for an explicit choice. With no choice stored the attribute
 * stays absent and the CSS follows prefers-color-scheme on its own, so the system default
 * needs no JavaScript at all and survives the script failing.
 */
export default function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY
  )});if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;

  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

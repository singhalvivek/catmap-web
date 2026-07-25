// useIsHydrated — true only after client hydration, for values that must stay out of prerendered HTML
import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Returns false during SSR/prerender and true once hydrated.
 *
 * Use it to gate anything derived from the clock inside a component that can be
 * statically prerendered: rendering such a value directly bakes the build day's
 * output into the HTML and mismatches on hydration.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribeNever, onClient, onServer);
}

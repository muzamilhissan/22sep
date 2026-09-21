import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// true in the browser, false during server render — without a setState-in-effect re-render
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

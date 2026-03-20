import { useEffect } from "react";

type ShortcutHandler = (e: KeyboardEvent) => void;

export function useKeyboardShortcuts(handler: ShortcutHandler, deps: unknown[] = []) {
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, deps);
}

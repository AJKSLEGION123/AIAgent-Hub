import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      const payload = JSON.stringify(value);
      if (payload.length > 4 * 1024 * 1024) {
        console.warn(`useLocalStorage: ${key} near limit (${(payload.length / 1024).toFixed(0)}KB)`);
      }
      localStorage.setItem(key, payload);
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

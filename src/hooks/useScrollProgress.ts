import { useState, useEffect } from "react";

export function useScrollProgress(): number {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          setPct(h > 0 ? Math.round(window.scrollY / h * 100) : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return pct;
}

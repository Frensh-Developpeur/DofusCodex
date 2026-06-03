import { useEffect, useState } from "react";

export function toLocalIsoDate(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseLocalIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function shiftLocalIsoDate(iso: string, days: number): string {
  const d = parseLocalIsoDate(iso);
  d.setDate(d.getDate() + days);
  return toLocalIsoDate(d);
}

export function useTodayIso(): string {
  const [today, setToday] = useState(() => toLocalIsoDate());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      setToday(toLocalIsoDate());
      const next = new Date();
      next.setHours(24, 0, 1, 0);
      timeout = setTimeout(schedule, Math.max(1000, next.getTime() - Date.now()));
    };

    const onVisibilityChange = () => {
      if (!document.hidden) setToday(toLocalIsoDate());
    };

    schedule();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return today;
}

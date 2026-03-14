import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(isDark));
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative cursor-pointer w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none border border-surface-200 dark:border-surface-700"
      style={{
        backgroundColor: isDark
          ? "var(--color-surface-700)"
          : "var(--color-surface-100)",
      }}
      aria-label="Toggle dark mode"
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 shadow-sm ${
          isDark ? "translate-x-6" : "translate-x-0.5"
        }`}
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}

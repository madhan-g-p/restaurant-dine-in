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
      className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none"
      style={{
        backgroundColor: isDark
          ? "var(--color-primary-600)"
          : "var(--border-color)",
      }}
      aria-label="Toggle dark mode"
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
          isDark ? "translate-x-7" : "translate-x-0.5"
        }`}
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}

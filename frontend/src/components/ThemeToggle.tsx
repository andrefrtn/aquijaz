import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_KEY = "aquijaz_theme";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = saved === "dark" || saved === "light" ? saved : prefersDark ? "dark" : "light";

    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
      className="inline-flex h-11 w-11 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}

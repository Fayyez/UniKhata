import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const getSystemTheme = (): Theme =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const getInitialTheme = (): Theme => {
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved ?? "system";
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const applyTheme = (value: Theme) => {
    if (value === "system") {
      document.documentElement.classList.toggle(
        "dark",
        getSystemTheme() === "dark"
      );
      localStorage.removeItem("theme");
    } else {
      document.documentElement.classList.toggle("dark", value === "dark");
      localStorage.setItem("theme", value);
    }
  };

  useEffect(() => {
    applyTheme(theme);

    const listener = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) =>
      prev === "dark" ? "light" : prev === "light" ? "system" : "dark"
    );
    const newTheme =
      theme === "light" ? "dark" : theme === "dark" ? "light" : "light";
    applyTheme(newTheme); // immediately apply to DOM
    setTheme(newTheme); // update React state
  };

  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

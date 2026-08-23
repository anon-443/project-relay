/** Night Ledger toggle: persistent, low-noise, and available on every primary workspace surface. */
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "Night Ledger" : "Light Ledger"}`}><span>{theme === "light" ? <Moon size={15} /> : <Sun size={15} />}</span><b>{theme === "light" ? "Night" : "Light"}</b></button>;
}

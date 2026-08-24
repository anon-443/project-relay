/** Night Ledger toggle: persistent, low-noise, and available on every primary workspace surface. */
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isNight = theme === "dark";
  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-pressed={isNight} aria-label={`Switch to ${isNight ? "light" : "night"} mode`} title={`Switch to ${isNight ? "Light Ledger" : "Night Ledger"}`}><span className="theme-toggle-icon" aria-hidden="true">{isNight ? <Sun size={16} /> : <Moon size={16} />}</span><span className="theme-toggle-copy"><small>MODE</small><b>{isNight ? "LIGHT" : "NIGHT"}</b></span></button>;
}

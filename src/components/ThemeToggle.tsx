import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useThemePersistence } from "@/hooks/useThemePersistence";

export function ThemeToggle() {
  const { theme, setTheme } = useThemePersistence();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative h-9 w-9 rounded-full border border-accent/20 bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:shadow-glow"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-accent" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-accent" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useThemePersistence() {
  const { theme, setTheme } = useTheme();

  // Save theme preference when it changes
  useEffect(() => {
    if (theme && theme !== 'system') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return { theme, setTheme };
}
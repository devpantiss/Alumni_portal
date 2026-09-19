import { Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
      title={`Switch to ${dark ? 'light' : 'dark'} theme`}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}

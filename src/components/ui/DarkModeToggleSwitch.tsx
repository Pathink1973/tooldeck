import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface DarkModeToggleSwitchProps {
  className?: string;
}

export const DarkModeToggleSwitch: React.FC<DarkModeToggleSwitchProps> = ({ className }) => {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      role="switch"
      aria-checked={darkMode}
      className={`landing-theme-toggle group relative inline-flex h-9 w-[72px] items-center rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${className ?? ''}`}
    >
      <span className="sr-only">Alternar modo</span>

      {/* Track */}
      <span
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          darkMode
            ? 'bg-[#0f1623] border border-white/10 shadow-inner shadow-black/40'
            : 'bg-white/90 border border-slate-200 shadow-sm shadow-slate-300/50'
        }`}
      />

      {/* Glow behind thumb */}
      <span
        className={`absolute rounded-full blur-md transition-all duration-500 w-7 h-7 top-1 ${
          darkMode ? 'left-[38px] bg-sky-400/30' : 'left-1 bg-amber-400/30'
        }`}
      />

      {/* Thumb */}
      <span
        className={`relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          darkMode
            ? 'translate-x-[38px] bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10'
            : 'translate-x-1 bg-gradient-to-br from-white to-amber-50 border border-amber-200/60'
        }`}
      >
        {darkMode
          ? <Moon className="h-3.5 w-3.5 text-sky-300" />
          : <Sun className="h-3.5 w-3.5 text-amber-500" />
        }
      </span>

      {/* Active shimmer line on track */}
      <span
        className={`absolute bottom-0 left-3 right-3 h-px rounded-full transition-all duration-500 ${
          darkMode
            ? 'bg-gradient-to-r from-transparent via-sky-400/40 to-transparent opacity-100'
            : 'bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-100'
        }`}
      />
    </button>
  );
};

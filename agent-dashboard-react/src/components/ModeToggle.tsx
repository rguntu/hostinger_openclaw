import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5 text-yellow-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
};
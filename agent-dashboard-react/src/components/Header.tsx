import React from 'react';
import { ModeToggle } from './ModeToggle';
import { CpuChipIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <CpuChipIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Agent Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">
            Monitor and manage your agents
          </div>
          <ModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
    </header>
  );
};
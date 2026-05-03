import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaSync } from 'react-icons/fa';

interface HeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, loading }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agent Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and manage your agent instances
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-lg ${
              loading 
                ? 'bg-gray-200 dark:bg-dark-700 text-gray-500 cursor-not-allowed' 
                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/50'
            } transition-colors`}
          >
            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors"
          >
            {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
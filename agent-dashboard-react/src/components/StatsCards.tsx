import React from 'react';
import { PlayCircleIcon, PauseCircleIcon, CheckCircleIcon, QueueListIcon, ArrowTrendingUpIcon, ClockIcon } from '@heroicons/react/24/outline';

interface StatsCardsProps {
  runningCount: number;
  stoppedCount: number;
  completedCount: number;
  totalCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  runningCount,
  stoppedCount,
  completedCount,
  totalCount
}) => {
  // Static values for gateway stats (typically would come from props/state)
  const successRate = 97.2; // Example success rate
  const tasksCompleted = 452;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* Running Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Running</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{runningCount}</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
            <PlayCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${totalCount > 0 ? (runningCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stopped Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Stopped</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stoppedCount}</p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
            <PauseCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full" 
              style={{ width: `${totalCount > 0 ? (stoppedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Completed Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{completedCount}</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Gateway Success Rate Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Gateway Success</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{successRate}%</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Overall success rate</p>
        </div>
      </div>

      {/* Total Tasks Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Tasks Done</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{tasksCompleted}</p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
            <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Completed today</p>
        </div>
      </div>
    </div>
  );
};
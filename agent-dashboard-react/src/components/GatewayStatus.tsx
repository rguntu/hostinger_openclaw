import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Gateway status data
const GatewayStatusCard: React.FC<{ 
  darkMode: boolean; 
  onRefresh: () => void; 
  gatewayStatus: 'online' | 'sleeping' | 'offline'; 
  tasks: number;
  successes: number;
  failures: number;
}> = ({ darkMode, onRefresh, gatewayStatus, tasks, successes, failures }) => {
  const statusColors = {
    online: 'text-green-500',
    sleeping: 'text-yellow-500', 
    offline: 'text-red-500'
  };
  
  const statusBgColors = {
    online: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    sleeping: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    offline: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };
  
  const statusText = {
    online: 'Operational',
    sleeping: 'Sleeping (Mac)',
    offline: 'Offline'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white">OpenClaw Gateway</h3>
        <button 
          onClick={onRefresh}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
        >
          Refresh
        </button>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBgColors[gatewayStatus]}`}>
            <span className={`h-2 w-2 rounded-full mr-1.5 ${statusColors[gatewayStatus]} ${
              gatewayStatus === 'online' ? 'animate-pulse' : ''
            }`}></span>
            {statusText[gatewayStatus]}
          </span>
          
          {gatewayStatus === 'sleeping' && (
            <div className="ml-3 flex items-center text-xs text-yellow-500 dark:text-yellow-400">
              <svg className="-ml-1 mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              On Mac systems, OpenClaw may sleep
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{tasks}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{successes}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Success</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{failures}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Failed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GatewayChartData {
  time: string[];
  successRate: number[];
  failureRate: number[];
}

// Gateway chart component
const GatewayChart: React.FC<{ 
  darkMode: boolean; 
  chartData: GatewayChartData 
}> = ({ darkMode, chartData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151',
        }
      },
      title: {
        display: true,
        text: 'Success/Failure Trends (Last 24 Hours)',
        color: darkMode ? '#e5e7eb' : '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
      },
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
      },
    },
  };

  const data = {
    labels: chartData.time,
    datasets: [
      {
        label: 'Success Rate',
        data: chartData.successRate,
        borderColor: 'rgb(72, 187, 120)',
        backgroundColor: 'rgba(72, 187, 120, 0.5)',
      },
      {
        label: 'Failure Rate',
        data: chartData.failureRate,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
      <Line options={options} data={data} />
    </div>
  );
};

export { GatewayStatusCard, GatewayChart };
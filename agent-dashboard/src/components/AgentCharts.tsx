import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Agent, AgentStatus } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AgentChartsProps {
  agents: Agent[];
}

const AgentCharts: React.FC<AgentChartsProps> = ({ agents }) => {
  // Prepare data for status distribution chart
  const statusCounts: Record<AgentStatus, number> = {
    running: 0,
    stopped: 0,
    completed: 0,
    error: 0,
  };

  agents.forEach(agent => {
    statusCounts[agent.status]++;
  });

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Agent Status Distribution',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',   // Running - green
          'rgba(239, 68, 68, 0.8)',    // Stopped - red
          'rgba(59, 130, 246, 0.8)',   // Completed - blue
          'rgba(245, 158, 11, 0.8)',   // Error - amber
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for agent types chart
  const typeMap = agents.reduce((acc, agent) => {
    acc[agent.type] = (acc[agent.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = {
    labels: Object.keys(typeMap),
    datasets: [
      {
        label: 'Agent Types',
        data: Object.values(typeMap),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for performance chart
  const activeAgents = agents.filter(agent => agent.status === 'running');
  const performanceLabels = activeAgents.slice(0, 5).map(agent => agent.name);
  const cpuData = activeAgents.slice(0, 5).map(agent => agent.metrics.cpuUsage || 0);
  const memoryData = activeAgents.slice(0, 5).map(agent => agent.metrics.memoryUsage || 0);

  const performanceChartData = {
    labels: performanceLabels,
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: cpuData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Memory Usage (%)',
        data: memoryData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  // Prepare data for tasks processed chart
  const tasksChartData = {
    labels: agents.slice(0, 6).map(agent => agent.name),
    datasets: [
      {
        label: 'Tasks Processed',
        data: agents.slice(0, 6).map(agent => agent.metrics.tasksProcessed || 0),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(107, 114, 128, 1)',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: '',
        color: 'rgba(55, 65, 81, 1)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        className: 'chart-tooltip',
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(107, 114, 128, 1)',
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.2)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(107, 114, 128, 1)',
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.2)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          color: 'rgba(107, 114, 128, 1)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        className: 'chart-tooltip',
      }
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Status Distribution */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 h-80">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Agent Status Distribution</h3>
        <Doughnut data={statusChartData} options={doughnutOptions} />
      </div>

      {/* Agent Types */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 h-80">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Agent Types</h3>
        <Doughnut data={typeChartData} options={doughnutOptions} />
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 h-80 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Performance Metrics (Active Agents)</h3>
        <div className="h-64">
          <Line data={performanceChartData} options={options} />
        </div>
      </div>

      {/* Tasks Processed */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 h-80">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tasks Processed</h3>
        <Bar data={tasksChartData} options={options} />
      </div>
    </div>
  );
};

export default AgentCharts;
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge class names with tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get status color based on agent status
export function getStatusColor(status: string) {
  switch (status) {
    case 'running':
      return 'bg-green-500';
    case 'stopped':
      return 'bg-red-500';
    case 'completed':
      return 'bg-blue-500';
    case 'error':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

// Format date to relative time
export function formatDate(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}

// Generate mock data for dashboard
export function generateMockAgents(count: number = 10) {
  const statuses: ('running' | 'stopped' | 'completed' | 'error')[] = ['running', 'stopped', 'completed', 'error'];
  const types = ['Web Scraper', 'Data Processor', 'Notification', 'Monitoring', 'Backup'];

  return Array.from({ length: count }, (_, i) => ({
    id: `agent-${i + 1}`,
    name: `Agent ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    lastUpdateTime: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
    metrics: {
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      uptime: Math.floor(Math.random() * 1000),
      tasksProcessed: Math.floor(Math.random() * 1000),
      successRate: Math.floor(Math.random() * 100)
    }
  }));
}
import React, { useState, useMemo } from 'react';
import { Agent } from '../App';
import { EllipsisVerticalIcon, ArrowsRightLeftIcon, EyeIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';

interface AgentDataTableProps {
  agents: Agent[];
  loading: boolean;
  onAgentSelect: (agent: Agent) => void;
  onStatusToggle: (id: number) => void;
}

export const AgentDataTable: React.FC<AgentDataTableProps> = ({
  agents,
  loading,
  onAgentSelect,
  onStatusToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'stopped' | 'completed'>('all');
  const [sortField, setSortField] = React.useState<keyof Agent>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Filter and sort agents
  const filteredAndSortedAgents = useMemo(() => {
    let result = [...agents];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(agent => agent.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      return 0;
    });

    return result;
  }, [agents, searchTerm, statusFilter, sortField, sortDirection]);

  // Format date to relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'stopped':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get status icon class
  const getStatusIconClass = (status: string) => {
    switch (status) {
      case 'running':
        return 'animate-pulse text-green-500';
      case 'stopped':
        return 'text-red-500';
      case 'completed':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get status tooltip text
  const getStatusTooltip = (status: string) => {
    switch (status) {
      case 'running':
        return 'Currently active';
      case 'stopped':
        return 'Paused';
      case 'completed':
        return 'Task finished';
      default:
        return '';
    }
  };

  // Toggle sort direction
  const handleSort = (field: keyof Agent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Can this agent be started/stopped?
  const canBeToggled = (type: string) => {
    return ['Processing', 'Scraper', 'Messaging'].includes(type);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse flex space-x-4 mb-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-4 border-b border-gray-200 dark:border-gray-700 last:border-0 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Agents</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search agents..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="running">Running</option>
              <option value="stopped">Stopped</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === 'name' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Type
                    {sortField === 'type' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastUpdatedAt')}
                >
                  <div className="flex items-center">
                    Last Updated
                    {sortField === 'lastUpdatedAt' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Metrics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedAgents.length > 0 ? (
                filteredAndSortedAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{agent.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`h-3 w-3 rounded-full mr-2 ${getStatusIconClass(agent.status)}`} title={getStatusTooltip(agent.status)}></span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(agent.status)}`}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{agent.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{formatDate(agent.lastUpdatedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {Object.entries(agent.metrics).slice(0, 2).map(([key, value]) => (
                          <span key={key}>{`${key}: ${value}`}{Object.keys(agent.metrics).indexOf(key) < 1 ? ', ' : ''}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onAgentSelect(agent)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {canBeToggled(agent.type) && (
                          <button
                            onClick={() => onStatusToggle(agent.id)}
                            className={`${agent.status === 'running' 
                              ? 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300' 
                              : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'} p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                            title={agent.status === 'running' ? 'Stop agent' : 'Start agent'}
                          >
                            {agent.status === 'running' ? (
                              <StopIcon className="h-4 w-4" />
                            ) : (
                              <PlayIcon className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No agents found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
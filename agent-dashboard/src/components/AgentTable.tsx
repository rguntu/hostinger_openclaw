import React from 'react';
import { Agent } from '../types';
import { getStatusColor, formatDate } from '../utils/helpers';
import { FaPlay, FaStop, FaInfoCircle } from 'react-icons/fa';

interface AgentTableProps {
  agents: Agent[];
  onAgentSelect: (agent: Agent) => void;
  onToggleStatus: (id: string) => void;
  loading: boolean;
}

const AgentTable: React.FC<AgentTableProps> = ({ agents, onAgentSelect, onToggleStatus, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-lg">No agents found</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
        <thead>
          <tr className="bg-gray-50 dark:bg-dark-700">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Agent
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Updated
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Metrics
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
          {agents.map((agent) => (
            <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold">{agent.name.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{agent.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{agent.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(agent.status)}`}></div>
                  <span className="text-sm capitalize text-gray-900 dark:text-white">{agent.status}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">{agent.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(agent.lastUpdateTime)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  <div>CPU: {agent.metrics.cpuUsage}%</div>
                  <div>Mem: {agent.metrics.memoryUsage}%</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onAgentSelect(agent)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <FaInfoCircle className="inline mr-2" /> View
                  </button>
                  <button
                    onClick={() => onToggleStatus(agent.id)}
                    className={`${
                      agent.status === 'running'
                        ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                        : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                    }`}
                  >
                    {agent.status === 'running' ? <><FaStop className="inline mr-1" /> Stop</> : <><FaPlay className="inline mr-1" /> Start</>}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentTable;
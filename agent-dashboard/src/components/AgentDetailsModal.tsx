import React from 'react';
import { Agent } from '../types';
import { getStatusColor, formatDate } from '../utils/helpers';
import { FaTimes, FaPlay, FaStop } from 'react-icons/fa';

interface AgentDetailsModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: () => void;
}

const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({ 
  agent, 
  isOpen, 
  onClose, 
  onToggleStatus 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{agent.name}</h2>
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(agent.status)}`}></div>
                <span className="text-sm capitalize font-medium text-gray-700 dark:text-gray-300">
                  {agent.status}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Details</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">ID:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{agent.id}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{agent.type}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Last Update:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{formatDate(agent.lastUpdateTime)}</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Metrics</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">CPU Usage:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{agent.metrics.cpuUsage}%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Memory Usage:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{agent.metrics.memoryUsage}%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Uptime:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{agent.metrics.uptime}h</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Success Rate:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{agent.metrics.successRate}%</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {agent.description || 'No description available for this agent.'}
            </p>
          </div>

          {/* Example chart for metrics - just UI */}
          <div className="mb-6 bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Resource Usage (Last 24h)</h3>
            <div className="h-64 flex items-end space-x-2 justify-center pt-4">
              {/* This would be replaced with an actual chart in a full implementation */}
              <div className="flex flex-col items-center">
                <div className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t h-32 flex items-center justify-center text-xs text-white font-bold">92%</div>
                <span className="mt-2 text-xs text-gray-500">CPU</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 bg-gradient-to-t from-green-500 to-green-400 rounded-t h-24 flex items-center justify-center text-xs text-white font-bold">76%</div>
                <span className="mt-2 text-xs text-gray-500">Mem</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t h-40 flex items-center justify-center text-xs text-white font-bold">98%</div>
                <span className="mt-2 text-xs text-gray-500">Disk</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t h-16 flex items-center justify-center text-xs text-white font-bold">32%</div>
                <span className="mt-2 text-xs text-gray-500">Net</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onToggleStatus}
              className={`px-4 py-2 rounded-lg text-white flex items-center ${
                agent.status === 'running'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } transition-colors`}
            >
              {agent.status === 'running' ? (
                <>
                  <FaStop className="mr-2" /> Stop Agent
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" /> Start Agent
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsModal;
import React from 'react';
import { Agent } from '../App';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon, PlayIcon, StopIcon, CpuChipIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface AgentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  onStatusToggle: (id: number) => void;
  darkMode: boolean;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  isOpen,
  onClose,
  agent,
  onStatusToggle,
  darkMode
}) => {
  if (!agent || !agent.details) return null;

  const canBeToggled = ['Processing', 'Scraper', 'Messaging'].includes(agent.type);
  const statusIconColor = 
    agent.status === 'running' ? 'text-green-500' :
    agent.status === 'stopped' ? 'text-red-500' : 'text-blue-500';

  return (
    <Dialog open={isOpen} onClose={onClose} className={`relative z-50 ${darkMode ? 'dark' : ''}`}>
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      
      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl"
        >
          {/* Modal header */}
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                {agent.type === "Processing" ? (
                  <CpuChipIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                ) : agent.type === "Scraper" ? (
                  <ArrowsRightLeftIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                ) : (
                  <div className="rounded-full bg-primary-600 p-1">
                    <div className="text-white text-xs">M</div>
                  </div>
                )}
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {agent.name}
                </DialogTitle>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    agent.status === 'running' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : agent.status === 'stopped'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    <span className={`h-2 w-2 rounded-full mr-1.5 ${statusIconColor} ${agent.status === 'running' ? 'animate-pulse' : ''}`}></span>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {agent.type}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Modal body */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Description</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {agent.details.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Metrics</h3>
                <ul className="space-y-2">
                  {Object.entries(agent.metrics).map(([key, value]) => (
                    <li key={key} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        {typeof value === 'number' && key.includes('Rate') ? `${value}%` : String(value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Agent Details</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</span>
                    <span className="text-sm text-gray-900 dark:text-gray-300">{agent.details.version}</span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Memory Usage</span>
                    <span className="text-sm text-gray-900 dark:text-gray-300">{agent.details.memoryUsage}</span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Usage</span>
                    <span className="text-sm text-gray-900 dark:text-gray-300">{agent.details.cpuUsage}</span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</span>
                    <span className="text-sm text-gray-900 dark:text-gray-300">{agent.details.uptime}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Timeline</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Started: {new Date(agent.details.startedAt).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Last Updated: {new Date(agent.lastUpdatedAt).toLocaleString()}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Tasks</h3>
                <div className="text-sm mt-1">
                  <span className="text-green-600 dark:text-green-400">{agent.details.tasksCompleted} completed</span>
                  <span className="mx-2">|</span>
                  <span className="text-red-600 dark:text-red-400">{agent.details.tasksFailed} failed</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
            >
              Close
            </button>
            
            {canBeToggled && (
              <button
                type="button"
                onClick={() => {
                  onStatusToggle(agent.id);
                }}
                className={`${agent.status === 'running' 
                  ? 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50' 
                  : 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'} rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors`}
              >
                {agent.status === 'running' ? (
                  <span className="flex items-center"><StopIcon className="h-4 w-4 mr-1" /> Stop</span>
                ) : (
                  <span className="flex items-center"><PlayIcon className="h-4 w-4 mr-1" /> Start</span>
                )}
              </button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
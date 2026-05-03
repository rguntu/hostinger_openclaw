import React, { useState, useEffect } from 'react';
import { Agent } from '../types';
import { generateMockAgents } from '../utils/helpers';
import AgentTable from './AgentTable';
import AgentCharts from './AgentCharts';
import AgentDetailsModal from './AgentDetailsModal';
import Header from './Header';
import SystemStatus from './SystemStatus';

const Dashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load mock data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setAgents(generateMockAgents(12));
      setLoading(false);
    }, 800); // Simulate network delay
  };

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
  };

  const toggleAgentStatus = (id: string) => {
    setAgents(prevAgents =>
      prevAgents.map(agent => {
        if (agent.id === id) {
          const newStatus = agent.status === 'running' ? 'stopped' : 'running';
          return {
            ...agent,
            status: newStatus,
            lastUpdateTime: new Date()
          };
        }
        return agent;
      })
    );
    
    if (selectedAgent?.id === id) {
      setSelectedAgent({
        ...selectedAgent,
        status: selectedAgent.status === 'running' ? 'stopped' : 'running',
        lastUpdateTime: new Date()
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <Header onRefresh={loadData} loading={loading} />

      {/* System Status */}
      <SystemStatus />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 flex items-center">
          <div className="mr-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Agents</p>
            <p className="text-2xl font-bold dark:text-white">{agents.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 flex items-center">
          <div className="mr-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Running</p>
            <p className="text-2xl font-bold dark:text-white">
              {agents.filter(a => a.status === 'running').length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 flex items-center">
          <div className="mr-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Stopped</p>
            <p className="text-2xl font-bold dark:text-white">
              {agents.filter(a => a.status === 'stopped').length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 flex items-center">
          <div className="mr-4 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold dark:text-white">
              {agents.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <AgentCharts agents={agents} />
      </div>

      {/* Agents Table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Agent List</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search agents..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
          
          <AgentTable 
            agents={agents} 
            onAgentSelect={handleAgentSelect}
            onToggleStatus={toggleAgentStatus}
            loading={loading}
          />
        </div>
      </div>

      {/* Agent Details Modal */}
      {selectedAgent && (
        <AgentDetailsModal
          agent={selectedAgent}
          isOpen={isModalOpen}
          onClose={closeModal}
          onToggleStatus={() => toggleAgentStatus(selectedAgent.id)}
        />
      )}
    </div>
  );
};

export default Dashboard;
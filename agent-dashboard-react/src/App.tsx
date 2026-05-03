import React, { useState, useEffect } from 'react';
import { ModeToggle } from './components/ModeToggle';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { AgentDataTable } from './components/AgentDataTable';
import { AgentDetailModal } from './components/AgentDetailModal';
import { GatewayStatusCard, GatewayChart } from './components/GatewayStatus';

interface Agent {
  id: number;
  name: string;
  status: 'running' | 'stopped' | 'completed';
  type: string;
  lastUpdatedAt: string;
  metrics: Record<string, any>;
  details?: AgentDetails;
}

interface AgentDetails {
  description: string;
  version: string;
  memoryUsage: string;
  cpuUsage: string;
  uptime: string;
  startedAt: string;
  tasksCompleted: number;
  tasksFailed: number;
}

interface GatewayStatus {
  status: 'online' | 'sleeping' | 'offline';
  tasks: number;
  successes: number;
  failures: number;
  cpuUsage: number;
  memoryUsage: number;
  logs: Array<{
    timestamp: string;
    level: string;
    message: string;
  }>;
  activities: Array<{
    id: number;
    time: string;
    agent: string;
    status: string;
    error?: string;
  }>;
  chartData: {
    time: string[];
    successRate: number[];
    failureRate: number[];
  };
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [gateway, setGateway] = useState<GatewayStatus>({
    status: 'sleeping',
    tasks: 0,
    successes: 0,
    failures: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    logs: [],
    activities: [],
    chartData: {
      time: [],
      successRate: [],
      failureRate: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Load mock data including gateway data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAgents: Agent[] = [
        {
          id: 1,
          name: "Data Processing Agent",
          status: "running",
          type: "Processing",
          lastUpdatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          metrics: {
            processedItems: 1425,
            successRate: 98.7,
            avgDuration: "2.3s",
            currentQueue: 23
          },
          details: {
            description: "Handles data processing tasks including ETL operations and data validation",
            version: "2.1.0",
            memoryUsage: "128MB",
            cpuUsage: "15%",
            uptime: "4h 23m",
            startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            tasksCompleted: 24,
            tasksFailed: 1
          }
        },
        {
          id: 2,
          name: "Web Scraper Agent",
          status: "stopped",
          type: "Scraper",
          lastUpdatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          metrics: {
            urlsProcessed: 847,
            successRate: 92.3,
            totalPages: 1205,
            lastScraped: "2 hours ago"
          },
          details: {
            description: "Scrapes web data from configured sources and stores in the database",
            version: "1.8.3",
            memoryUsage: "89MB",
            cpuUsage: "8%",
            uptime: "12h 15m",
            startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            tasksCompleted: 42,
            tasksFailed: 3
          }
        },
        {
          id: 3,
          name: "Notification Agent",
          status: "completed",
          type: "Messaging",
          lastUpdatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          metrics: {
            notificationsSent: 312,
            openRate: 45.2,
            clickRate: 12.3,
            delivered: 308
          },
          details: {
            description: "Manages sending notifications via email, SMS, and push notifications",
            version: "3.2.1",
            memoryUsage: "64MB",
            cpuUsage: "5%",
            uptime: "8h 45m",
            startedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            tasksCompleted: 8,
            tasksFailed: 0
          }
        },
        {
          id: 4,
          name: "Machine Learning Agent",
          status: "running",
          type: "AI/ML",
          lastUpdatedAt: new Date(Date.now() - 30 * 1000).toISOString(),
          metrics: {
            modelsTrained: 17,
            accuracyImprovement: 3.2,
            trainingTime: "18m",
            dataPoints: 52341
          },
          details: {
            description: "Trains and deploys machine learning models for predictive analytics",
            version: "4.0.5",
            memoryUsage: "512MB",
            cpuUsage: "87%",
            uptime: "1d 3h 12m",
            startedAt: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(),
            tasksCompleted: 156,
            tasksFailed: 2
          }
        },
        {
          id: 5,
          name: "Security Monitoring Agent",
          status: "running",
          type: "Security",
          lastUpdatedAt: new Date(Date.now() - 15 * 1000).toISOString(),
          metrics: {
            threatsDetected: 42,
            alertsGenerated: 18,
            scanRate: 82,
            falsePositives: 5
          },
          details: {
            description: "Monitors system for security threats and generates alerts",
            version: "2.9.0",
            memoryUsage: "96MB",
            cpuUsage: "12%",
            uptime: "5d 12h 8m",
            startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 12 * 60 * 60 * 1000 - 8 * 60 * 1000).toISOString(),
            tasksCompleted: 1240,
            tasksFailed: 3
          }
        },
        {
          id: 6,
          name: "Backup Scheduler Agent",
          status: "stopped",
          type: "Backup",
          lastUpdatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          metrics: {
            backupsCreated: 127,
            totalSize: "2.3TB",
            completionRate: 100,
            avgDuration: "2h 45m"
          },
          details: {
            description: "Automates backup procedures for critical systems",
            version: "1.4.2",
            memoryUsage: "234MB",
            cpuUsage: "2%",
            uptime: "1h 22m",
            startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 - 22 * 60 * 1000).toISOString(),
            tasksCompleted: 15,
            tasksFailed: 0
          }
        }
      ];
      
      // Generate mock gateway data
      const mockGateway: GatewayStatus = {
        status: 'sleeping', // For Mac systems, showing "sleeping" status
        tasks: 428, // Simulated current task count
        successes: 395, // Successful completions
        failures: 12,  // Failed tasks
        cpuUsage: 8.4, // Current CPU usage %
        memoryUsage: 42, // Current memory usage %
        logs: [
          { timestamp: new Date(Date.now() - 30000).toISOString(), level: "info", message: "Gateway started successfully" },
          { timestamp: new Date(Date.now() - 60000).toISOString(), level: "error", message: "Connection lost to ios-coder agent" },
          { timestamp: new Date(Date.now() - 120000).toISOString(), level: "info", message: "Scheduled maintenance completed" },
          { timestamp: new Date(Date.now() - 180000).toISOString(), level: "warn", message: "Gateway entering sleep mode (macOS)" },
          { timestamp: new Date(Date.now() - 240000).toISOString(), level: "info", message: "Task queue size reached 23" }
        ],
        activities: [
          { id: 1001, time: "2 min ago", agent: "ios-coder", status: "completed", error: undefined },
          { id: 1002, time: "5 min ago", agent: "Dashboard Builder", status: "successful", error: undefined },
          { id: 1003, time: "8 min ago", agent: "Data Processor", status: "failed", error: "Timeout" },
          { id: 1004, time: "12 min ago", agent: "Notification Service", status: "started", error: undefined },
          { id: 1005, time: "15 min ago", agent: "Security Monitor", status: "completed", error: undefined }
        ],
        chartData: {
          time: ["12AM", "2AM", "4AM", "6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"],
          successRate: [89, 92, 95, 97, 93, 88, 90, 94, 87, 92, 85, 96],
          failureRate: [5, 3, 2, 1, 4, 7, 6, 3, 8, 4, 9, 2]
        }
      };
      
      setAgents(mockAgents);
      setGateway(mockGateway);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle gateway refresh
  const handleGatewayRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const updatedGateway = { ...gateway };
      updatedGateway.status = 'online'; // Simulate coming online
      updatedGateway.tasks += Math.floor(Math.random() * 5);
      updatedGateway.successes = Math.min(updatedGateway.successes + Math.floor(Math.random() * 3), updatedGateway.tasks);
      updatedGateway.failures = updatedGateway.tasks - updatedGateway.successes;
      setGateway(updatedGateway);
      setLoading(false);
    }, 1000);
  };

  // Handle agent selection
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
  };

  // Toggle agent status
  const toggleAgentStatus = (id: number) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === id 
          ? { ...agent, status: agent.status === 'running' ? 'stopped' : 'running' as any } 
          : agent
      )
    );
    
    if (selectedAgent && selectedAgent.id === id) {
      setSelectedAgent({
        ...selectedAgent,
        status: selectedAgent.status === 'running' ? 'stopped' : 'running' as any
      });
    }
  };

  // Calculate stats
  const runningCount = agents.filter(a => a.status === 'running').length;
  const stoppedCount = agents.filter(a => a.status === 'stopped').length;
  const completedCount = agents.filter(a => a.status === 'completed').length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Gateway Status Card - Takes 2 cols on large screens */}
          <div className="lg:col-span-2">
            <GatewayStatusCard 
              darkMode={darkMode} 
              onRefresh={handleGatewayRefresh} 
              gatewayStatus={gateway.status}
              tasks={gateway.tasks}
              successes={gateway.successes}
              failures={gateway.failures}
            />
          </div>
          
          {/* Stats Cards - Take 1 col on large screens */}
          <div className="lg:col-span-1">
            <StatsCards 
              runningCount={runningCount} 
              stoppedCount={stoppedCount} 
              completedCount={completedCount} 
              totalCount={agents.length} 
            />
          </div>
        </div>
        
        {/* Gateway Chart */}
        <div className="mb-8">
          <GatewayChart 
            darkMode={darkMode} 
            chartData={gateway.chartData} 
          />
        </div>
        
        {/* Agents Table Section */}
        <div>
          <AgentDataTable 
            agents={agents} 
            loading={loading}
            onAgentSelect={handleAgentSelect}
            onStatusToggle={toggleAgentStatus}
          />
        </div>
      </main>
      
      <AgentDetailModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        agent={selectedAgent}
        onStatusToggle={toggleAgentStatus}
        darkMode={darkMode}
      />
    </div>
  );
};

export { App };
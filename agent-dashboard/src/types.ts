export type AgentStatus = 'running' | 'stopped' | 'completed' | 'error';

export interface AgentMetrics {
  cpuUsage?: number;
  memoryUsage?: number;
  uptime?: number;
  tasksProcessed?: number;
  successRate?: number;
}

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  type: string;
  lastUpdateTime: Date;
  metrics: AgentMetrics;
  description?: string;
}

export interface AgentDetail extends Agent {
  logs: string[];
  config: Record<string, any>;
}
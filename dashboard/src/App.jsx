import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Settings, 
  HelpCircle, 
  Bell, 
  ChevronDown, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Activity, 
  Terminal,
  Grid,
  Zap,
  ExternalLink,
  RefreshCw,
  Plus
} from 'lucide-react';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const [agents, setAgents] = useState([
    { id: 'codex', status: 'online', task: 'Idle', uptime: '1h 10m', type: 'Coding Agent' },
    { id: 'main', status: 'online', task: 'Chatting with Rave', uptime: '4h', type: 'Main Agent' }
  ]);
  
  const [tokens, setTokens] = useState({
    input: 128000,
    output: 403,
    cost: '$1.12'
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Quick Overview</h3>
                <Activity size={18} className="text-[#3b78e7]" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Service Status</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">Healthy</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Active Agents</span>
                  <span className="text-sm font-bold text-gray-800">{agents.length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Gateway Port</span>
                  <span className="text-sm font-mono text-gray-600">18789</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Session Cost</h3>
                <CreditCard size={18} className="text-[#3b78e7]" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-light text-gray-900">{tokens.cost}</div>
                  <div className="text-xs text-gray-500 mt-1">Estimated OpenRouter usage</div>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">
                  I: {tokens.input.toLocaleString()} / O: {tokens.output.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4 text-sm uppercase tracking-wider font-semibold text-gray-700">
                System Info
              </div>
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-600 uppercase">Current User</div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">RG</div>
                  <span className="text-sm font-bold truncate">Raveendra Guntupalli</span>
                </div>
                <div className="text-[11px] text-gray-400 pt-2 flex items-center">
                  <Zap size={10} className="mr-1" />
                  Uptime: 4 days, 12 hours
                </div>
              </div>
            </div>
          </div>
        );
      case 'Sub-Agents':
        return (
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-700 uppercase text-xs tracking-wider font-bold">Manage Sub-Agents</h3>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm hover:bg-gray-50 font-medium">
                  <RefreshCw size={12} />
                  <span>REFRESH</span>
                </button>
                <button className="flex items-center space-x-1 text-xs bg-[#3b78e7] text-white px-3 py-1.5 rounded shadow-sm hover:bg-[#1a5edb] font-medium">
                  <Plus size={12} />
                  <span>SPAWN NEW AGENT</span>
                </button>
              </div>
            </div>
            <div className="flex-1 p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3">NAME</th>
                    <th className="px-5 py-3">STATUS</th>
                    <th className="px-5 py-3">CURRENT TASK</th>
                    <th className="px-5 py-3">UPTIME</th>
                    <th className="px-5 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {agents.map(agent => (
                    <tr key={agent.id} className="hover:bg-blue-50/50 transition cursor-pointer group">
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#3b78e7]">@{agent.id}</span>
                          <span className="text-[11px] text-gray-400 uppercase tracking-tighter">{agent.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded leading-none border border-emerald-100 tracking-tight">{agent.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 truncate max-w-[200px] font-medium italic">"{agent.task}"</td>
                      <td className="px-5 py-4 text-xs font-mono text-gray-500">{agent.uptime}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-gray-400 hover:text-[#3b78e7] px-2 py-1"><ExternalLink size={14} /></button>
                        <button className="text-gray-400 hover:text-red-600 px-2 py-1"><Terminal size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-12 rounded border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#3b78e7]">
              <Settings size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 uppercase tracking-tight">{activeTab}</h3>
            <p className="text-gray-500 max-w-sm">
              This module is currently being provisioned. OpenClaw is mapping the internal resources for <strong>{activeTab}</strong>.
            </p>
            <button 
              onClick={() => setActiveTab('Dashboard')}
              className="text-sm font-semibold text-[#3b78e7] hover:underline uppercase"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      {/* Header */}
      <header className="h-12 bg-[#3b78e7] text-white flex items-center justify-between px-4 z-50 shadow-md flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-[#1a5edb] rounded transition"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center space-x-2 select-none pointer-events-none">
            <Zap size={20} className="text-yellow-300 fill-yellow-300" />
            <span className="font-semibold text-lg">Rave</span>
            <span className="text-gray-200">|</span>
            <span className="font-light">OpenClaw Command Center</span>
            <ChevronDown size={14} className="ml-1 opacity-80" />
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-70" size={16} />
            <input 
              type="text" 
              placeholder="Search sub-agents, tasks, or settings" 
              className="w-full bg-[#528af0] text-white placeholder-white/70 border-none rounded px-10 py-1 text-sm focus:ring-1 focus:ring-white outline-none transition"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <HelpCircle size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
          <Bell size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
          <Settings size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-white/30 transition">
            RG
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0`}>
          <nav className="flex-1 space-y-1 pt-4 overflow-y-auto">
            <SidebarItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={activeTab === 'Dashboard'} 
              onClick={() => setActiveTab('Dashboard')}
            />
            <SidebarItem 
              icon={<Users size={18} />} 
              label="Sub-Agents" 
              active={activeTab === 'Sub-Agents'} 
              onClick={() => setActiveTab('Sub-Agents')}
            />
            <SidebarItem 
              icon={<CreditCard size={18} />} 
              label="Billing & Tokens" 
              active={activeTab === 'Billing & Tokens'} 
              onClick={() => setActiveTab('Billing & Tokens')}
            />
            <SidebarItem 
              icon={<Activity size={18} />} 
              label="Logs & Observability" 
              active={activeTab === 'Logs & Observability'} 
              onClick={() => setActiveTab('Logs & Observability')}
            />
            <SidebarItem 
              icon={<Terminal size={18} />} 
              label="Terminal Access" 
              active={activeTab === 'Terminal Access'} 
              onClick={() => setActiveTab('Terminal Access')}
            />
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
              Pinned Resources
            </div>
            <SidebarItem icon={<Grid size={18} />} label="@codex" onClick={() => setActiveTab('Sub-Agents')} />
            <SidebarItem icon={<Grid size={18} />} label="@main" onClick={() => setActiveTab('Sub-Agents')} />
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col">
          <div className="max-w-6xl w-full mx-auto space-y-6">
            <div className="flex items-center text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 space-x-2">
              <span className="hover:text-[#3b78e7] cursor-pointer transition">OpenClaw</span>
              <span>/</span>
              <span className="text-gray-900 underline underline-offset-4 decoration-[#3b78e7] decoration-2">{activeTab}</span>
            </div>

            {renderContent()}

            <div className="bg-blue-50 border border-blue-100 p-4 rounded flex items-center justify-between shadow-inner mt-8">
              <div className="flex items-center space-x-3">
                <HelpCircle className="text-[#3b78e7]" size={20} />
                <span className="text-sm text-blue-800 font-medium">New sub-agent capability unlocked! Use <strong>sessions_spawn</strong> for specialized tasks.</span>
              </div>
              <button className="text-xs bg-[#3b78e7] text-white px-4 py-1.5 rounded font-bold hover:shadow-lg transition">DOCUMENTATION</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center space-x-4 px-4 py-2 text-sm cursor-pointer transition border-l-4 border-transparent outline-none
      ${active 
        ? 'bg-blue-50/80 border-[#3b78e7] text-[#3b78e7] font-bold shadow-inner' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
      }
    `}
  >
    <span className={active ? 'text-[#3b78e7]' : 'text-gray-400'}>{icon}</span>
    <span className="flex-1 text-left uppercase tracking-tighter text-xs font-bold">{label}</span>
  </button>
);

export default App;

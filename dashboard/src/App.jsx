import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Settings, HelpCircle, Bell, ChevronDown, 
  LayoutDashboard, Users, CreditCard, Activity, Terminal,
  Grid, Zap, ExternalLink, RefreshCw, Plus, ArrowUpRight,
  Clock, Code
} from 'lucide-react';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [agents, setAgents] = useState([]);
  const [tokens, setTokens] = useState({ input: 0, cost: '$0.00' });
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState({
    user: 'Raveendra Guntupalli',
    serviceStatus: 'Checking...'
  });

  const [cronJobs, setCronJobs] = useState([]);

  const fetchData = async () => {
    try {
      // Use /api/health as the single source of truth (it contains agents and sessions)
      const response = await fetch('/api/health', {
          headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setError(null);

      // Status Mapping
      setSystemInfo(prev => ({
        ...prev,
        serviceStatus: data.ok ? 'Healthy' : 'Degraded'
      }));

      // Agent Mapping from health data
      if (data.agents) {
        setAgents(data.agents.map(a => ({
          id: a.agentId,
          status: 'online',
          name: a.name || a.agentId
        })));
      }

      // Proactively fetch agents list in case health is stale
      try {
        const agentsRes = await fetch('/api/agents/list', { headers: { 'Accept': 'application/json' } });
        if (agentsRes.ok) {
            const agentsData = await agentsRes.json();
            if (Array.isArray(agentsData)) {
              setAgents(agentsData.map(a => ({
                id: a.agentId,
                status: 'online',
                name: a.name || a.agentId
              })));
            }
        }
      } catch (e) { console.warn('Agents fetch failed', e); }

      // Session Mapping from health data
      if (data.sessions && data.sessions.recent) {
        const mappedSessions = data.sessions.recent.map(s => ({
          sessionId: s.key?.split(':').pop() || 'n/a',
          agentId: s.key?.split(':')[1] || 'main',
          kind: s.key?.split(':')[2] || 'group',
          totalTokens: s.totalTokens || 0,
          updatedAt: s.updatedAt,
          model: s.model || 'unknown',
          cost: s.estimatedCostUsd || 0
        }));
        setSessions(mappedSessions);
        
        const totalTokens = data.sessions.recent.reduce((acc, s) => acc + (s.totalTokens || 0), 0);
        const totalCost = data.sessions.recent.reduce((acc, s) => acc + (s.estimatedCostUsd || 0), 0);
        setTokens({
          input: totalTokens,
          cost: `$${totalCost.toFixed(2)}`
        });
      }

      // Cron Mapping from health data (Data Proxy now includes both health + cron if needed, 
      // but let's fetch proactively)
      try {
        const cronRes = await fetch('/api/cron/list', { headers: { 'Accept': 'application/json' } });
        if (cronRes.ok) {
            const cronData = await cronRes.json();
            setCronJobs(cronData || []); // The CLI returns an array directly in JSON mode usually
        }
      } catch (e) { console.warn('Cron fetch failed', e); }

    } catch (err) {
      console.error('Dashboard Fetch Error:', err);
      setError("Gateway communication failed. Ensure the OpenClaw Gateway is reachable via the Vite proxy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial load
    const interval = setInterval(fetchData, 300000); // Polling set to 5 minutes
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (error) {
        return (
            <div className="bg-amber-50 border border-amber-200 p-10 rounded text-center shadow-sm">
                <div className="text-amber-700 font-black mb-3 uppercase tracking-widest text-xs">Gateway Communication Failure</div>
                <div className="text-sm text-amber-600 max-w-sm mx-auto mb-6 font-medium font-mono leading-relaxed">{error}</div>
                <button onClick={() => { setLoading(true); fetchData(); }} className="px-6 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-xl hover:bg-black transition">
                    RETRY SYNC
                </button>
            </div>
        );
    }

    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                  <div className="flex justify-between items-center mb-5 text-gray-300 uppercase text-[9px] font-black tracking-[0.2em]">
                      <span>Status</span>
                      <Activity size={14} className={systemInfo.serviceStatus === 'Healthy' ? "text-emerald-500" : "text-amber-500"} />
                  </div>
                  <div className={`text-3xl font-black uppercase ${systemInfo.serviceStatus === 'Healthy' ? "text-gray-900" : "text-amber-600"}`}>
                    {systemInfo.serviceStatus}
                  </div>
                  <div className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest">Gateway Verified</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                  <div className="flex justify-between items-center mb-5 text-gray-300 uppercase text-[9px] font-black tracking-[0.2em]">
                      <span>Active Tokens</span>
                      <Zap size={14} className="text-yellow-500" />
                  </div>
                  <div className="text-3xl font-black text-gray-900">{tokens.input.toLocaleString()}</div>
                  <div className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest">Global Session Data</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                  <div className="flex justify-between items-center mb-5 text-gray-300 uppercase text-[9px] font-black tracking-[0.2em]">
                      <span>Account Est.</span>
                      <CreditCard size={14} className="text-[#3b78e7]" />
                  </div>
                  <div className="text-3xl font-black text-gray-900">{tokens.cost}</div>
                  <div className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest">Calculated spend</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest">Registered Agents</h3>
                  <button onClick={fetchData} className="text-gray-400 hover:text-gray-900 transition"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {agents.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-gray-400 text-[10px] uppercase font-black tracking-widest">No Agents Registered</div>
                  ) : agents.map(agent => (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 transition hover:border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{agent.name}</span>
                          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{agent.id}</span>
                        </div>
                      </div>
                      <ExternalLink size={12} className="text-gray-300" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );
      case 'Observability':
        return (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
             <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>Session Observability</span>
              </h3>
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Feed • Proxy</div>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[11px]">
              <table className="w-full text-left">
                  <thead className="bg-gray-50 sticky top-0 border-b border-gray-100 text-gray-300 uppercase text-[9px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-3">Trace ID</th>
                      <th className="px-6 py-3">Context Layer</th>
                      <th className="px-6 py-3 text-right">Tokens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sessions.length === 0 ? (
                      <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">No active data streams</td></tr>
                    ) : sessions.map(s => (
                      <tr key={s.sessionId + s.updatedAt} className="hover:bg-gray-200 transition-colors">
                        <td className="px-6 py-5">
                            <div className="font-black text-[#3b78e7]">{s.sessionId}</div>
                            <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">{new Date(s.updatedAt).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-5 flex flex-col items-start space-y-1">
                          <span className="text-[9px] font-black text-gray-800 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded shadow-sm">{s.agentId} | {s.kind}</span>
                          <span className="text-[8px] text-gray-400 font-bold truncate max-w-[200px] tracking-tight">{s.model.split('/').pop()}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="font-black text-gray-900">{s.totalTokens.toLocaleString()}</div>
                          <div className="text-[9px] text-[#3b78e7] uppercase font-black tracking-tighter">${s.cost.toFixed(4)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return <div className="p-10 text-center text-gray-300 uppercase text-[10px] font-black tracking-[0.4em] italic">{activeTab} Workstation Ready</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-gray-900 font-sans flex flex-col">
      <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-8 shadow-2xl z-50">
        <div className="flex items-center space-x-6">
          <Menu size={22} className="cursor-pointer hover:text-blue-400 transition" onClick={() => setSidebarOpen(!isSidebarOpen)} />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center text-black shadow-lg shadow-yellow-900/20">
                <Zap size={16} fill="currentColor" />
            </div>
            <span className="font-black uppercase tracking-[0.2em] text-sm">System Architect</span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-[10px] font-black bg-white/5 px-5 py-2 rounded-full border border-white/10 uppercase tracking-widest leading-none cursor-pointer hover:bg-white/10 transition" onClick={fetchData}>
            <span className="text-gray-500">{systemInfo.user}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${systemInfo.serviceStatus === 'Healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
            <span className={systemInfo.serviceStatus === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}>{systemInfo.serviceStatus}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-100 shadow-sm transition-all flex flex-col overflow-hidden z-40`}>
          <nav className="flex-1 pt-8 px-6 space-y-4">
             <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
             <SidebarItem icon={<Activity size={20} />} label="Observability" active={activeTab === 'Observability'} onClick={() => setActiveTab('Observability')} />
             <div className="pt-4 mt-4 border-t border-gray-50 font-black text-[9px] text-gray-300 uppercase tracking-[0.3em] px-2 mb-2">Registry</div>
             <SidebarItem icon={<Users size={20} />} label="Agents" onClick={() => setActiveTab('Agents')} />
             <SidebarItem icon={<CreditCard size={20} />} label="Billing" onClick={() => setActiveTab('Billing')} />
             <SidebarItem icon={<RefreshCw size={20} />} label="Crons" onClick={() => setActiveTab('Cron Jobs')} />
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-12 flex justify-center">
          <div className="max-w-4xl w-full">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] pl-1">
                {activeTab} • Secure Link
              </div>
              <button 
                onClick={() => { setLoading(true); fetchData(); }} 
                className="flex items-center space-x-2 text-[10px] font-black text-[#3b78e7] uppercase tracking-widest hover:text-blue-700 transition"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                <span>Sync Node</span>
              </button>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-xs transition-all ${active ? 'bg-gray-900 text-white font-black shadow-xl' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
  >
    <div className={`${active ? 'text-yellow-400' : 'text-gray-300'}`}>{icon}</div>
    <span className="uppercase tracking-widest">{label}</span>
  </button>
);

export default App;

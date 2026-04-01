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
  Plus,
  ArrowUpRight,
  Clock,
  Code
} from 'lucide-react';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [agents, setAgents] = useState([]);
  const [tokens, setTokens] = useState({ input: 0, cost: '$0.00' });
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [systemInfo, setSystemInfo] = useState({
    user: 'Raveendra Guntupalli',
    serviceStatus: 'Checking...'
  });

  const [cronJobs, setCronJobs] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Since gateway is Loopback-Only (127.0.0.1:18789), it will ONLY accept 
        // requests from the same machine. Fetching from 192.168.1.83 browser 
        // will FAIL due to loopback restriction. We must use 127.0.0.1.
        const response = await fetch('http://127.0.0.1:18789/health', {
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setError(null);

        if (Array.isArray(data[1])) {
          setAgents(data[1].map(a => ({
            id: a.agentId,
            status: 'online',
            type: a.name,
            sessions: a.sessions?.count || 0
          })));
        }

        if (data[2] && Array.isArray(data[2].recent)) {
          const recentSessions = data[2].recent.map(s => ({
            sessionId: s.key?.split(':').pop() || 'n/a',
            agentId: s.key?.split(':')[1] || 'main',
            kind: s.key?.split(':')[2] || 'group',
            totalTokens: s.totalTokens || 0,
            updatedAt: s.updatedAt,
            model: s.model || 'unknown'
          }));
          setSessions(recentSessions);
          
          const totalTokens = data[2].recent.reduce((acc, s) => acc + (s.totalTokens || 0), 0);
          setTokens({
            input: totalTokens,
            cost: `$${(data[2].recent.reduce((acc, s) => acc + (s.estimatedCostUsd || 0), 0)).toFixed(2)}`
          });
        }

        setSystemInfo(prev => ({
          ...prev,
          serviceStatus: data[0] ? 'Healthy' : 'Degraded'
        }));

        try {
          const cronRes = await fetch('http://127.0.0.1:18789/cron/list');
          const cronData = await cronRes.json();
          setCronJobs(cronData.jobs || []);
        } catch (e) { console.error('Cron fetch failed', e); }

      } catch (err) {
        console.error('Dashboard Fetch Error:', err);
        setError("Loopback-Only Gateway Detected. You MUST access this dashboard via 'localhost'. Accessing via local IP (192.168.1.x) will be blocked.");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (error) {
        return (
            <div className="bg-amber-50 border border-amber-200 p-10 rounded text-center shadow-sm">
                <div className="text-amber-700 font-black mb-3 uppercase tracking-widest text-xs">Loopback Mismatch Warning</div>
                <div className="text-sm text-amber-600 max-w-sm mx-auto mb-6 font-medium font-mono leading-relaxed">{error}</div>
                <div className="flex flex-col space-y-3 items-center">
                    <a href="http://localhost:5173/" className="px-6 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-xl hover:bg-black transition">
                        USE LOCALHOST:5173
                    </a>
                </div>
                <div className="mt-10 text-[9px] uppercase font-black text-gray-400 tracking-widest bg-white/40 p-2 inline-block">
                    Target: http://127.0.0.1:18789/health
                </div>
            </div>
        );
    }

    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-center mb-5 text-gray-300 uppercase text-[9px] font-black tracking-[0.2em]">
                    <span>Status</span>
                    <Activity size={14} className="text-blue-500" />
                </div>
                <div className="text-3xl font-black text-gray-900 uppercase">{systemInfo.serviceStatus}</div>
                <div className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest">Gateway Loopback</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-center mb-5 text-gray-300 uppercase text-[9px] font-black tracking-[0.2em]">
                    <span>Tokens</span>
                    <Zap size={14} className="text-yellow-500" />
                </div>
                <div className="text-3xl font-black text-gray-900">{tokens.input.toLocaleString()}</div>
                <div className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest">Global usage</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-center mb-5 text-gray-300 uppercase text-[9px] font-black tracking-[0.2em]">
                    <span>Account</span>
                    <CreditCard size={14} className="text-emerald-500" />
                </div>
                <div className="text-3xl font-black text-gray-900 uppercase">{tokens.cost}</div>
                <div className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest">Estimated Bill</div>
            </div>
          </div>
        );
      case 'Logs & Observability':
        return (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
             <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>Observability Feed</span>
              </h3>
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LIVE • 127.0.0.1</div>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[11px]">
              <table className="w-full text-left">
                  <thead className="bg-gray-50 sticky top-0 border-b border-gray-100 text-gray-300 uppercase text-[9px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Agent Layer</th>
                      <th className="px-6 py-3 text-right">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sessions.length === 0 ? (
                      <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">No active sessions found</td></tr>
                    ) : sessions.map(s => (
                      <tr key={s.sessionId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5">
                            <div className="font-black text-[#3b78e7]">{s.sessionId.slice(0,8)}</div>
                            <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">{new Date(s.updatedAt).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-5 flex flex-col items-start">
                          <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded mb-1">{s.agentId} | {s.kind}</span>
                          <span className="text-[8px] text-gray-400 font-bold truncate max-w-[150px] tracking-tight">{s.model.split('/').pop()}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="font-black text-gray-900">{s.totalTokens.toLocaleString()}</div>
                          <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">TOKENS</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return <div className="p-10 text-center text-gray-300 uppercase text-[10px] font-black tracking-[0.4em] italic">Dashboard Ready</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans flex flex-col">
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
        <div className="hidden md:flex items-center space-x-3 text-[10px] font-black bg-white/5 px-5 py-2 rounded-full border border-white/10 uppercase tracking-widest leading-none">
            <span className="text-gray-500">{systemInfo.user}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-emerald-400">{systemInfo.serviceStatus}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-100 transition-all flex flex-col overflow-hidden`}>
          <nav className="flex-1 pt-8 px-6 space-y-4">
             <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
             <SidebarItem icon={<Activity size={20} />} label="Observability" active={activeTab === 'Logs & Observability'} onClick={() => setActiveTab('Logs & Observability')} />
             <div className="pt-4 mt-4 border-t border-gray-50 font-black text-[9px] text-gray-300 uppercase tracking-[0.3em] px-2 mb-2">Systems</div>
             <SidebarItem icon={<Users size={20} />} label="Agents" onClick={() => setActiveTab('Agents')} />
             <SidebarItem icon={<CreditCard size={20} />} label="Billing" onClick={() => setActiveTab('Billing')} />
             <SidebarItem icon={<RefreshCw size={20} />} label="Crons" onClick={() => setActiveTab('Cron Jobs')} />
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-12 flex justify-center bg-[#fafbfc]">
          <div className="max-w-4xl w-full">
            <div className="flex items-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-10 pl-1">
              {activeTab} • Active Session
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

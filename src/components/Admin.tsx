import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useDashboard } from '../context/DashboardContext';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Target,
  Users,
  Award,
  Plus,
  Minus,
  Sliders,
  RotateCcw,
  Activity,
  UserPlus,
  Rocket,
  Trash2,
  Lock,
  LogOut,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Clock,
  Search,
  ArrowUpDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function Admin() {
  const {
    logoutAdmin,
    isAuthenticated,
    setActivePage
  } = useApp();

  const {
    metrics,
    volunteers,
    initiatives,
    logs,
    updateMetrics,
    isLoading
  } = useDashboard();

  const [inputVal, setInputVal] = useState<string>('500');
  const [currentValInput, setCurrentValInput] = useState<string>('');
  const [targetValInput, setTargetValInput] = useState<string>('');
  const [expandedVolunteerId, setExpandedVolunteerId] = useState<string | null>(null);
  const [expandedInitiativeId, setExpandedInitiativeId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'city' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'city' | 'createdAt') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredVolunteers = React.useMemo(() => {
    if (!volunteers) return [];
    const term = searchTerm.toLowerCase().trim();
    if (!term) return volunteers;
    return volunteers.filter(v => 
      v.name.toLowerCase().includes(term) ||
      v.email.toLowerCase().includes(term) ||
      v.phone.toLowerCase().includes(term) ||
      v.city.toLowerCase().includes(term) ||
      (v.skills && v.skills.toLowerCase().includes(term)) ||
      (v.message && v.message.toLowerCase().includes(term))
    );
  }, [volunteers, searchTerm]);

  const sortedVolunteers = React.useMemo(() => {
    const list = [...filteredVolunteers];
    list.sort((a, b) => {
      let valA: any = a[sortField] || '';
      let valB: any = b[sortField] || '';

      if (sortField === 'createdAt') {
        const d_a = new Date(valA).getTime() || 0;
        const d_b = new Date(valB).getTime() || 0;
        return sortOrder === 'asc' ? d_a - d_b : d_b - d_a;
      }

      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredVolunteers, sortField, sortOrder]);

  React.useEffect(() => {
    if (metrics) {
      setCurrentValInput(metrics.currentKg.toString());
      setTargetValInput(metrics.targetKg.toString());
    }
  }, [metrics.currentKg, metrics.targetKg]);

  // Safety block redirect if unauthorized
  React.useEffect(() => {
    if (!isAuthenticated) {
      setActivePage('login');
    }
  }, [isAuthenticated, setActivePage]);

  if (!isAuthenticated) return null;

  const percentage = Math.min((metrics.currentKg / metrics.targetKg) * 100, 100);

  // Synchronized datasets for dynamic analytical telemetry charts
  const monthlyRecyclingData = [
    { month: 'Jan', recycled: 4800, target: metrics.targetKg },
    { month: 'Feb', recycled: 5600, target: metrics.targetKg },
    { month: 'Mar', recycled: 6200, target: metrics.targetKg },
    { month: 'Apr', recycled: 7400, target: metrics.targetKg },
    { month: 'May', recycled: 8700, target: metrics.targetKg },
    { month: 'Jun', recycled: Math.round(metrics.currentKg), target: metrics.targetKg },
  ];

  const volunteerGrowthData = [
    { month: 'Jan', volunteers: 340 },
    { month: 'Feb', volunteers: 390 },
    { month: 'Mar', volunteers: 435 },
    { month: 'Apr', volunteers: 470 },
    { month: 'May', volunteers: 512 },
    { month: 'Jun', volunteers: volunteers.length + 524 },
  ];

  const handleAction = (action: 'add' | 'reduce' | 'set' | 'reset') => {
    const value = parseFloat(inputVal);
    if (isNaN(value) && action !== 'reset') {
      alert('Please insert a realistic numerical value.');
      return;
    }
    updateMetrics(value, action);
  };

  const handleSetBothIndicators = (e: React.FormEvent) => {
    e.preventDefault();
    const currentVal = parseFloat(currentValInput);
    const targetVal = parseFloat(targetValInput);
    if (isNaN(currentVal) || isNaN(targetVal)) {
      alert('Please introduce real numeric metrics values.');
      return;
    }
    updateMetrics(currentVal, 'set_both', targetVal);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-32 px-6 relative overflow-hidden">
      
      {/* Decorative environmental landscape backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1920&q=80"
          alt="Pristine redwood forest ecological restoration"
          className="w-full h-full object-cover opacity-[0.06] filter saturate-50 contrast-[1.08] brightness-[0.88]"
          style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.12)) scale(1.15)', transformOrigin: 'center center' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* CONSOLE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                System Authorized
              </span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tighter leading-snug">Admin Console</h1>
            <p className="text-slate-400 text-sm">
              Telemetry node active. Update metrics, evaluate logs, and manage initiative registrations below.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActivePage('home')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              View Site Live
            </button>
            <button
              id="admin_signout_action_btn"
              onClick={logoutAdmin}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/25 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* METRICS COUNT CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, id) => (
              <div key={id} className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                  <div className="w-5 h-5 bg-slate-800 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-slate-800 rounded w-3/4" />
                  <div className="h-2 bg-slate-850 rounded w-1/3" />
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Current Collection</span>
                  <Award className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-3xl font-black font-heading text-white">{metrics.currentKg.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Metric Unit: KG</span>
                </div>
              </div>

              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Target Quota</span>
                  <Target className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-3xl font-black font-heading text-white">{metrics.targetKg.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Metric Unit: KG</span>
                </div>
              </div>

              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Progress %</span>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-black font-heading text-green-400">{percentage.toFixed(1)}%</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Diversion threshold</span>
                </div>
              </div>

              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Volunteers</span>
                  <Users className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-3xl font-black font-heading text-white">{volunteers.length + 524}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active Change Makers</span>
                </div>
              </div>

              <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Toolkit Initiatives</span>
                  <Rocket className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-3xl font-black font-heading text-white">{initiatives.length + 57}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active Regional plans</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RECHARTS ECO-ANALYTICS SYSTEM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CHART 1: MONTHLY RECYCLING PROGRESS */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold font-heading text-white">Monthly Diversion Trends</h3>
                <p className="text-[11px] text-slate-400">Comparing active recycling volume against targeted threshold (KG).</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-green-500/15 text-green-400 px-2.5 py-1 rounded-full border border-green-500/10 uppercase tracking-widest font-mono font-bold">
                  {metrics.currentKg.toLocaleString()} KG Active
                </span>
              </div>
            </div>
            
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRecyclingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRecycled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" name="Recycled Volume (KG)" dataKey="recycled" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorRecycled)" />
                  <Area type="monotone" name="Target Quota (KG)" dataKey="target" stroke="#38bdf8" strokeWidth={1} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTarget)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 2: VOLUNTEER GROWTH GRAPH */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold font-heading text-white">Active Change Makers Expansion</h3>
                <p className="text-[11px] text-slate-400">Cumulative index tracking our registered waste diversion force over time.</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-sky-500/15 text-sky-400 px-2.5 py-1 rounded-full border border-sky-500/10 uppercase tracking-widest font-mono font-bold">
                  {(volunteers.length + 524).toLocaleString()} Workers
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volunteerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar name="Registered Crew" dataKey="volunteers" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* WORKSPACE OPERATIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: TELEMETRY CONTROL PANEL COLUMN */}
          <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 rounded-3xl p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold font-heading text-white">Metrics Engine</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Mutate live platform indicators systematically. Use quick actions to add / subtract volume or submit precise manual overrides directly to the cloud backend.
            </p>

            {/* TAB CONTAINER: QUICK ADJUST vs DIRECT MANUALLY ENTER */}
            <div className="space-y-6 pt-2 border-t border-white/5">
              
              {/* SECTION A: DIRECT MANUAL OVERRIDE (Current and Target KGs) */}
              <form onSubmit={handleSetBothIndicators} className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest block">Direct Manual Override</span>
                
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Manual Collected KGs *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={currentValInput}
                    onChange={(e) => setCurrentValInput(e.target.value)}
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-green-450 focus:outline-none text-xs font-mono transition-all"
                    placeholder="7450"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Manual Target Quota (KG) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetValInput}
                    onChange={(e) => setTargetValInput(e.target.value)}
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-sky-400 focus:outline-none text-xs font-mono transition-all"
                    placeholder="10000"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-green-500 text-slate-950 hover:bg-green-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-green-500/10 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Update Live Indicators</span>
                </button>
              </form>

              {/* SECTION B: QUICK INCREMENTAL PRESETS */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Quick Delta Presets</span>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Adjustment Step Value (KG)</label>
                  <input
                    type="number"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none text-xs font-mono transition-all"
                    placeholder="500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id="action_add_kg"
                    onClick={() => handleAction('add')}
                    className="py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/15 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>

                  <button
                    type="button"
                    id="action_reduce_kg"
                    onClick={() => handleAction('reduce')}
                    className="py-2.5 bg-red-400/10 hover:bg-red-400/20 text-red-500 border border-red-500/15 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Deduct</span>
                  </button>

                  <button
                    type="button"
                    id="action_set_kg"
                    onClick={() => handleAction('set')}
                    className="py-2.5 bg-sky-500/10 hover:bg-sky-500/25 text-sky-400 border border-sky-450/15 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 cursor-pointer col-span-2"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Override Collected Only</span>
                  </button>

                  <button
                    type="button"
                    id="action_reset_metrics"
                    onClick={() => handleAction('reset')}
                    className="py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-400 border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 col-span-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 font-bold" />
                    <span>Restore Defaults</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal">
                <span className="font-bold text-slate-300 block uppercase mb-1">Administrative Alert</span>
                Updating metrics immediately recalculates milestone corridors, percentage badges, and recycling progress telemetry diagrams in real-time.
              </div>
            </div>
          </div>

          {/* RIGHT: TRACKED LOGS & DATABASE RECORD LISTS COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ACTIVITY STREAM LOG */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-sky-400" />
                  <h3 className="text-lg font-bold font-heading">Recent Activities</h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Live feeds</span>
              </div>

              <div id="activity_stream_logs" className="space-y-3 h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, id) => (
                    <div key={id} className="flex items-center justify-between py-3 border-b border-white/5 gap-3 animate-pulse">
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-slate-800 rounded w-2/3" />
                        <div className="h-3 bg-slate-850 rounded w-1/4" />
                      </div>
                      <div className="w-12 h-3 bg-slate-850 rounded" />
                    </div>
                  ))
                ) : logs.length === 0 ? (
                  <p className="text-slate-500 text-xs py-8 text-center font-medium">No override actions currently tracked in logs.</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between py-2 border-b border-white/5 text-xs gap-3">
                      <div>
                        <span className="text-slate-300 font-medium block">{log.description}</span>
                        {log.value && <span className="text-[10px] font-mono text-green-400 block mt-0.5">{log.value}</span>}
                      </div>
                      <span className="text-slate-500 text-[10px] font-mono mt-0.5 whitespace-nowrap">{log.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TABULAR LAYOUT FOR SUBMITTED REGISTERED USERS */}
            <div className="flex flex-col gap-8">
              
              {/* REGISTERED VOLUNTEER LIST (FULL DATATABLE) */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-rose-450" />
                    <h3 className="text-sm font-bold font-heading text-white">Registered Change Makers</h3>
                    <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-bold">
                      {volunteers.length} Active
                    </span>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search name, city, skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950 text-white pl-9 pr-6 py-2 rounded-xl border border-white/10 focus:border-rose-450 focus:outline-none text-[11px] transition-all"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-[9px] uppercase font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full overflow-x-auto custom-scrollbar rounded-2xl border border-white/5 bg-slate-950/40">
                  <table className="w-full table-auto text-left border-collapse min-w-[700px] text-[11px] text-slate-300">
                    <thead>
                      <tr className="bg-slate-950/80 text-slate-400 border-b border-white/5 font-semibold text-[10px] uppercase tracking-wider">
                        <th 
                          onClick={() => handleSort('name')}
                          className="p-3 hover:text-white cursor-pointer transition-colors select-none w-[20%]"
                        >
                          <div className="flex items-center space-x-1">
                            <span>Name</span>
                            <ArrowUpDown className="w-3 h-3 text-rose-400" />
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('city')}
                          className="p-3 hover:text-white cursor-pointer transition-colors select-none w-[15%]"
                        >
                          <div className="flex items-center space-x-1">
                            <span>City</span>
                            <ArrowUpDown className="w-3 h-3 text-rose-400" />
                          </div>
                        </th>
                        <th className="p-3 w-[25%]">Contact Info</th>
                        <th className="p-3 w-[20%]">Skills & Schedule</th>
                        <th 
                          onClick={() => handleSort('createdAt')}
                          className="p-3 hover:text-white cursor-pointer transition-colors select-none w-[15%]"
                        >
                          <div className="flex items-center space-x-1">
                            <span>Registered</span>
                            <ArrowUpDown className="w-3 h-3 text-rose-400" />
                          </div>
                        </th>
                        <th className="p-3 text-center w-[10%]">View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, id) => (
                          <tr key={id} className="border-b border-white/5 animate-pulse">
                            <td className="p-3"><div className="h-3.5 bg-slate-800 rounded w-2/3" /></td>
                            <td className="p-3"><div className="h-3.5 bg-slate-800 rounded w-1/2" /></td>
                            <td className="p-3"><div className="h-3.5 bg-slate-800 rounded w-3/4" /></td>
                            <td className="p-3"><div className="h-3.5 bg-slate-800 rounded w-1/2" /></td>
                            <td className="p-3"><div className="h-3.5 bg-slate-800 rounded w-1/3" /></td>
                            <td className="p-3"><div className="h-3.5 bg-slate-800 rounded w-8 mx-auto" /></td>
                          </tr>
                        ))
                      ) : sortedVolunteers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-slate-500 text-[11px] font-medium">
                            No registered volunteers matches searching query.
                          </td>
                        </tr>
                      ) : (
                        sortedVolunteers.map((vol) => {
                          const isExpanded = expandedVolunteerId === vol.id;
                          return (
                            <React.Fragment key={vol.id}>
                              <tr 
                                onClick={() => setExpandedVolunteerId(isExpanded ? null : vol.id)}
                                className={`border-b border-white/5 hover:bg-slate-900/30 transition-all cursor-pointer select-none ${
                                  isExpanded ? 'bg-rose-500/5' : ''
                                }`}
                              >
                                <td className="p-3 font-bold text-white font-heading">{vol.name}</td>
                                <td className="p-3 font-medium text-slate-300">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3 text-rose-450 flex-shrink-0" />
                                    <span>{vol.city}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-slate-400 font-mono space-y-0.5" onClick={(e) => e.stopPropagation()}>
                                  <p className="flex items-center space-x-1.5"><Mail className="w-3 h-3 text-rose-440 flex-shrink-0" /><span>{vol.email}</span></p>
                                  <p className="flex items-center space-x-1.5"><Phone className="w-3 h-3 text-rose-340 flex-shrink-0" /><span>{vol.phone}</span></p>
                                </td>
                                <td className="p-3 space-y-1">
                                  <div className="flex flex-wrap gap-1">
                                    {vol.skills ? (
                                      vol.skills.split(',').slice(0, 2).map((skill, idx) => (
                                        <span key={idx} className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/10 px-1 py-0.2 rounded font-bold">
                                          {skill.trim()}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[8px] bg-slate-850 text-slate-400 px-1 py-0.2 rounded">General support</span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1 text-[10px] text-slate-450 font-semibold">
                                    <Clock className="w-3 h-3 text-amber-500" />
                                    <span>{vol.availability || 'Weekends'}</span>
                                  </div>
                                </td>
                                <td className="p-3 font-mono text-[10px] text-slate-500">{vol.createdAt ? vol.createdAt.split(',')[0] : ''}</td>
                                <td className="p-3 text-center">
                                  <button className="p-1 px-2 rounded border border-white/5 hover:border-white/10 bg-slate-900 text-slate-400 hover:text-white transition-all text-[9px] font-bold">
                                    {isExpanded ? 'Hide' : 'Show'}
                                  </button>
                                </td>
                              </tr>

                              {isExpanded && (
                                <tr className="bg-slate-950/80">
                                  <td colSpan={6} className="p-4 border-b border-white/5">
                                    <div className="rounded-xl border border-rose-500/10 bg-slate-900/15 p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Verified Ecological Skills</span>
                                          <div className="flex flex-wrap gap-1">
                                            {vol.skills ? (
                                              vol.skills.split(',').map((skill, idx) => (
                                                <span key={idx} className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2 py-0.5 rounded-full font-bold">
                                                  {skill.trim()}
                                                </span>
                                              ))
                                            ) : (
                                              <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                                                General Cleanup Volunteer
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        <div className="space-y-1">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Weekly Availability Schedule</span>
                                          <div className="flex items-center space-x-1.5 p-1.5 bg-slate-900/40 rounded-lg text-slate-300">
                                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                                            <span className="text-[10px] font-semibold">{vol.availability || 'Weekends / On-Call'}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="space-y-1 pt-1">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Aspiration Message Statement</span>
                                        <blockquote className="text-[10.5px] text-slate-300 leading-relaxed italic bg-slate-900/80 p-3 rounded-lg border border-white/5">
                                          "{vol.message || 'I am ready to get involved and dedicate my support to restore our local ecological landscapes and clean up waste fields.'}"
                                        </blockquote>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* INITIATIVES BLUEPRINTS LIST */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Rocket className="w-5 h-5 text-sky-400" />
                    <h3 className="text-sm font-bold font-heading text-white">Ecological Registered Initiatives</h3>
                  </div>
                  <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full font-bold">
                    {initiatives.length} Active
                  </span>
                </div>

                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, id) => (
                      <div key={id} className="p-4 bg-slate-900/30 rounded-xl border border-white/5 space-y-2 animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="h-4 bg-slate-800 rounded w-1/3" />
                          <div className="h-3 bg-slate-850 rounded w-1/6" />
                        </div>
                        <div className="h-3 bg-slate-800 rounded w-1/2" />
                        <div className="h-8 bg-slate-900/80 rounded w-full" />
                      </div>
                    ))
                  ) : initiatives.length === 0 ? (
                    <p className="text-slate-500 text-xs text-center py-12 font-medium">No initiative requests tracked yet.</p>
                  ) : (
                    initiatives.map((init) => {
                      const isExpanded = expandedInitiativeId === init.id;
                      return (
                        <div
                          key={init.id}
                          onClick={() => setExpandedInitiativeId(isExpanded ? null : init.id)}
                          className={`p-4 bg-slate-950/70 hover:bg-slate-950 rounded-2xl border transition-all cursor-pointer select-none ${
                            isExpanded ? 'border-sky-500/30 shadow-[0_4px_20px_rgba(56,189,248,0.1)]' : 'border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-white font-heading">{init.name}</p>
                              <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-400">
                                <MapPin className="w-3 h-3 text-sky-400 flex-shrink-0" />
                                <span>{init.city}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[9px] text-slate-500 font-mono">{init.createdAt.split(',')[0]}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                          </div>

                          {/* Quick summary line (only show when collapsed) */}
                          {!isExpanded && (
                            <div className="mt-2 text-[10px] text-slate-400 line-clamp-1 flex items-center space-x-2">
                              <span className="bg-sky-500/10 text-sky-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                                Theme: {init.category}
                              </span>
                              <span className="text-slate-500">|</span>
                              <span className="truncate italic">"{init.message || 'Ecological project pitch!'}"</span>
                            </div>
                          )}

                          {/* Exhaustive expand details view */}
                          {isExpanded && (
                            <div className="mt-4 pt-3 border-t border-white/5 space-y-3 text-[11px] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                              
                              {/* Contact coordinates */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                                <a
                                  href={`mailto:${init.email}`}
                                  className="flex items-center space-x-2 p-2 bg-slate-900/60 rounded-xl hover:bg-slate-900 hover:text-white border border-white/5 transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                                  <span className="truncate font-mono text-[10px]">{init.email}</span>
                                </a>
                                
                                <a
                                  href={`tel:${init.phone}`}
                                  className="flex items-center space-x-2 p-2 bg-slate-900/60 rounded-xl hover:bg-slate-900 hover:text-white border border-white/5 transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5 text-sky-300 flex-shrink-0" />
                                  <span className="truncate font-mono text-[10px]">{init.phone}</span>
                                </a>
                              </div>

                              {/* Focus Classification Category Tag */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Initiative Focus Theme</span>
                                <div className="flex items-center space-x-1.5 p-2 bg-sky-500/5 text-sky-400 border border-sky-500/10 rounded-xl font-bold">
                                  <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="text-[10px]">{init.category}</span>
                                </div>
                              </div>

                              {/* Initiative description message statements */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Registration Strategy Proposal</span>
                                <blockquote className="text-[10.5px] text-slate-300 leading-relaxed italic bg-slate-900/80 p-3 rounded-xl border border-white/5 relative">
                                  "{init.message || 'We wish to adopt clean practices, distribute resource kits, launch structural waste recovery, and empower local green leadership in our communities.'}"
                                </blockquote>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

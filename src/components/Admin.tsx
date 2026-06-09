import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useDashboard } from '../context/DashboardContext';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Target,
  Users,
  Award,
  Sliders,
  Activity,
  UserPlus,
  Trash2,
  Lock,
  LogOut,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Search,
  ArrowUpDown,
  GraduationCap,
  Globe
} from 'lucide-react';

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
    updateVolunteerStatus,
    seedMockData,
    isLoading
  } = useDashboard();

  const [currentValInput, setCurrentValInput] = useState<string>('');
  const [targetValInput, setTargetValInput] = useState<string>('');
  const [schoolsValInput, setSchoolsValInput] = useState<string>('');
  const [eventsValInput, setEventsValInput] = useState<string>('');
  const [volunteersValInput, setVolunteersValInput] = useState<string>('');
  const [communitiesValInput, setCommunitiesValInput] = useState<string>('');
  const [expandedVolunteerId, setExpandedVolunteerId] = useState<string | null>(null);

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
      setSchoolsValInput((metrics.schoolsCount ?? 3).toString());
      setEventsValInput((metrics.eventsCount ?? 112).toString());
      setVolunteersValInput((metrics.volunteersCount ?? 524).toString());
      setCommunitiesValInput((metrics.communitiesCount ?? 4).toString());
    }
  }, [metrics]);

  // Safety block redirect if unauthorized
  React.useEffect(() => {
    if (!isAuthenticated) {
      setActivePage('login');
    }
  }, [isAuthenticated, setActivePage]);

  if (!isAuthenticated) return null;

  const percentage = Math.min((metrics.currentKg / metrics.targetKg) * 100, 100);

  const handleSetAllIndicators = (e: React.FormEvent) => {
    e.preventDefault();
    const currentVal = parseFloat(currentValInput);
    const targetVal = parseFloat(targetValInput);
    const schoolsVal = parseInt(schoolsValInput) || 0;
    const eventsVal = parseInt(eventsValInput) || 0;
    const volunteersVal = parseInt(volunteersValInput) || 0;
    const communitiesVal = parseInt(communitiesValInput) || 0;

    if (isNaN(currentVal) || isNaN(targetVal)) {
      alert('Please introduce real numeric metrics values.');
      return;
    }

    updateMetrics(currentVal, 'set_all', targetVal, {
      currentKg: currentVal,
      targetKg: targetVal,
      schoolsCount: schoolsVal,
      eventsCount: eventsVal,
      volunteersCount: volunteersVal,
      communitiesCount: communitiesVal
    });
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

          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={seedMockData}
              className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-1 shrink-0"
              title="Populates high-fidelity candidates, metrics, logs, and interactive profiles instantly."
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Seed Telemetry Environment</span>
            </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, id) => (
              <div key={id} className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4 animate-pulse">
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
              <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Current Collection</span>
                  <Award className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-black font-heading text-white">{metrics.currentKg.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Metric Unit: KG</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Target Quota</span>
                  <Target className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-2xl font-black font-heading text-white">{metrics.targetKg.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Metric Unit: KG</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Schools Collab.</span>
                  <GraduationCap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-black font-heading text-white">{metrics.schoolsCount ?? 3}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Dynamic count</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Events Hosted</span>
                  <Calendar className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-2xl font-black font-heading text-white">{metrics.eventsCount ?? 112}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Dynamic count</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Volunteers</span>
                  <Users className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-2xl font-black font-heading text-white">{Math.max(metrics.volunteersCount ?? 524, volunteers.length)}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Dynamic count</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Communities Collab.</span>
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-black font-heading text-white">{metrics.communitiesCount ?? 4}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Dynamic count</span>
                </div>
              </div>
            </>
          )}
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
              Mutate live platform indicators systematically. Submit precise manual overrides directly to the cloud backend.
            </p>

            {/* TAB CONTAINER: QUICK ADJUST vs DIRECT MANUALLY ENTER */}
            <div className="space-y-6 pt-2 border-t border-white/5">
              
              {/* SECTION A: DIRECT MANUAL OVERRIDE (All 6 indicators) */}
              <form onSubmit={handleSetAllIndicators} className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest block border-b border-white/5 pb-2">Direct Manual Overrides (Live DB Sync)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Collected KGs</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={currentValInput}
                      onChange={(e) => setCurrentValInput(e.target.value)}
                      className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none text-xs font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Target Quota (KG)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={targetValInput}
                      onChange={(e) => setTargetValInput(e.target.value)}
                      className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-sky-450 focus:outline-none text-xs font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Schools Collab</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={schoolsValInput}
                      onChange={(e) => setSchoolsValInput(e.target.value)}
                      className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-emerald-400 focus:outline-none text-xs font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Events Hosted</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={eventsValInput}
                      onChange={(e) => setEventsValInput(e.target.value)}
                      className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-teal-400 focus:outline-none text-xs font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Volunteers</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={volunteersValInput}
                      onChange={(e) => setVolunteersValInput(e.target.value)}
                      className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-purple-400 focus:outline-none text-xs font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Communities Collab</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={communitiesValInput}
                      onChange={(e) => setCommunitiesValInput(e.target.value)}
                      className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-blue-400 focus:outline-none text-xs font-mono transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-slate-950 hover:brightness-110 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-green-500/10 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>Sync Controls with DB</span>
                </button>
              </form>
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
                        <th className="p-3 w-[20%]">Applied Role & Status</th>
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
                                <td className="p-3 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                                  <div className="text-[11px] font-bold text-white leading-tight">
                                    {vol.appliedRole || 'Coastal Cleanup Crew'}
                                  </div>
                                  <div>
                                    <select
                                      value={vol.status || 'Pending Review'}
                                      onChange={(e) => updateVolunteerStatus(vol.id, e.target.value as any)}
                                      className="bg-slate-950 text-[10px] text-emerald-400 font-mono font-extrabold px-2 py-1 rounded border border-emerald-500/15 focus:outline-none focus:border-emerald-400 cursor-pointer w-full max-w-[155px]"
                                    >
                                      <option value="Pending Review">Pending Review</option>
                                      <option value="Pre-qualified">Pre-qualified</option>
                                      <option value="Orientation Scheduled">Orientation Scheduled</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Archived">Archived</option>
                                    </select>
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


            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

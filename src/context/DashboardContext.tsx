import React, { createContext, useContext, useState, useEffect } from 'react';
import { VolunteerApplication, InitiativeApplication, WasteMetrics, ActivityLog } from '../types';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DashboardContextType {
  metrics: WasteMetrics;
  volunteers: VolunteerApplication[];
  initiatives: InitiativeApplication[];
  logs: ActivityLog[];
  isLoading: boolean;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  submitVolunteer: (app: Omit<VolunteerApplication, 'id' | 'createdAt'>) => Promise<void>;
  submitInitiative: (init: Omit<InitiativeApplication, 'id' | 'createdAt'>) => Promise<void>;
  updateMetrics: (kg: number, action: 'add' | 'reduce' | 'set' | 'reset' | 'set_both', targetKg?: number) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DEFAULT_METRICS: WasteMetrics = {
  currentKg: 7450,
  targetKg: 10000,
  volunteersCount: 524,
  eventsCount: 112,
  communitiesCount: 58
};

const DEFAULT_VOLUNTEERS: VolunteerApplication[] = [
  {
    id: 'vol-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@sustain.org',
    phone: '+1 (555) 124-5869',
    city: 'San Francisco',
    skills: 'Community Organizing, Public Speaking',
    availability: 'Part-time (Weekends)',
    message: "Passionate about structural plastic reductions. Let's co-create localized collection events!",
    createdAt: new Date(Date.now() - 4 * 3600000).toLocaleString()
  },
  {
    id: 'vol-2',
    name: 'Michael Chen',
    email: 'm.chen@greenbyte.io',
    phone: '+1 (555) 987-6543',
    city: 'Seattle',
    skills: 'Technical logistics, Heavy Lifting, Driving',
    availability: 'One-off events',
    message: 'Happy to pick up local e-waste and drive it to standard processing centers.',
    createdAt: new Date(Date.now() - 28 * 3600000).toLocaleString()
  }
];

const DEFAULT_INITIATIVES: InitiativeApplication[] = [
  {
    id: 'init-1',
    name: 'Oceanic Plastics Cleanup',
    email: 'p.collins@bluefuture.org',
    phone: '+1 (555) 432-1098',
    city: 'San Diego',
    category: 'Coastal Community Waste Points',
    message: 'Scaling our local beach cleanup initiative by adding mobile collection stations on the sand.',
    createdAt: new Date(Date.now() - 12 * 3600000).toLocaleString()
  }
];

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    type: 'new_initiative',
    description: 'New Initiative "Oceanic Plastics Cleanup" registered via Toolkit tracker.',
    timestamp: new Date(Date.now() - 12 * 3600000).toLocaleTimeString()
  },
  {
    id: 'log-2',
    type: 'new_volunteer',
    description: 'Sarah Jenkins registered to become an active Change Maker.',
    timestamp: new Date(Date.now() - 4 * 3600000).toLocaleTimeString()
  }
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [metrics, setMetrics] = useState<WasteMetrics>(() => {
    const saved = localStorage.getItem('renewa_metrics');
    return saved ? JSON.parse(saved) : DEFAULT_METRICS;
  });
  
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>(() => {
    const saved = localStorage.getItem('renewa_volunteers');
    return saved ? JSON.parse(saved) : DEFAULT_VOLUNTEERS;
  });

  const [initiatives, setInitiatives] = useState<InitiativeApplication[]>(() => {
    const saved = localStorage.getItem('renewa_initiatives');
    return saved ? JSON.parse(saved) : DEFAULT_INITIATIVES;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('renewa_logs');
    return saved ? JSON.parse(saved) : DEFAULT_LOGS;
  });

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load database metrics real-time
  const fetchMetrics = async () => {
    if (!hasSupabaseConfig || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('impact_metrics')
        .select('*')
        .eq('id', 'system_metrics')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setMetrics({
          currentKg: data.currentKg,
          targetKg: data.targetKg,
          volunteersCount: data.volunteersCount,
          eventsCount: data.eventsCount,
          communitiesCount: data.communitiesCount
        });
        console.log('[SUPABASE DATABASE TRANSACTION SUCCESS] Sourced real-time performance indicators metrics.');
      } else {
        // Seed the system_metrics row if empty using upsert for safety
        const { error: seedError } = await supabase
          .from('impact_metrics')
          .upsert({
            id: 'system_metrics',
            currentKg: DEFAULT_METRICS.currentKg,
            targetKg: DEFAULT_METRICS.targetKg,
            volunteersCount: DEFAULT_METRICS.volunteersCount,
            eventsCount: DEFAULT_METRICS.eventsCount,
            communitiesCount: DEFAULT_METRICS.communitiesCount
          });
        if (!seedError) {
          console.log('[SUPABASE DATABASE TRANSACTION SUCCESS] Seeded default environmental indicators row.');
        }
      }
    } catch (err) {
      console.warn('[SUPABASE FETCH METRICS DETAIL WARNING] Table impact_metrics might not exist or connection failed. Using local storage metrics.', err);
    }
  };

  const fetchVolunteers = async () => {
    if (!hasSupabaseConfig || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      if (data) {
        setVolunteers(data.map(v => ({
          id: v.id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          city: v.city,
          skills: v.skills || '',
          availability: v.availability || '',
          message: v.message || '',
          createdAt: v.createdAt ? new Date(v.createdAt).toLocaleString() : ''
        })));
        console.log(`[SUPABASE DATABASE TRANSACTION SUCCESS] Synced ${data.length} registered Change Makers successfully.`);
      }
    } catch (err) {
      console.warn('[SUPABASE FETCH VOLUNTEERS WARNING] Table volunteers could not be fetched.', err);
    }
  };

  const fetchInitiatives = async () => {
    if (!hasSupabaseConfig || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      if (data) {
        setInitiatives(data.map(i => ({
          id: i.id,
          name: i.name,
          email: i.email,
          phone: i.phone,
          city: i.city,
          category: i.category,
          message: i.message || '',
          createdAt: i.createdAt ? new Date(i.createdAt).toLocaleString() : ''
        })));
        console.log(`[SUPABASE DATABASE TRANSACTION SUCCESS] Loaded ${data.length} active initiatives successfully.`);
      }
    } catch (err) {
      console.warn('[SUPABASE FETCH INITIATIVES WARNING] Table initiatives could not be fetched.', err);
    }
  };

  const fetchLogs = async () => {
    if (!hasSupabaseConfig || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) {
        setLogs(data);
        console.log(`[SUPABASE DATABASE TRANSACTION SUCCESS] Sourced ${data.length} audit logs info.`);
      }
    } catch (err) {
      console.warn('[SUPABASE FETCH LOGS WARNING] Table logs could not be fetched.', err);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchMetrics(),
        fetchVolunteers(),
        fetchInitiatives(),
        fetchLogs()
      ]);
      // Gentle ambient lock delay to show off beautiful skeletons smoothly
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (err) {
      console.warn('[SUPABASE REFRESH EXCEPTION]', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time synchronization subscription using Supabase broadcast / changes
  useEffect(() => {
    refreshAll();

    if (!hasSupabaseConfig || !supabase) return;

    // Real-time Supabase Table Channels Subscriptions
    const subMetrics = supabase
      .channel('metrics-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'impact_metrics' }, () => {
        fetchMetrics();
      })
      .subscribe();

    const subVolunteers = supabase
      .channel('volunteers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'volunteers' }, () => {
        fetchVolunteers();
        fetchMetrics(); // metrics depends on volunteers count
      })
      .subscribe();

    const subInitiatives = supabase
      .channel('initiatives-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'initiatives' }, () => {
        fetchInitiatives();
        fetchMetrics(); // metrics depends on initiatives count
      })
      .subscribe();

    const subLogs = supabase
      .channel('logs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subMetrics);
      supabase.removeChannel(subVolunteers);
      supabase.removeChannel(subInitiatives);
      supabase.removeChannel(subLogs);
    };
  }, []);

  // Save changes back to LocalStorage
  useEffect(() => {
    localStorage.setItem('renewa_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('renewa_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('renewa_initiatives', JSON.stringify(initiatives));
  }, [initiatives]);

  useEffect(() => {
    localStorage.setItem('renewa_logs', JSON.stringify(logs));
  }, [logs]);

  const submitVolunteer = async (app: Omit<VolunteerApplication, 'id' | 'createdAt'>) => {
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const localCreatedAtStr = new Date().toLocaleString();
    const mockId = 'vol-' + Math.random().toString(36).substr(2, 9);

    if (hasSupabaseConfig && supabase) {
      try {
        const { data, error } = await supabase
          .from('volunteers')
          .insert([{
            name: app.name,
            email: app.email,
            phone: app.phone,
            city: app.city,
            skills: app.skills,
            availability: app.availability,
            message: app.message
          }])
          .select()
          .single();

        if (error) throw error;

        console.log('[SUPABASE DATABASE TRANSACTION SUCCESS] Volunteer profile committed successfully:', data);

        // Update indicator stats in Supabase using upsert
        const updatedVolunteersCount = metrics.volunteersCount + 1;
        await supabase
          .from('impact_metrics')
          .upsert({
            id: 'system_metrics',
            currentKg: metrics.currentKg,
            targetKg: metrics.targetKg,
            volunteersCount: updatedVolunteersCount,
            eventsCount: metrics.eventsCount,
            communitiesCount: metrics.communitiesCount
          });

        console.log('[SUPABASE DATABASE TRANSACTION SUCCESS] Environmental indicators updated count (+1 volunteer).');

        // Append log
        await supabase
          .from('logs')
          .insert([{
            type: 'new_volunteer',
            description: `${app.name} registered as an active Volunteer Change Maker.`,
            timestamp: timestampStr
          }]);

        console.log('[SUPABASE DATABASE TRANSACTION SUCCESS] Operational audit log tracked.');

        addToast(`Welcome aboard, ${app.name}! You have registered successfully as a Change Maker.`, 'success');
        await refreshAll();
        return;
      } catch (err) {
        console.error('[SUPABASE SUBMIT VOLUNTEER EXCEPTION] Falling back to local storage sync.', err);
      }
    }

    // High integrity Local Storage Sync
    const newVol: VolunteerApplication = {
      id: mockId,
      ...app,
      createdAt: localCreatedAtStr
    };
    setVolunteers(prev => [newVol, ...prev]);
    setMetrics(prev => ({
      ...prev,
      volunteersCount: prev.volunteersCount + 1
    }));
    setLogs(prev => [
      {
        id: 'log-' + Math.random().toString(36).substr(2, 9),
        type: 'new_volunteer',
        description: `${app.name} registered as an active Volunteer Change Maker.`,
        timestamp: timestampStr
      },
      ...prev
    ]);
    addToast(`Welcome aboard, ${app.name}! You have registered successfully as a Change Maker.`, 'success');
  };

  const submitInitiative = async (init: Omit<InitiativeApplication, 'id' | 'createdAt'>) => {
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const localCreatedAtStr = new Date().toLocaleString();
    const mockId = 'init-' + Math.random().toString(36).substr(2, 9);

    if (hasSupabaseConfig && supabase) {
      try {
        const { data, error } = await supabase
          .from('initiatives')
          .insert([{
            name: init.name,
            email: init.email,
            phone: init.phone,
            city: init.city,
            category: init.category,
            message: init.message
          }])
          .select()
          .single();

        if (error) throw error;

        console.log('[SUPABASE DATABASE TRANSACTION SUCCESS] Ecological initiative committed successfully:', data);

        // Update metrics indicators stats in Supabase using upsert
        const updatedEventsCount = metrics.eventsCount + 2;
        const updatedCommunitiesCount = metrics.communitiesCount + 1;
        await supabase
          .from('impact_metrics')
          .upsert({ 
            id: 'system_metrics',
            currentKg: metrics.currentKg,
            targetKg: metrics.targetKg,
            volunteersCount: metrics.volunteersCount,
            eventsCount: updatedEventsCount,
            communitiesCount: updatedCommunitiesCount
          });

        console.log('[SUPABASE DATABASE TRANSACTION SUCCESS] Environmental indicators updated stats (+2 events, +1 community).');

        // Append log
        await supabase
          .from('logs')
          .insert([{
            type: 'new_initiative',
            description: `New ecological initiative site registered: "${init.name}" in ${init.city}.`,
            timestamp: timestampStr
          }]);

        console.log('[SUPABASE DATABASE TRANSACTION SUCCESS] Ecological registration audit log logged.');

        addToast(`New ecological site "${init.name}" has been successfully registered!`, 'success');
        await refreshAll();
        return;
      } catch (err) {
        console.error('[SUPABASE SUBMIT INITIATIVE EXCEPTION] Falling back to local storage sync.', err);
      }
    }

    // High integrity Local Storage Sync
    const newInit: InitiativeApplication = {
      id: mockId,
      ...init,
      createdAt: localCreatedAtStr
    };
    setInitiatives(prev => [newInit, ...prev]);
    setMetrics(prev => ({
      ...prev,
      eventsCount: prev.eventsCount + 2,
      communitiesCount: prev.communitiesCount + 1
    }));
    setLogs(prev => [
      {
        id: 'log-' + Math.random().toString(36).substr(2, 9),
        type: 'new_initiative',
        description: `New ecological initiative site registered: "${init.name}" in ${init.city}.`,
        timestamp: timestampStr
      },
      ...prev
    ]);
    addToast(`New ecological site "${init.name}" has been successfully registered!`, 'success');
  };

  const updateMetrics = async (kg: number, action: 'add' | 'reduce' | 'set' | 'reset' | 'set_both', targetKg?: number) => {
    let finalKg = metrics.currentKg;
    let finalTarget = metrics.targetKg;

    switch (action) {
      case 'add':
        finalKg = Math.min(finalKg + kg, 100000);
        break;
      case 'reduce':
        finalKg = Math.max(finalKg - kg, 0);
        break;
      case 'set':
        finalKg = Math.max(kg, 0);
        break;
      case 'set_both':
        finalKg = Math.max(kg, 0);
        if (targetKg !== undefined) {
          finalTarget = Math.max(targetKg, 1);
        }
        break;
      case 'reset':
        finalKg = DEFAULT_METRICS.currentKg;
        finalTarget = DEFAULT_METRICS.targetKg;
        break;
    }

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (hasSupabaseConfig && supabase) {
      try {
        const { error } = await supabase
          .from('impact_metrics')
          .upsert({
            id: 'system_metrics',
            currentKg: finalKg,
            targetKg: finalTarget,
            volunteersCount: metrics.volunteersCount,
            eventsCount: metrics.eventsCount,
            communitiesCount: metrics.communitiesCount
          });

        if (error) throw error;

        console.log(`[SUPABASE DATABASE TRANSACTION SUCCESS] Updated target progress limits to ${finalKg} KG.`);

        await supabase
          .from('logs')
          .insert([{
            type: 'waste_update',
            description: `Metrics updated via Console. Action: ${action.toUpperCase()}`,
            value: `${finalKg} / ${finalTarget} KG`,
            timestamp: timestampStr
          }]);

        console.log('[SUPABASE DATABASE TRANSACTION SUCCESS] Metrics change audit log successfully synced.');

        addToast(`Environmental impact metrics updated successfully!`, 'success');
        await refreshAll();
        return;
      } catch (err) {
        console.error('[SUPABASE METRICS UPDATE EXCEPTION] Falling back to local storage sync.', err);
      }
    }

    // High integrity Local Storage Sync
    setMetrics(prev => ({
      ...prev,
      currentKg: finalKg,
      targetKg: finalTarget
    }));
    setLogs(prev => [
      {
        id: 'log-' + Math.random().toString(36).substr(2, 9),
        type: 'waste_update',
        description: `Metrics updated via Console. Action: ${action.toUpperCase()}`,
        value: `${finalKg} / ${finalTarget} KG`,
        timestamp: timestampStr
      },
      ...prev
    ]);
    addToast(`Environmental impact metrics updated successfully!`, 'success');
  };

  return (
    <DashboardContext.Provider value={{
      metrics,
      volunteers,
      initiatives,
      logs,
      isLoading,
      toasts,
      addToast,
      removeToast,
      submitVolunteer,
      submitInitiative,
      updateMetrics,
      refreshAll
    }}>
      {children}
      
      {/* GLOBAL TOAST NOTIFICATION GRID */}
      <div className="fixed bottom-6 right-6 z-[999] max-w-sm w-full pointer-events-none space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            // Helper to get configuration based on toast.type
            const getToastStyles = (type: 'success' | 'error' | 'info') => {
              switch (type) {
                case 'error':
                  return {
                    icon: <AlertCircle className="w-[18px] h-[18px] text-rose-400" />,
                    bgColor: 'bg-rose-500/10',
                    borderColor: 'border-rose-500/30',
                    textColor: 'text-rose-400',
                    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/35',
                    title: 'Alert',
                    shadow: 'shadow-[0_8px_32px_rgba(244,63,94,0.2)]'
                  };
                case 'info':
                  return {
                    icon: <Info className="w-[18px] h-[18px] text-sky-400" />,
                    bgColor: 'bg-sky-500/10',
                    borderColor: 'border-sky-500/30',
                    textColor: 'text-sky-400',
                    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/35',
                    title: 'Notification',
                    shadow: 'shadow-[0_8px_32px_rgba(14,165,233,0.2)]'
                  };
                case 'success':
                default:
                  return {
                    icon: <CheckCircle2 className="w-[18px] h-[18px] text-emerald-400" />,
                    bgColor: 'bg-emerald-500/10',
                    borderColor: 'border-emerald-500/30',
                    textColor: 'text-emerald-400',
                    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35',
                    title: 'Success',
                    shadow: 'shadow-[0_8px_32px_rgba(16,185,129,0.2)]'
                  };
              }
            };

            const styles = getToastStyles(toast.type);

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`pointer-events-auto w-full glass-container-dark rounded-2xl p-4 border ${styles.borderColor} ${styles.shadow} flex items-start space-x-3 backdrop-blur-md`}
              >
                <div className={`mt-0.5 w-7 h-7 rounded-lg ${styles.bgColor} border ${styles.borderColor} flex items-center justify-center flex-shrink-0`}>
                  {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border ${styles.badge}`}>
                      {styles.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1.5 leading-relaxed font-sans">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

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
  updateVolunteerStatus: (id: string, status: VolunteerApplication['status']) => Promise<void>;
  seedMockData: () => Promise<void>;
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
    appliedRole: 'Coastal Cleanup Crew',
    status: 'Pre-qualified',
    createdAt: new Date(Date.now() - 4 * 3600000).toLocaleString()
  },
  {
    id: 'vol-2',
    name: 'Michael Chen',
    email: 'm.chen@greenbyte.io',
    phone: '+1 (555) 987-6543',
    city: 'Seattle',
    skills: 'Technical logistics, Heavy Lifting, Driving',
    availability: 'Weekly (Evenings)',
    message: 'Happy to pick up local e-waste and drive it to standard processing centers.',
    appliedRole: 'E-waste Logistics Driver',
    status: 'Pending Review',
    createdAt: new Date(Date.now() - 28 * 3600000).toLocaleString()
  },
  {
    id: 'vol-3',
    name: 'Emma Rodriguez',
    email: 'emma.rod@ecoedu.net',
    phone: '+1 (555) 321-7654',
    city: 'Boston',
    skills: 'Eco webinars, Presentation slidecraft, School partnerships',
    availability: 'Part-time (Weekends)',
    message: 'I want to teach green energy and sustainable sorting methods to the next generation of students.',
    appliedRole: 'School Eco-Advocacy Teacher',
    status: 'Orientation Scheduled',
    createdAt: new Date(Date.now() - 15 * 3600000).toLocaleString()
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
          currentKg: Number(data.currentKg ?? DEFAULT_METRICS.currentKg),
          targetKg: Number(data.targetKg ?? DEFAULT_METRICS.targetKg),
          volunteersCount: Number(data.volunteersCount ?? DEFAULT_METRICS.volunteersCount),
          eventsCount: Number(data.eventsCount ?? DEFAULT_METRICS.eventsCount),
          communitiesCount: Number(data.communitiesCount ?? DEFAULT_METRICS.communitiesCount)
        });
      } else {
        // Seed the system_metrics row if empty
        await supabase
          .from('impact_metrics')
          .insert({
            id: 'system_metrics',
            currentKg: DEFAULT_METRICS.currentKg,
            targetKg: DEFAULT_METRICS.targetKg,
            volunteersCount: DEFAULT_METRICS.volunteersCount,
            eventsCount: DEFAULT_METRICS.eventsCount,
            communitiesCount: DEFAULT_METRICS.communitiesCount
          });
      }
    } catch (err) {
      console.warn('[SUPABASE FETCH METRICS ERROR] Utilizing local state fallback.', err);
    }
  };

  const fetchVolunteers = async () => {
    if (!hasSupabaseConfig || !supabase) return;

    // Guard on admin authentication locally to avoid wiping mock lists
    const isLocalAuth = localStorage.getItem('renewa_admin_auth') === 'true';
    if (!isLocalAuth) return;

    try {
      // Verify we are authenticated in Supabase's eyes to bypass RLS clean-wipes
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
      if (!user) {
        console.warn('[SUPABASE FETCH VOLUNTEERS SKIPPED] Unauthenticated session. Restricting wipe of local cache.');
        return;
      }

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
          appliedRole: v.appliedRole || 'Coastal Cleanup Crew',
          status: v.status || 'Pending Review',
          createdAt: v.createdAt ? new Date(v.createdAt).toLocaleString() : ''
        })));
      }
    } catch (err) {
      console.warn('[SUPABASE FETCH VOLUNTEERS ERROR]', err);
    }
  };

  const fetchInitiatives = async () => {
    if (!hasSupabaseConfig || !supabase) return;

    // Guard on admin authentication locally to avoid wiping mock lists
    const isLocalAuth = localStorage.getItem('renewa_admin_auth') === 'true';
    if (!isLocalAuth) return;

    try {
      // Verify we are authenticated in Supabase's eyes to bypass RLS clean-wipes
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
      if (!user) {
        console.warn('[SUPABASE FETCH INITIATIVES SKIPPED] Unauthenticated session. Restricting wipe of local cache.');
        return;
      }

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
      }
    } catch (err) {
      console.warn('[SUPABASE FETCH INITIATIVES ERROR]', err);
    }
  };

  const fetchLogs = async () => {
    if (!hasSupabaseConfig || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      if (data) {
        setLogs(data);
      }
    } catch (err) {
      console.warn('[SUPABASE FETCH LOGS ERROR]', err);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    if (hasSupabaseConfig && supabase) {
      await Promise.all([
        fetchMetrics(),
        fetchVolunteers(),
        fetchInitiatives(),
        fetchLogs()
      ]);
    }
    // Gentle transition delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  // Real-time synchronization subscription using Supabase Channel Snapshots
  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const loadData = async () => {
      await Promise.all([
        fetchMetrics(),
        fetchVolunteers(),
        fetchInitiatives(),
        fetchLogs()
      ]);
      setIsLoading(false);
    };
    loadData();

    // Listen to changes recursively across schemas
    const channel = supabase
      .channel('schema-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchMetrics();
        fetchVolunteers();
        fetchInitiatives();
        fetchLogs();
      })
      .subscribe();

    // Set up auth state change observer to load authorized tables when session is established
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log('[SUPABASE AUTH STATE CHANGE] Active admin session established:', event);
        fetchVolunteers();
        fetchInitiatives();
      }
    });

    return () => {
      supabase.removeChannel(channel);
      authSubscription.unsubscribe();
    };
  }, []);

  // Save changes back to LocalStorage as fallback key matching
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
        let { error } = await supabase
          .from('volunteers')
          .insert({
            name: app.name,
            email: app.email,
            phone: app.phone,
            city: app.city,
            skills: app.skills,
            availability: app.availability,
            message: app.message,
            appliedRole: app.appliedRole,
            status: app.status
          });

        if (error && error.message.toLowerCase().includes('column')) {
          console.warn('[SUPABASE INSERT WARNING] Custom columns (appliedRole/status) missing in remote schema, falling back to clean core insert.');
          const { error: retryError } = await supabase
            .from('volunteers')
            .insert({
              name: app.name,
              email: app.email,
              phone: app.phone,
              city: app.city,
              skills: app.skills,
              availability: app.availability,
              message: app.message
            });
          if (retryError) throw retryError;
        } else if (error) {
          throw error;
        }

        // Gracefully attempt metrics update (might fail due to RLS if anonymous guest)
        try {
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
        } catch (metricsErr) {
          console.warn('[SUPABASE METRICS UPSERT SKIPPED/FAILED]', metricsErr);
        }

        // Gracefully attempt to append log
        try {
          await supabase
            .from('logs')
            .insert({
              type: 'new_volunteer',
              description: `${app.name} registered as active Change Maker for "${app.appliedRole}".`,
              timestamp: timestampStr
            });
        } catch (logErr) {
          console.warn('[SUPABASE LOG INSERT SKIPPED/FAILED]', logErr);
        }
      } catch (err) {
        console.error('[SUPABASE SUBMIT VOLUNTEER EXCEPTION]', err);
      }
    }

    // High integrity Local Storage & React State update (ALWAYS run for seamless instantaneous UX)
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
        description: `${app.name} registered as active Change Maker for "${app.appliedRole}".`,
        timestamp: timestampStr
      },
      ...prev
    ]);
    addToast(`Successfully registered, ${app.name}! Your application is pending orientation.`, 'success');
  };

  const submitInitiative = async (init: Omit<InitiativeApplication, 'id' | 'createdAt'>) => {
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const localCreatedAtStr = new Date().toLocaleString();
    const mockId = 'init-' + Math.random().toString(36).substr(2, 9);

    if (hasSupabaseConfig && supabase) {
      try {
        const { error } = await supabase
          .from('initiatives')
          .insert({
            name: init.name,
            email: init.email,
            phone: init.phone,
            city: init.city,
            category: init.category,
            message: init.message
          });

        if (error) throw error;

        // Gracefully attempt metrics update (might fail due to RLS if anonymous guest)
        try {
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
        } catch (metricsErr) {
          console.warn('[SUPABASE METRICS UPSERT SKIPPED/FAILED]', metricsErr);
        }

        // Gracefully attempt to append log
        try {
          await supabase
            .from('logs')
            .insert({
              type: 'new_initiative',
              description: `New ecological initiative site registered: "${init.name}" in ${init.city}.`,
              timestamp: timestampStr
            });
        } catch (logErr) {
          console.warn('[SUPABASE LOG INSERT SKIPPED/FAILED]', logErr);
        }
      } catch (err) {
        console.error('[SUPABASE SUBMIT INITIATIVE EXCEPTION]', err);
      }
    }

    // High integrity Local Storage & React State update (ALWAYS run for seamless instantaneous UX)
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

        await supabase
          .from('logs')
          .insert({
            type: 'waste_update',
            description: `Metrics updated via Console. Action: ${action.toUpperCase()}`,
            value: `${finalKg} / ${finalTarget} KG`,
            timestamp: timestampStr
          });

        addToast(`Environmental impact metrics updated successfully!`, 'success');
      } catch (err) {
        console.error('[SUPABASE METRICS UPDATE EXCEPTION] Falling back to local storage sync.', err);
      }
    }

    // High integrity Local Storage Sync Fallback (ALWAYS run to prevent visual lag)
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
  };

  const updateVolunteerStatus = async (id: string, newStatus: VolunteerApplication['status']) => {
    // Attempt standard database update safely
    if (hasSupabaseConfig && supabase) {
      try {
        const { error } = await supabase
          .from('volunteers')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) {
          console.warn('[SUPABASE UPDATE WARNING] Could not update status in remote DB (might lack column):', error.message);
        }
      } catch (err) {
        console.warn('[SUPABASE VOLUNTEER STATUS UPDATE ERROR]', err);
      }
    }

    // Always update React State & LocalStorage for seamless instant response
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    addToast(`Updated application status to: ${newStatus}`, 'info');
  };

  const seedMockData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    localStorage.setItem('renewa_volunteers', JSON.stringify(DEFAULT_VOLUNTEERS));
    setVolunteers(DEFAULT_VOLUNTEERS);

    localStorage.setItem('renewa_initiatives', JSON.stringify(DEFAULT_INITIATIVES));
    setInitiatives(DEFAULT_INITIATIVES);

    localStorage.setItem('renewa_logs', JSON.stringify(DEFAULT_LOGS));
    setLogs(DEFAULT_LOGS);

    localStorage.setItem('renewa_metrics', JSON.stringify(DEFAULT_METRICS));
    setMetrics(DEFAULT_METRICS);

    addToast('Standard telemetry mock environment successfully seeded!', 'success');
    setIsLoading(false);
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
      updateVolunteerStatus,
      seedMockData,
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


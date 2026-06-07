import React, { createContext, useContext, useState, useEffect } from 'react';
import { VolunteerApplication, InitiativeApplication, WasteMetrics, ActivityLog } from '../types';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { collection, doc, setDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../lib/firebaseClient';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

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
    availability: 'Full-time (Weekdays)',
    message: "Background in inventory tracking. Available for commercial sorting runs and waste weight validation.",
    appliedRole: 'E-waste Logistics Driver',
    status: 'Approved',
    createdAt: new Date(Date.now() - 17 * 3600000).toLocaleString()
  },
  {
    id: 'vol-3',
    name: 'Emma Rodriguez',
    email: 'emma.learning@edu-earth.net',
    phone: '+1 (555) 432-1098',
    city: 'Portland',
    skills: 'Curriculum Design, Botany, Child Education',
    availability: 'On-Call',
    message: 'Excited about expanding local circular sorting in primary schools. Ready to host educational seminars.',
    appliedRole: 'School Eco-Teacher',
    status: 'Pending Review',
    createdAt: new Date(Date.now() - 36 * 3600000).toLocaleString()
  }
];

const DEFAULT_INITIATIVES: InitiativeApplication[] = [
  {
    id: 'init-1',
    name: 'Greenwood Sorting Station',
    email: 'contact@greenwood-community.org',
    phone: '+1 (555) 234-5678',
    city: 'San Francisco',
    category: 'Community Workspace Cleanup',
    message: 'Applying for waste sorting templates to convert an unused courtyard into a high-throughput community recycling station.',
    createdAt: new Date(Date.now() - 8 * 3600000).toLocaleString()
  }
];

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    type: 'new_initiative',
    description: 'New Initiative "Greenwood Sorting Station" registered via Circularity Toolkit.',
    timestamp: '12:00:00 PM'
  },
  {
    id: 'log-2',
    type: 'new_volunteer',
    description: 'Emma Rodriguez registered to become an active School Eco-Teacher.',
    timestamp: '02:15:30 PM'
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
    if (hasFirebaseConfig) {
      try {
        const snap = await getDoc(doc(db, 'metrics', 'system_metrics'));
        if (snap.exists()) {
          const data = snap.data();
          setMetrics({
            currentKg: Number(data.currentKg ?? DEFAULT_METRICS.currentKg),
            targetKg: Number(data.targetKg ?? DEFAULT_METRICS.targetKg),
            volunteersCount: Number(data.volunteersCount ?? DEFAULT_METRICS.volunteersCount),
            eventsCount: Number(data.eventsCount ?? DEFAULT_METRICS.eventsCount),
            communitiesCount: Number(data.communitiesCount ?? DEFAULT_METRICS.communitiesCount)
          });
          return;
        }
      } catch (err) {
        console.warn('[FIRESTORE FETCH METRICS ERROR]', err);
      }
    }

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
        console.warn('[SUPABASE FETCH VOLUNTEERS SKIPPED] Unauthenticated session.');
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
        console.warn('[SUPABASE FETCH INITIATIVES SKIPPED] Unauthenticated session.');
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
    await Promise.all([
      fetchMetrics(),
      fetchVolunteers(),
      fetchInitiatives(),
      fetchLogs()
    ]);
    // Gentle transition delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  // Real-time synchronization subscription using Firebase Snapshots & Supabase Connection fallback
  useEffect(() => {
    let unsubMetrics: (() => void) | undefined;
    let unsubVolunteers: (() => void) | undefined;
    let unsubInitiatives: (() => void) | undefined;
    let unsubLogs: (() => void) | undefined;

    if (hasFirebaseConfig) {
      setIsLoading(true);

      // Listen to metrics updates
      unsubMetrics = onSnapshot(doc(db, 'metrics', 'system_metrics'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setMetrics({
            currentKg: Number(data.currentKg ?? DEFAULT_METRICS.currentKg),
            targetKg: Number(data.targetKg ?? DEFAULT_METRICS.targetKg),
            volunteersCount: Number(data.volunteersCount ?? DEFAULT_METRICS.volunteersCount),
            eventsCount: Number(data.eventsCount ?? DEFAULT_METRICS.eventsCount),
            communitiesCount: Number(data.communitiesCount ?? DEFAULT_METRICS.communitiesCount)
          });
        } else {
          // Auto initialize document on sandbox first boot
          setDoc(doc(db, 'metrics', 'system_metrics'), DEFAULT_METRICS);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'metrics/system_metrics');
      });

      // Listen to volunteers collection snapshots
      unsubVolunteers = onSnapshot(collection(db, 'volunteers'), (snapshot) => {
        const loaded: VolunteerApplication[] = [];
        snapshot.forEach((doc) => {
          const v = doc.data();
          loaded.push({
            id: v.id || doc.id,
            name: v.name || '',
            email: v.email || '',
            phone: v.phone || '',
            city: v.city || '',
            skills: v.skills || '',
            availability: v.availability || '',
            message: v.message || '',
            appliedRole: v.appliedRole || 'Coastal Cleanup Crew',
            status: v.status || 'Pending Review',
            createdAt: v.createdAt || ''
          });
        });
        if (loaded.length > 0) {
          // Sort loaded submissions by createdAt or default to maintain order
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setVolunteers(loaded);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'volunteers');
      });

      // Listen to initiatives collection snapshots
      unsubInitiatives = onSnapshot(collection(db, 'initiatives'), (snapshot) => {
        const loaded: InitiativeApplication[] = [];
        snapshot.forEach((doc) => {
          const i = doc.data();
          loaded.push({
            id: i.id || doc.id,
            name: i.name || '',
            email: i.email || '',
            phone: i.phone || '',
            city: i.city || '',
            category: i.category || '',
            message: i.message || '',
            createdAt: i.createdAt || ''
          });
        });
        if (loaded.length > 0) {
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setInitiatives(loaded);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'initiatives');
      });

      // Listen to activity audit logs
      unsubLogs = onSnapshot(collection(db, 'logs'), (snapshot) => {
        const loaded: ActivityLog[] = [];
        snapshot.forEach((doc) => {
          const l = doc.data();
          loaded.push({
            id: l.id || doc.id,
            type: l.type || 'waste_update',
            description: l.description || '',
            value: l.value,
            timestamp: l.timestamp || ''
          });
        });
        if (loaded.length > 0) {
          loaded.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          setLogs(loaded);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'logs');
      });

      setIsLoading(false);
    }

    // Parallel Subscriptions structure for Supabase if URL configured
    let channel: any;
    if (hasSupabaseConfig && supabase) {
      setIsLoading(true);
      const loadSupabaseInitial = async () => {
        await Promise.all([
          fetchMetrics(),
          fetchVolunteers(),
          fetchInitiatives(),
          fetchLogs()
        ]);
        setIsLoading(false);
      };
      loadSupabaseInitial();

      channel = supabase
        .channel('schema-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          fetchMetrics();
          fetchVolunteers();
          fetchInitiatives();
          fetchLogs();
        })
        .subscribe();

      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          fetchVolunteers();
          fetchInitiatives();
        }
      });

      return () => {
        if (channel) supabase.removeChannel(channel);
        authSubscription.unsubscribe();
        if (unsubMetrics) unsubMetrics();
        if (unsubVolunteers) unsubVolunteers();
        if (unsubInitiatives) unsubInitiatives();
        if (unsubLogs) unsubLogs();
      };
    }

    if (!hasSupabaseConfig && !hasFirebaseConfig) {
      setIsLoading(false);
    }

    return () => {
      if (unsubMetrics) unsubMetrics();
      if (unsubVolunteers) unsubVolunteers();
      if (unsubInitiatives) unsubInitiatives();
      if (unsubLogs) unsubLogs();
    };
  }, []);

  // Sync state changes local persistence block as fallback
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

    const updatedVolunteersCount = metrics.volunteersCount + 1;

    // 1. Firebase Write
    if (hasFirebaseConfig) {
      try {
        await setDoc(doc(db, 'volunteers', mockId), {
          id: mockId,
          ...app,
          createdAt: localCreatedAtStr
        });

        await setDoc(doc(db, 'metrics', 'system_metrics'), {
          ...metrics,
          volunteersCount: updatedVolunteersCount
        }, { merge: true });

        const logRef = doc(collection(db, 'logs'));
        await setDoc(logRef, {
          id: logRef.id,
          type: 'new_volunteer',
          description: `${app.name} registered as active Change Maker for "${app.appliedRole}".`,
          timestamp: timestampStr,
          createdAt: localCreatedAtStr
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `volunteers/${mockId}`);
      }
    }

    // 2. Supabase Write
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
          console.warn('[SUPABASE INSERT WARNING] Fallback cleanly onto Core columns.');
          await supabase
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
        }

        try {
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
        } catch (_) {}

        try {
          await supabase
            .from('logs')
            .insert({
              type: 'new_volunteer',
              description: `${app.name} registered as active Change Maker for "${app.appliedRole}".`,
              timestamp: timestampStr
            });
        } catch (_) {}
      } catch (err) {
        console.error('[SUPABASE SUBMIT VOLUNTEER EXCEPTION]', err);
      }
    }

    // 3. React fallback/instant state transitions
    const newVol: VolunteerApplication = {
      id: mockId,
      ...app,
      createdAt: localCreatedAtStr
    };
    setVolunteers(prev => [newVol, ...prev]);
    setMetrics(prev => ({
      ...prev,
      volunteersCount: updatedVolunteersCount
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

    const updatedEventsCount = metrics.eventsCount + 2;
    const updatedCommunitiesCount = metrics.communitiesCount + 1;

    // 1. Firebase Write
    if (hasFirebaseConfig) {
      try {
        await setDoc(doc(db, 'initiatives', mockId), {
          id: mockId,
          ...init,
          createdAt: localCreatedAtStr
        });

        await setDoc(doc(db, 'metrics', 'system_metrics'), {
          ...metrics,
          eventsCount: updatedEventsCount,
          communitiesCount: updatedCommunitiesCount
        }, { merge: true });

        const logRef = doc(collection(db, 'logs'));
        await setDoc(logRef, {
          id: logRef.id,
          type: 'new_initiative',
          description: `New ecological initiative site registered: "${init.name}" in ${init.city}.`,
          timestamp: timestampStr,
          createdAt: localCreatedAtStr
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `initiatives/${mockId}`);
      }
    }

    // 2. Supabase Write
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

        try {
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
        } catch (_) {}

        try {
          await supabase
            .from('logs')
            .insert({
              type: 'new_initiative',
              description: `New ecological initiative site registered: "${init.name}" in ${init.city}.`,
              timestamp: timestampStr
            });
        } catch (_) {}
      } catch (err) {
        console.error('[SUPABASE SUBMIT INITIATIVE EXCEPTION]', err);
      }
    }

    // 3. React fast state transition
    const newInit: InitiativeApplication = {
      id: mockId,
      ...init,
      createdAt: localCreatedAtStr
    };
    setInitiatives(prev => [newInit, ...prev]);
    setMetrics(prev => ({
      ...prev,
      eventsCount: updatedEventsCount,
      communitiesCount: updatedCommunitiesCount
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

    // 1. Firebase update
    if (hasFirebaseConfig) {
      try {
        await setDoc(doc(db, 'metrics', 'system_metrics'), {
          ...metrics,
          currentKg: finalKg,
          targetKg: finalTarget
        });

        const logRef = doc(collection(db, 'logs'));
        await setDoc(logRef, {
          id: logRef.id,
          type: 'waste_update',
          description: `Metrics updated via Console. Action: ${action.toUpperCase()}`,
          value: `${finalKg} / ${finalTarget} KG`,
          timestamp: timestampStr,
          createdAt: new Date().toLocaleString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'metrics/system_metrics');
      }
    }

    // 2. Supabase update
    if (hasSupabaseConfig && supabase) {
      try {
        await supabase
          .from('impact_metrics')
          .upsert({
            id: 'system_metrics',
            currentKg: finalKg,
            targetKg: finalTarget,
            volunteersCount: metrics.volunteersCount,
            eventsCount: metrics.eventsCount,
            communitiesCount: metrics.communitiesCount
          });

        await supabase
          .from('logs')
          .insert({
            type: 'waste_update',
            description: `Metrics updated via Console. Action: ${action.toUpperCase()}`,
            value: `${finalKg} / ${finalTarget} KG`,
            timestamp: timestampStr
          });
      } catch (err) {
        console.error('[SUPABASE METRICS UPDATE EXCEPTION]', err);
      }
    }

    // 3. Keep state updated
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

  const updateVolunteerStatus = async (id: string, newStatus: VolunteerApplication['status']) => {
    // 1. Firebase update
    if (hasFirebaseConfig) {
      try {
        await updateDoc(doc(db, 'volunteers', id), { status: newStatus });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `volunteers/${id}`);
      }
    }

    // 2. Supabase update
    if (hasSupabaseConfig && supabase) {
      try {
        await supabase
          .from('volunteers')
          .update({ status: newStatus })
          .eq('id', id);
      } catch (err) {
        console.warn('[SUPABASE VOLUNTEER STATUS UPDATE ERROR]', err);
      }
    }

    // 3. React fast update
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    addToast(`Updated application status to: ${newStatus}`, 'info');
  };

  const seedMockData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    // Clear and restore original environments mock lists in LocalStorage & Cloud DB
    if (hasFirebaseConfig) {
      try {
        await setDoc(doc(db, 'metrics', 'system_metrics'), DEFAULT_METRICS);

        for (const v of DEFAULT_VOLUNTEERS) {
          await setDoc(doc(db, 'volunteers', v.id), v);
        }

        for (const i of DEFAULT_INITIATIVES) {
          await setDoc(doc(db, 'initiatives', i.id), i);
        }

        // Add seeds tracker logs too
        for (const l of DEFAULT_LOGS) {
          await setDoc(doc(db, 'logs', l.id), l);
        }
      } catch (err) {
        console.error('[FIRESTORE SEED EXCEPTION]', err);
      }
    }

    if (hasSupabaseConfig && supabase) {
      try {
        await supabase
          .from('impact_metrics')
          .upsert({ id: 'system_metrics', ...DEFAULT_METRICS });

        for (const v of DEFAULT_VOLUNTEERS) {
          await supabase
            .from('volunteers')
            .upsert({
              name: v.name,
              email: v.email,
              phone: v.phone,
              city: v.city,
              skills: v.skills,
              availability: v.availability,
              message: v.message,
              appliedRole: v.appliedRole,
              status: v.status
            });
        }
      } catch (err) {
        console.warn('[SUPABASE SEED ERROR]', err);
      }
    }

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

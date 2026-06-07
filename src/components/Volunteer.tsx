import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { VolunteerRequirement } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { z } from 'zod';
import {
  Heart,
  Award,
  BadgeCheck,
  Users,
  BookOpen,
  Calendar,
  Sparkles,
  Send,
  X,
  Compass,
  ArrowRight,
  ChevronRight,
  Search,
  Building,
  Clock,
  MapPin,
  Shield,
  Activity,
  CheckCircle2,
  Info
} from 'lucide-react';

const volunteerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please introduce a valid email address structure.' }),
  phone: z.string().min(7, { message: 'Phone coordinates require a valid numeric pattern.' }),
  city: z.string().min(2, { message: 'Please declare your city of residence.' }),
  skills: z.string().optional(),
  availability: z.string().min(1, { message: 'Please select your availability.' }),
  appliedRole: z.string().min(1, { message: 'Please choose an active requirement post.' }),
  message: z.string().optional()
});

const VOLUNTEER_REQUIREMENTS: VolunteerRequirement[] = [
  {
    id: 'req-1',
    role: 'Coastal Cleanup Crew',
    department: 'Marine Ecologies',
    city: 'San Diego, CA',
    commitment: '3 - 5 hrs / week',
    prerequisites: ['Age 16+', 'Moderate physical fitness', 'Ability to walk on sand'],
    physicalDemand: 'Moderate',
    status: 'Urgent',
    description: 'Help physically clear coastal shores, sort collected chemical microplastics, and set up dynamic mobile sorting stations on the beaches.'
  },
  {
    id: 'req-2',
    role: 'E-waste Logistics Driver',
    department: 'Urban Circularity',
    city: 'Seattle, WA',
    commitment: '4 - 6 hrs / week',
    prerequisites: ['Valid driver licence', 'Squeaky clean record', 'Heavy lifting (25kg)'],
    physicalDemand: 'Heavy',
    status: 'Active',
    description: 'Drive the dedicated RenewA community collection vehicle to pick up and transport discarded electronic waste from regional sorting nodes.'
  },
  {
    id: 'req-3',
    role: 'School Eco-Advocacy Teacher',
    department: 'Sustainable Literacy',
    city: 'Boston, MA',
    commitment: '2 - 3 hrs / week',
    prerequisites: ['Friendly communication skills', 'Presentation slidecraft', 'Youth check vetting'],
    physicalDemand: 'Light',
    status: 'Active',
    description: 'Teach sustainable sorting habits, coordinate interactive recycled-plastic lessons, and distribute learning guides to regional schools.'
  },
  {
    id: 'req-4',
    role: 'Depot Sorting Organizer',
    department: 'Material Logistics',
    city: 'San Francisco, CA',
    commitment: '2 - 4 hrs / week',
    prerequisites: ['Detail oriented', 'Safety gear compliance', 'Active team coordination'],
    physicalDemand: 'Moderate',
    status: 'Active',
    description: 'Classify and grade collected materials (glass, paperboard, polymer subtypes) to ensure they are 100% clean for chemical processing.'
  },
  {
    id: 'req-5',
    role: 'Digital Green Writer',
    department: 'Global Awareness',
    city: 'Remote',
    commitment: '2 - 3 hrs / week',
    prerequisites: ['Basic copywriting', 'Familiar with Canva or layouts', 'Reliable internet connection'],
    physicalDemand: 'Light',
    status: 'Active',
    description: 'Design engaging social graphics, write regional cleanup blog summaries, and broadcast statistical victory logs to inspire digital citizens.'
  }
];

export default function Volunteer() {
  const { submitVolunteer, volunteers, isLoading } = useDashboard();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    skills: '',
    availability: 'Part-time (Weekends)',
    appliedRole: 'Coastal Cleanup Crew',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [justSubmittedName, setJustSubmittedName] = useState('');

  // Search & Filtering for Requirements
  const [reqSearch, setReqSearch] = useState('');
  const [reqFilter, setReqFilter] = useState<'All' | 'Urgent' | 'Active'>('All');
  const [expandedReqId, setExpandedReqId] = useState<string | null>('req-1');

  // Interactive Live Status Checker Email
  const [checkerEmail, setCheckerEmail] = useState('');
  const [checkerResults, setCheckerResults] = useState<any[] | null>(null);
  const [searchedChecker, setSearchedChecker] = useState(false);

  // Filter Requirements Board
  const filteredRequirements = VOLUNTEER_REQUIREMENTS.filter(req => {
    const matchesSearch = req.role.toLowerCase().includes(reqSearch.toLowerCase()) ||
                          req.department.toLowerCase().includes(reqSearch.toLowerCase()) ||
                          req.city.toLowerCase().includes(reqSearch.toLowerCase()) ||
                          req.description.toLowerCase().includes(reqSearch.toLowerCase());
    const matchesFilter = reqFilter === 'All' || req.status === reqFilter;
    return matchesSearch && matchesFilter;
  });

  const handleApplyToRequirement = (req: VolunteerRequirement) => {
    setFormData(prev => ({
      ...prev,
      appliedRole: req.role,
      city: req.city === 'Remote' ? prev.city : req.city.split(',')[0]
    }));
    // Remove errors specifically on role
    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.appliedRole;
      return copy;
    });
    // Smooth scroll to form segment
    const formSection = document.getElementById('volunteer_form_section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedChecker(true);
    const emailToTrace = checkerEmail.trim().toLowerCase();
    if (!emailToTrace) {
      setCheckerResults(null);
      return;
    }
    const matches = volunteers.filter(v => v.email.trim().toLowerCase() === emailToTrace);
    setCheckerResults(matches);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = volunteerSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setFormErrors(errors);
      // Scroll to errors if needed
      return;
    }

    try {
      await submitVolunteer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        skills: formData.skills,
        availability: formData.availability,
        appliedRole: formData.appliedRole,
        status: 'Pending Review'
      });

      setJustSubmittedName(formData.name);
      setShowPopup(true);

      // Auto update active tracer key so they see it in the status check segment below
      setCheckerEmail(formData.email);
      const matchedApps = [{
        name: formData.name,
        email: formData.email,
        appliedRole: formData.appliedRole,
        status: 'Pending Review',
        createdAt: 'Just now'
      }];
      setCheckerResults(matchedApps);
      setSearchedChecker(true);

      // Reset form controls
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        skills: '',
        availability: 'Part-time (Weekends)',
        appliedRole: formData.appliedRole, // retain last chosen to avoid weird jumping
        message: ''
      });
      setFormErrors({});
    } catch (err) {
      console.error("Volunteer application error: ", err);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-32 px-6 relative overflow-hidden">
      
      {/* Dynamic landscape backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1559027615-cd99e5cc0ac4?auto=format&fit=crop&w=1920&q=80"
          alt="Environmental workspace collaboration and volunteer teams sorting materials"
          className="w-full h-full object-cover opacity-[0.05] filter saturate-50 contrast-[1.05]"
          style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.12)) scale(1.15)', transformOrigin: 'center center' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        
        {/* HERO TITLE HEADER SECTION */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest"
          >
            <Compass className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Opportunities Hub</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-heading tracking-tighter leading-[1.08]"
          >
            Volunteer Workspace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans"
          >
            Review active ecological requirements, select your aligned drive path, and submit an intake form to start making a real-world difference.
          </motion.p>
        </div>

        {/* SECTION 1: DYNAMIC VOLUNTEER REQUIREMENTS BOARD */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="space-y-2">
              <span className="text-[10px] tracking-widest uppercase font-extrabold text-emerald-500">Requirements Board</span>
              <h2 className="text-2xl md:text-3xl font-black font-heading text-white">Browse Active Regional Openings</h2>
              <p className="text-slate-400 text-xs max-w-xl">
                Our operations team maintains strict requirements metrics per role. Select a position to pre-populate interest inside your intake form.
              </p>
            </div>

            {/* REQUIREMENTS BAR SEARCH & FILTER CONTROL segments */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter paths, cities, keywords..."
                  value={reqSearch}
                  onChange={(e) => setReqSearch(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-green-400 focus:outline-none w-56 font-medium transition-all"
                />
                {reqSearch && (
                  <button onClick={() => setReqSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] uppercase font-bold text-slate-500 hover:text-white">Clear</button>
                )}
              </div>

              <div className="flex bg-slate-900/80 border border-white/5 rounded-xl p-1 text-xs">
                {(['All', 'Urgent', 'Active'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setReqFilter(mode)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      reqFilter === mode ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Opportunities List Column */}
            <div className="lg:col-span-4 space-y-3">
              {filteredRequirements.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/30 border border-white/5 text-center text-slate-505">
                  <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-bold">No active slots found</p>
                  <p className="text-[10px] text-slate-500">Alter your keyword keywords query.</p>
                </div>
              ) : (
                filteredRequirements.map((req) => {
                  const isSelected = expandedReqId === req.id;
                  return (
                    <div
                      key={req.id}
                      onClick={() => setExpandedReqId(req.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer text-left select-none relative overflow-hidden ${
                        isSelected 
                          ? 'bg-slate-900/80 border-green-500/45 shadow-lg shadow-green-500/5' 
                          : 'bg-slate-900/35 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500">
                            {req.department}
                          </span>
                          <h4 className="text-sm font-bold text-white font-heading mt-0.5">{req.role}</h4>
                        </div>
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                          req.status === 'Urgent' 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : 'bg-green-500/10 text-green-400 border-green-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 mt-3 text-[10px] text-slate-450">
                        <span className="flex items-center space-x-1 font-medium text-slate-400">
                          <MapPin className="w-3 h-3 text-red-400" />
                          <span>{req.city}</span>
                        </span>
                        <span className="flex items-center space-x-1 font-mono text-slate-500">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{req.commitment}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Expanded Detailed Requirement Card panel */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {expandedReqId ? (() => {
                  const req = VOLUNTEER_REQUIREMENTS.find(r => r.id === expandedReqId);
                  if (!req) return null;
                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md relative overflow-hidden space-y-6 text-left shadow-2xl"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600" />

                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase font-mono bg-sky-500/15 border border-sky-400/20 px-2 py-0.5 rounded-full text-sky-300">
                              {req.department}
                            </span>
                            <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                              req.physicalDemand === 'Heavy' 
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                : req.physicalDemand === 'Moderate'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-green-500/10 text-green-400 border-green-500/20'
                            }`}>
                              {req.physicalDemand} Demand
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-black font-heading text-white">{req.role}</h3>
                        </div>

                        <button
                          onClick={() => handleApplyToRequirement(req)}
                          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/15 transition-all text-white hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Apply to this Role
                        </button>
                      </div>

                      <div className="border-t border-white/5 pt-4 space-y-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Description</span>
                          <p className="text-xs text-slate-300 leading-relaxed mt-1">{req.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-white/5">
                            <span className="text-[9px] uppercase font-bold text-slate-500 block">Location Coordinates</span>
                            <span className="text-xs text-slate-200 font-bold flex items-center space-x-1.5">
                              <MapPin className="w-3.5 h-3.5 text-rose-450" />
                              <span>{req.city}</span>
                            </span>
                          </div>

                          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-white/5">
                            <span className="text-[9px] uppercase font-bold text-slate-500 block">Commitment Scope</span>
                            <span className="text-xs text-slate-200 font-bold flex items-center space-x-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span className="font-mono">{req.commitment}</span>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Prerequisites Checklist</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {req.prerequisites.map((reqText, idx) => (
                              <div key={idx} className="flex items-center space-x-2 py-2 px-3 rounded-lg bg-slate-950/20 border border-white/5 text-xs text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 block flex-shrink-0" />
                                <span className="text-[11px] font-semibold">{reqText}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 flex items-center space-x-2 text-[10px] text-slate-500">
                          <Shield className="w-3.5 h-3.5 text-green-500" />
                          <span>Insurance & necessary safety logging gear provided by RenewA Operations</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })() : (
                  <div className="p-12 rounded-3xl bg-slate-900/20 border border-white/5 flex flex-col items-center justify-center text-center text-slate-450 space-y-2">
                    <Award className="w-12 h-12 text-slate-600 block" />
                    <p className="text-sm font-bold">No active requirement selected</p>
                    <p className="text-xs">Click any regional opening pill to evaluate exact prerequisites metrics.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* INTAKE APPLICATION FORM */}
        <section id="volunteer_form_section" className="scroll-mt-24 max-w-3xl mx-auto pt-12">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-black font-heading text-white">Drive Intake Form</h2>
            <p className="text-slate-400 text-xs max-w-xl mx-auto leading-relaxed">
              Complete your formal coordinates registration. Applying binds you to the structural guidelines of authorized orientations.
            </p>
          </div>

          <motion.div
            id="volunteer_glass_form_container"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-container-dark rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-3xl" />

            {/* Preloaded Role Banner */}
            {formData.appliedRole && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center space-x-3 mb-6 text-left">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">Apply target</span>
                  <p className="text-xs font-black text-green-400">Applying for: {formData.appliedRole}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Johnathan Doe"
                    className={`w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border ${formErrors.name ? 'border-red-500/70 focus:border-red-400' : 'border-white/10 focus:border-green-400'} focus:outline-none transition-all text-xs font-medium`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-red-400 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400"></span>
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Email Address *</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="johnathan@domain.com"
                    className={`w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border ${formErrors.email ? 'border-red-500/70 focus:border-red-400' : 'border-white/10 focus:border-green-400'} focus:outline-none transition-all text-xs font-medium`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-red-400 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400"></span>
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Phone Coordinates *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 789-1234"
                    className={`w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border ${formErrors.phone ? 'border-red-500/70 focus:border-red-400' : 'border-white/10 focus:border-green-400'} focus:outline-none transition-all text-xs font-medium`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-400 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400"></span>
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">City of Residence *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. San Diego"
                    className={`w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border ${formErrors.city ? 'border-red-500/70 focus:border-red-400' : 'border-white/10 focus:border-green-400'} focus:outline-none transition-all text-xs font-medium`}
                  />
                  {formErrors.city && (
                    <p className="text-[11px] text-red-400 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400"></span>
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Select Target Recruitment Opening *</label>
                  <select
                    value={formData.appliedRole}
                    onChange={(e) => setFormData({ ...formData, appliedRole: e.target.value })}
                    className={`w-full bg-hide-arrow bg-slate-950 text-white px-4 py-3 rounded-xl border ${formErrors.appliedRole ? 'border-red-500' : 'border-white/10 focus:border-green-400'} focus:outline-none transition-all text-xs font-medium cursor-pointer`}
                  >
                    {VOLUNTEER_REQUIREMENTS.map((r) => (
                      <option key={r.id} value={r.role}>{r.role} ({r.department})</option>
                    ))}
                    <option value="General Volunteer">General Circularity Advocate (On-Call)</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Volunteer Schedule Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none transition-all text-xs font-medium cursor-pointer"
                  >
                    <option>Part-time (Weekends)</option>
                    <option>Weekly (Evenings)</option>
                    <option>Full-time logistics advocate</option>
                    <option>Remote/Digital advocacy only</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Core Skills / Prior Experience</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. Forklift certified, youth teaching, graphic design, manual lifting..."
                    className="w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none transition-all text-xs font-medium"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Statement of Motivation</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Why do you want to secure this circularity slot with the digital RenewA force?"
                    className="w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none transition-all text-xs font-medium resize-none"
                  />
                </div>

              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  id="submit_volunteer_btn"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-xl shadow-green-500/20 hover:shadow-green-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 animate-pulse" />
                  <span>Submit Intake Application</span>
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        {/* SECTION 3: MY SUBMISSIONS STATUS CHECKER */}
        <section id="submission_checker_section" className="max-w-3xl mx-auto pt-10">
          <div className="p-8 rounded-3xl bg-slate-900/30 border border-white/5 space-y-6 text-left">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Application Tracker</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white">Live Status Pipeline Tracker</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Already applied? Enter your registered email address below to inspect your real-time application processing step on the telemetry grid.
              </p>
            </div>

            <form onSubmit={handleCheckStatus} className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                required
                value={checkerEmail}
                onChange={(e) => setCheckerEmail(e.target.value)}
                placeholder="e.g. sarah.j@sustain.org"
                className="bg-slate-950 text-xs px-4 py-3 rounded-xl border border-white/10 focus:border-emerald-400 focus:outline-none flex-1 font-mono"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 border border-white/10 hover:border-emerald-500/30 hover:bg-slate-850 rounded-xl text-xs font-bold font-sans transition-all text-white shrink-0"
              >
                Track Now
              </button>
            </form>

            <AnimatePresence mode="wait">
              {searchedChecker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-4"
                >
                  {!checkerResults || checkerResults.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-950/50 border border-white/5 text-center text-slate-450 space-y-1">
                      <X className="w-5 h-5 text-red-400/80 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-slate-300">No application matches this email</p>
                      <p className="text-[10.5px] text-slate-500">Verify your parameters or register as a change maker above.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-1">
                      {checkerResults.map((app, index) => {
                        const statusSteps = ['Pending Review', 'Pre-qualified', 'Orientation Scheduled', 'Approved'];
                        const activeIndex = statusSteps.indexOf(app.status);
                        
                        return (
                          <div key={index} className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 text-xs space-y-4">
                            <div className="flex justify-between items-center flex-wrap gap-2 text-[11px]">
                              <div>
                                <span className="text-[10px] uppercase text-slate-500 block">Registered Candidate</span>
                                <span className="font-bold text-white font-heading text-xs">{app.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] uppercase text-slate-500 block">Applied Requirement Slot</span>
                                <span className="font-semibold text-emerald-400 font-sans">{app.appliedRole}</span>
                              </div>
                            </div>

                            {/* Dynamic Pipeline Steps visualizer */}
                            <div className="pt-2">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block mb-3">Telemetry Progression Path</span>
                              <div className="grid grid-cols-4 gap-1.5 relative">
                                {statusSteps.map((step, idx) => {
                                  const isCompleted = idx < activeIndex;
                                  const isActive = idx === activeIndex || (app.status === 'Archived' && idx === 0);
                                  
                                  return (
                                    <div key={idx} className="space-y-1.5 text-center relative">
                                      <div className={`h-1.5 rounded-full transition-all ${
                                        isCompleted ? 'bg-green-500' : isActive ? 'bg-emerald-400 animate-pulse' : 'bg-white/10'
                                      }`} />
                                      <span className={`text-[8.5px] font-bold block leading-tight ${
                                        isActive ? 'text-emerald-400 font-extrabold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                                      }`}>
                                        {step}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="pt-2 text-[10px] flex items-center gap-1.5 text-slate-450 leading-normal border-t border-white/5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                              <span>
                                {app.status === 'Pending Review' && 'Our operation logs have locked this file. Pre-qualifying screening will initiate within 24 hours.'}
                                {app.status === 'Pre-qualified' && 'Pre-qualification metrics passed! An orientation team coordinator has dispatched steps.'}
                                {app.status === 'Orientation Scheduled' && 'Orientation calendar finalized! Please review your email inbox logs.'}
                                {app.status === 'Approved' && 'Telemetry status Approved! You are officially scheduled on active drive shifts.'}
                                {app.status === 'Archived' && 'Application archived. Please contact organizer coordinates.'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

      </div>

      {/* REVOLUTIONARY SUCCESS MODAL */}
      <AnimatePresence>
        {showPopup && (
          <div
            id="volunteer_success_popup"
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8 relative shadow-2xl space-y-6 text-center"
            >
              <button
                id="close_success_popup"
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2 bg-slate-950 hover:bg-slate-800 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/10">
                <Heart className="w-7 h-7 fill-green-400/20 text-green-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading text-white">Application Logged!</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Thank you, <span className="text-green-400 font-bold">{justSubmittedName}</span>. Your ecological interest has been registered inside the telemetry stack.
                </p>
                <p className="text-[11px] text-slate-450 leading-normal max-w-sm mx-auto">
                  A verification receipt with instructions has been dispatched. Track your status dynamically below or return to active duties.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="dismiss_popup_btn"
                  onClick={() => {
                    setShowPopup(false);
                    const checkerSection = document.getElementById('submission_checker_section');
                    if (checkerSection) {
                      checkerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="w-full py-2.5 bg-white hover:bg-slate-200 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Track Pipeline Status
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

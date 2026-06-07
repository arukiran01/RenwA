import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Rocket,
  Search,
  Users,
  MapPin,
  Briefcase,
  BarChart3,
  CheckCircle2,
  Lock,
  ChevronRight,
  Send,
  Sparkles
} from 'lucide-react';

export default function Toolkit() {
  const { submitInitiative } = useDashboard();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    category: 'Community Workspace Cleanup',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const steps = [
    {
      step: '01',
      title: 'Identify Waste Sources',
      desc: 'Conduct a thorough audit of your workspace, local school, or building complex. Catalog which recyclable material flows (PLA plastics, high-density paper, metals) are discarded in highest volume.',
      icon: Search,
      badgeClr: 'bg-green-500/10 text-green-400'
    },
    {
      step: '02',
      title: 'Build Your Team',
      desc: 'Bring together local environmental ambassadors, safety wardens, and volunteers. Define core pickup intervals, assign task leaders, and schedule your launch coordinates.',
      icon: Users,
      badgeClr: 'bg-sky-500/10 text-sky-400'
    },
    {
      step: '03',
      title: 'Create Collection Points',
      desc: 'Deploy clearly color-coded, labeled, and weatherproof collection bins at highly frequented hub locations. Ensure sorting compliance and easy transfer logistics.',
      icon: MapPin,
      badgeClr: 'bg-emerald-500/10 text-emerald-400'
    },
    {
      step: '04',
      title: 'Partner With Recyclers',
      desc: 'Connect your collection volumes to verified municipal recyclers, waste management processors, or RenewA collection hubs to assure closed-loop processing.',
      icon: Briefcase,
      badgeClr: 'bg-indigo-500/10 text-indigo-400'
    },
    {
      step: '05',
      title: 'Measure Impact',
      desc: 'Log weekly collection values, compute total landfill diversion weights on the platform, and evaluate reductions in carbon footprints to share with community backers.',
      icon: BarChart3,
      badgeClr: 'bg-purple-500/10 text-purple-400'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.city) return;

    try {
      await submitInitiative({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        category: formData.category,
        message: formData.message
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          category: 'Community Workspace Cleanup',
          message: ''
        });
      }, 5000);
    } catch (err) {
      console.error("Initiative submission error: ", err);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-32 px-6 relative overflow-hidden">
      
      {/* Decorative macro foliage & biological vein background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1920&q=80"
          alt="Macro green leaf vein bio sustainability backdrop"
          className="w-full h-full object-cover opacity-[0.06] filter saturate-50 contrast-[1.12]"
          style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.12)) scale(1.15)', transformOrigin: 'center center' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        
        {/* HERO HEADER */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-widest"
          >
            <Rocket className="w-3.5 h-3.5 animate-pulse" />
            <span>Launch Guide Accelerator</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-heading tracking-tighter leading-[1.08]"
          >
            Start Your Recycling Initiative
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400"
          >
            Everything you need to launch, organize, and monitor a successful localized waste collection program. Empower your crew with industrial-grade efficiency.
          </motion.p>
        </div>

        {/* ACCELERATOR ROADMAP STEPS (Connected Layout) */}
        <div className="space-y-12 max-w-5xl mx-auto relative">
          
          {/* Timeline background linkage line */}
          <div className="absolute left-[34px] md:left-[44px] top-4 bottom-4 w-0.5 bg-slate-800 z-0 hidden sm:block"></div>

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                id={`toolkit_step_${item.step}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                whileHover={{ x: 5 }}
                className="flex items-start space-x-6 md:space-x-8 bg-slate-900/30 hover:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 hover:border-sky-500/20 backdrop-blur-md transition-all duration-300 relative z-10"
              >
                {/* Visual Index bubble */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-[52px] h-[52px] md:w-[68px] md:h-[68px] rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-green-400 relative">
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                    <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 border border-white/10 text-slate-400">
                      {item.step}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 flex-grow">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl md:text-2xl font-bold font-heading text-white">{item.title}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-2 py-0.5 bg-white/5 rounded-full">
                      Step {item.step}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}

        </div>

        {/* REGISTRATION FORM SECTION (SIMULATED EMBEDDED GOOGLE FORM) */}
        <section id="initiative_registration_form" className="pt-12 scroll-mt-24 max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-extrabold font-heading">Register Your Initiative</h2>
            <p className="text-slate-400 text-sm">
              Ready to deploy collection points? Formally log your initiative profile to request free weatherproof sorting bins, educational assets, and to list your target on the dashboard.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-container rounded-3xl p-8 md:p-12 border border-white/10 text-slate-900 relative shadow-2xl"
          >
            {/* Form Title Banner imitating a premium Google Form visual template */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-sky-400 to-blue-600 rounded-t-3xl" />
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-sky-600">Secure Initiative Registration</span>
                    <h3 className="text-2xl font-black font-heading mt-1">Sustained Hub Intake Form</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Initiative Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Green Campus Stanford"
                        className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none transition-all text-sm font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Coordinating Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="leader@campusorg.edu"
                        className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none transition-all text-sm font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">City & Regional Hub *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Palo Alto, CA"
                        className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none transition-all text-sm font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Primary Program Focus</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-100 focus:bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none transition-all text-sm font-medium cursor-pointer"
                      >
                        <option>Community Workspace Cleanup</option>
                        <option>Academic Campus Sorting Bins</option>
                        <option>Coastal & Ocean Waste Intercept</option>
                        <option>Neighborhood Organic Composting</option>
                        <option>Consumer Electronics Recycling</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Short Deployment Description</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your planned pickup frequencies, team size, and container requirements..."
                      className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none transition-all text-sm font-medium resize-none"
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="submit"
                      id="submit_initiative_btn"
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-xl shadow-sky-500/15 hover:shadow-sky-500/30 transition-all cursor-pointer text-sm flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Register Initiative</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => alert(`Google Form Preview: Active field testing. Complete registration to preview logs in the administrator console.`)}
                      className="w-full sm:w-auto px-6 py-4 bg-slate-200 hover:bg-slate-300 transition-colors text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider"
                    >
                      Preview Form Layout
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-green-500/10 text-green-600 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black font-heading text-slate-950">Initiative Successfully Registered!</h3>
                    <p className="text-slate-500 max-w-md mx-auto text-sm">
                      We have launched your coordinator credentials and updated the telemetry dashboard. Your welcome package and sorting graphics are already winging their way to your inbox!
                    </p>
                  </div>
                  <div className="pt-4 p-4 rounded-xl bg-sky-500/5 text-sky-700 text-xs font-medium max-w-sm mx-auto">
                    Note: Registered profiles are securely cached and fully visible instantly inside the Admin Console.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </section>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
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
  ChevronRight
} from 'lucide-react';

const volunteerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please introduce a valid email address structure.' }),
  phone: z.string().min(7, { message: 'Phone coordinates require a valid numeric pattern.' }),
  city: z.string().min(2, { message: 'Please declare your city of residence.' }),
  skills: z.string().optional(),
  availability: z.string().min(1, { message: 'Please select your availability.' }),
  message: z.string().optional()
});

export default function Volunteer() {
  const { submitVolunteer, isLoading } = useDashboard();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    skills: '',
    availability: 'Part-time (Weekends)',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [justSubmittedName, setJustSubmittedName] = useState('');

  const benefits = [
    { title: 'Community Impact', desc: 'Directly clean regional green parks, prevent coastal waste pollution, and see the immediate physical improvements of your effort.', icon: Heart, clr: 'text-rose-400' },
    { title: 'Leadership Roles', desc: 'Step up to coordinates local collection drives, manage logistics, and spearhead eco campaigns as a formal regional leader.', icon: Award, clr: 'text-amber-400' },
    { title: 'Certified Hours', desc: 'Receive validated certificate logbooks of community service hours to boost your academic record, resume, or corporate profile.', icon: BadgeCheck, clr: 'text-green-400' },
    { title: 'Global Networking', desc: 'Form lifelong connections with green founders, regional municipal stakeholders, and passionate neighborhood sustainability clean-makers.', icon: Users, clr: 'text-sky-400' },
    { title: 'Active Learning', desc: 'Participate in monthly structural webinars and workshops about clean logistics, plastic-chemical processing structures, and policy.', icon: BookOpen, clr: 'text-emerald-400' }
  ];

  const opportunities = [
    { title: 'Waste Collection Drives', date: 'Multiple local operations weekly', desc: 'Join hands to clear neighborhood zones, parks, and rivers while sorting recyclables at specialized depots.' },
    { title: 'School Awareness Programs', date: 'Monthly school partnerships', desc: 'Conduct educational workshops with interactive models to foster eco-literacy and recycling behaviors.' },
    { title: 'Environmental Campaigns', date: 'Seasonal community action projects', desc: 'Host neighborhood workshops, community panels, and tree planting sessions paired with sorting system launches.' },
    { title: 'Community Green Events', date: 'Quarterly summits & field gatherings', desc: 'Help coordinate bulk-recycling days where families deposit discarded glass, electronics, and heavy items.' },
    { title: 'Digital Eco-Advocacy', date: 'Remote collaboration anytime', desc: 'Write blogs, design infographics, program social media updates, and inspire citizen actions around the globe.' }
  ];

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
        message: formData.message
      });

      setJustSubmittedName(formData.name);
      setShowPopup(true);

      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        skills: '',
        availability: 'Part-time (Weekends)',
        message: ''
      });
      setFormErrors({});
    } catch (err) {
      console.error("Volunteer application error: ", err);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-32 px-6 relative overflow-hidden">
      
      {/* Decorative community gardening & environmental teamwork backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1559027615-cd99e5cc0ac4?auto=format&fit=crop&w=1920&q=80"
          alt="Community gardening and environment volunteers"
          className="w-full h-full object-cover opacity-[0.06] filter saturate-50 contrast-[1.08] brightness-[0.9]"
          style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.12)) scale(1.15)', transformOrigin: 'center center' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-widest"
          >
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Join Our Global Team</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-heading tracking-tighter leading-[1.08]"
          >
            Become A Change Maker
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans"
          >
            Join a multi-regional community of passionate change-makers creating measurable environmental difference through action drives.
          </motion.p>
        </div>

        {/* BENEFITS SECTION (Styled Bento Grid Layout) */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] tracking-widest uppercase font-extrabold text-green-500">Volunteering Perks</span>
            <h2 className="text-2xl md:text-3xl font-bold font-heading">What we provide to our team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, id) => (
                <div key={id} className="p-8 rounded-3xl bg-slate-900/35 border border-white/5 animate-pulse space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800" />
                  <div className="h-6 bg-slate-800 rounded w-2/3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-800/80 rounded w-full" />
                    <div className="h-4 bg-slate-850 rounded w-5/6" />
                  </div>
                </div>
              ))
            ) : (
              benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    id={`benefit_card_${idx}`}
                    whileHover={{ y: -8, scale: 1.01 }}
                    className="p-8 rounded-3xl bg-slate-900/35 border border-white/5 hover:border-green-500/20 backdrop-blur-md transition-all duration-300 space-y-4 shadow-md hover:bg-slate-900/50"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${benefit.clr}`} />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-white">{benefit.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* TIMELINE OPPORTUNITIES SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] tracking-widest uppercase font-bold text-sky-400">Available Paths</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading leading-tight">
              Avenues of Collaboration
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We coordinate highly organized, safety-compliant community avenues that let people from any demographic background participate constructively. Choose the avenue that aligns perfectly with your schedule and technical talent.
            </p>
            
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-green-400 block mb-2">Requirement Checklist</span>
              <ul className="text-xs text-slate-300 space-y-2 font-medium">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span>Minimum 2 volunteer hours commitment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span>Passionate about structural environment improvements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span>Responsive and constructive team participant</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, id) => (
                <div key={id} className="p-6 rounded-2xl bg-slate-900/20 border border-white/5 animate-pulse flex justify-between items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-800 rounded w-1/4" />
                    <div className="h-5 bg-slate-850 rounded w-1/2" />
                    <div className="h-4 bg-slate-900 rounded w-3/4" />
                  </div>
                  <div className="w-5 h-5 bg-slate-800 rounded-full" />
                </div>
              ))
            ) : (
              opportunities.map((opp, idx) => (
                <motion.div
                  key={idx}
                  id={`opportunity_timeline_card_${idx}`}
                  whileHover={{ x: 8 }}
                  className="p-6 rounded-2xl bg-slate-900/20 hover:bg-slate-900/50 border border-white/5 hover:border-slate-800 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center space-x-1">
                      <Calendar className="w-3 h-3 block" />
                      <span>{opp.date}</span>
                    </span>
                    <p className="text-base font-bold font-heading text-white">{opp.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{opp.desc}</p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-slate-600 self-end md:self-center" />
                </motion.div>
              ))
            )}
          </div>

        </div>

        {/* INTAKE FORM (Glass Container Dark Layout) */}
        <section id="volunteer_form_section" className="scroll-mt-24 max-w-3xl mx-auto pt-12">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-extrabold font-heading">Register As Change Maker</h2>
            <p className="text-slate-400 text-sm">
              Ready to co-create real difference? Complete this quick application form, and our core communications lead will reach out to calendar your orientation drive path.
            </p>
          </div>

          <motion.div
            id="volunteer_glass_form_container"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-container-dark rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-t-3xl" />

            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Johnathan Doe"
                    className={`w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border ${formErrors.name ? 'border-red-500/70 focus:border-red-400' : 'border-white/10 focus:border-green-400'} focus:outline-none transition-all text-sm font-medium`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-400 font-semibold mt-1 flex items-center gap-1">
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
                    className={`w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border ${formErrors.email ? 'border-red-500/70 focus:border-red-400' : 'border-white/10 focus:border-green-400'} focus:outline-none transition-all text-sm font-medium`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-400 font-semibold mt-1 flex items-center gap-1">
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
                    className={`w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border ${formErrors.phone ? 'border-red-500/70 focus:border-red-400' : 'border-white/10 focus:border-green-400'} focus:outline-none transition-all text-sm font-medium`}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-400 font-semibold mt-1 flex items-center gap-1">
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
                    placeholder="e.g. Boston, MA"
                    className={`w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border ${formErrors.city ? 'border-red-500/70 focus:border-red-400' : 'border-white/10 focus:border-green-400'} focus:outline-none transition-all text-sm font-medium`}
                  />
                  {formErrors.city && (
                    <p className="text-xs text-red-400 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400"></span>
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Core Skills / Interests</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. Public advocacy, heavy loading, social blogging..."
                    className="w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Volunteer Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none transition-all text-sm font-medium cursor-pointer"
                  >
                    <option>Part-time (Weekends)</option>
                    <option>Weekly (Evenings)</option>
                    <option>Full-time logistics advocate</option>
                    <option>Remote/Digital advocacy only</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Tell us why you want to join</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Express yourself, describe any logistics experience or environmental drive background..."
                    className="w-full bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none transition-all text-sm font-medium resize-none"
                  />
                </div>

              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  id="submit_volunteer_btn"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-xl shadow-green-500/20 hover:shadow-green-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 animate-pulse" />
                  <span>Register As Change Maker</span>
                </button>
              </div>
            </form>
          </motion.div>
        </section>

      </div>

      {/* SUCCESS MODAL POPUP */}
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
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="w-16 h-16 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/10">
                <Heart className="w-8 h-8 fill-green-400/20" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black font-heading text-white">Application Received!</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Thank you, <span className="text-green-400 font-bold">{justSubmittedName}</span>. Your application has been logged to the telemetry stack. You are officially registered as a RenewA Change Maker!
                </p>
                <p className="text-xs text-slate-500">
                  A verification confirmation and step guide pdf has been dispatched to your email coordinates. Our regional organizer will contact you soon.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="dismiss_popup_btn"
                  onClick={() => setShowPopup(false)}
                  className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Return to Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

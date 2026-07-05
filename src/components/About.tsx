import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  Leaf,
  Users,
  Target,
  ShieldCheck,
  Award,
  ArrowRight,
  Globe,
  Sparkles,
  Heart
} from 'lucide-react';

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

export default function About() {
  const { setActivePage } = useApp();

  const leadership = [
    {
      name: "Kiran Reddy",
      role: "Founder & Chief Sustainability Officer",
      bio: "An environmental engineer and visionary, Kiran founded ReneweA to bring complete traceability to waste ecosystems across India. He drives the strategic alliances and circular loops.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      name: "Dr. Ananya Sen",
      role: "Head of Materials & Circular Science",
      bio: "With a PhD in polymer chemistry from IIT Bombay, Ananya supervises our recycling sorting methodologies and material quality validations.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      name: "Aditya Sharma",
      role: "Director of Regional Logistics & Operations",
      bio: "Aditya coordinates field operations and community hubs across state borders, optimizing transport routes and municipal partnerships.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80"
    }
  ];

  const corePillars = [
    {
      title: "Unyielding Traceability",
      desc: "Every gram of plastic, metal, or paper captured is tracked through certified blockchain or cloud telemetry checkpoints, closing the loop completely.",
      icon: ShieldCheck,
      color: "text-green-400",
      bgGlow: "from-green-500/10 to-emerald-500/5"
    },
    {
      title: "Citizen Mobilization",
      desc: "We empower local volunteers and community advocates with regional toolkits, enabling grassroot leaders to run efficient, clean, and safe sorting stations.",
      icon: Users,
      color: "text-sky-400",
      bgGlow: "from-sky-500/10 to-indigo-500/5"
    },
    {
      title: "Circular Auditing",
      desc: "We work directly with industrial processors and manufacturing firms to replace virgin materials with verified, clean post-consumer feedstocks.",
      icon: Target,
      color: "text-emerald-400",
      bgGlow: "from-emerald-500/10 to-green-500/5"
    }
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen py-32 px-6 relative overflow-hidden" id="about_us_view">
      
      {/* Dynamic atmospheric background overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1920&q=80"
          alt="Lush canopy environmental preservation backdrop"
          className="w-full h-full object-cover opacity-[0.05] filter saturate-50 contrast-[1.08]"
          style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.1)) scale(1.15)', transformOrigin: 'center center' }}
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
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest"
          >
            <Leaf className="w-3.5 h-3.5 animate-pulse text-green-400" />
            <span>Advancing Circular Frontiers</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-heading tracking-tighter leading-[1.08] text-white"
          >
            Our Mission is to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-sky-450">
              Close the Loop
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-450 leading-relaxed font-sans"
          >
            ReneweA is India's premier environmental telemetry and waste recovery platform. We unite local volunteer networks, corporate stakeholders, and industrial material recyclers to build dynamic circular supply loops.
          </motion.p>
        </div>

        {/* STATS PRESET OUTCOME CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto"
        >
          <div className="space-y-4 max-w-lg text-left">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-green-400 uppercase tracking-widest">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>National Operations</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading">
              Serving Communities Across Indian Subcontinent
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              From our digital-twin coordination base in Hyderabad to regional collection hubs in Mumbai and Bangalore, we optimize garbage logistics so that no material leaks into our rivers, forests, or oceans.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto flex-shrink-0">
            <div className="p-5 bg-slate-950/65 rounded-2xl border border-white/5 text-center min-w-[140px]">
              <span className="text-3xl font-black text-green-400 block font-heading">7.4T+</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Waste Redirected</span>
            </div>
            <div className="p-5 bg-slate-950/65 rounded-2xl border border-white/5 text-center min-w-[140px]">
              <span className="text-3xl font-black text-sky-400 block font-heading">100%</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Verifiable Loop</span>
            </div>
          </div>
        </motion.div>

        {/* CORE PILLARS SECTION */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-450">Operating Framework</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-heading">Our Three Foundational Pillars</h2>
            <p className="text-slate-450 text-sm max-w-md mx-auto">
              How ReneweA structures material collection, sorting, and industry integration for continuous environmental improvement.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  id={`pillar_card_${idx}`}
                  variants={fadeInUpVariants}
                  whileHover={{ y: -8 }}
                  className="bg-slate-900/30 p-8 rounded-2xl border border-white/5 hover:border-emerald-500/20 backdrop-blur-sm flex flex-col items-start text-left space-y-4 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.bgGlow} border border-white/10 flex items-center justify-center ${pillar.color}`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white">{pillar.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-sans">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* TEAM LEADERSHIP SEGMENT */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-450">Indian Advisory Board</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-heading">The Pioneers Behind ReneweA</h2>
            <p className="text-slate-450 text-sm max-w-md mx-auto">
              An experienced, interdisciplinary team of logistics executives, material engineers, and climate advocates.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {leadership.map((member, idx) => (
              <motion.div
                key={idx}
                id={`member_card_${idx}`}
                variants={fadeInUpVariants}
                whileHover={{ y: -8 }}
                className="group relative bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-sky-500/20 text-left flex flex-col justify-between"
              >
                {/* Visual Avatar Block */}
                <div className="relative h-64 overflow-hidden z-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter saturate-75 contrast-105 group-hover:scale-105 group-hover:saturate-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Avatar bottom fade overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>

                <div className="p-6 space-y-3 relative z-10 bg-slate-900/80 backdrop-blur-sm flex-grow">
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-green-300 transition-colors">{member.name}</h3>
                    <span className="text-xs font-semibold text-emerald-400">{member.role}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CALL TO ACTION ACCELERATOR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-8 md:p-16 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border border-emerald-500/10 text-center space-y-6 overflow-hidden max-w-4xl mx-auto shadow-2xl"
        >
          {/* Subtle glowing accents */}
          <div className="absolute -top-1/2 left-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/2 right-1/4 w-80 h-80 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-lg mx-auto">
            <Heart className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading">
              Ready to Shape the Future of Circular Economy?
            </h3>
            <p className="text-slate-400 text-xs md:text-sm font-sans leading-relaxed">
              Become a verified local steward, log active collections, or implement templates to transform municipal waste patterns. Together, we can restore nature's harmony.
            </p>
          </div>

          <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="cta_join_volunteer_btn"
              onClick={() => setActivePage('volunteer')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/15 cursor-pointer flex items-center space-x-2"
            >
              <span>Join as Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="cta_explore_toolkit_btn"
              onClick={() => setActivePage('toolkit')}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 border border-white/10 rounded-xl text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Access Toolkits
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

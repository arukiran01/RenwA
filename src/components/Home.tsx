import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useDashboard } from '../context/DashboardContext';
import { motion, useAnimation, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import {
  Leaf,
  ChevronDown,
  Trash2,
  TreePine,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Truck,
  Layers,
  Cpu,
  RefreshCw,
  Sprout,
  ChevronLeft,
  ChevronRight,
  FileText,
  GlassWater,
  PackageOpen,
  Hammer,
  GraduationCap,
  Globe
} from 'lucide-react';

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
    label: "Soil Regeneration",
    caption: "Verified compostable organic soil enrichment derived from clean municipal bio-waste."
  },
  {
    url: "https://images.unsplash.com/photo-1595275312706-e81215a3b925?auto=format&fit=crop&w=800&q=80",
    label: "Glass & Recovery",
    caption: "Color-graded post-consumer glass prepared for low-emission smelting loops."
  },
  {
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    label: "Carbon Sink Protection",
    caption: "Preserving intact micro-climates by scaling certified recycled post-consumer fiber streams."
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    label: "Ocean Preservation",
    caption: "Proactive high-density plastic diversion intercepts waste upstream of sensitive marine channels."
  },
  {
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    label: "Bio-Circular Feedstocks",
    caption: "Accelerating soil nutrient loops using local plant-based cellular substrates."
  },
  {
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    label: "Regenerative Incubation",
    caption: "Incubating native high-yield saplings to jumpstart urban micro-afforestation programs."
  }
];

// Detailed animated helper for real-time numerical counters triggered on scroll
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const previousValueRef = useRef(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!isInView) return;

    const start = hasStartedRef.current ? previousValueRef.current : 0;
    const end = value;

    previousValueRef.current = value;
    hasStartedRef.current = true;

    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // cubic-bezier(0.16, 1, 0.3, 1) easeOutExpo style progression
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isInView]);

  return <span ref={ref}>{displayValue.toLocaleString()}</span>;
}

// Detailed animated helper for real-time percentages triggered on scroll
function AnimatedPercentage({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const previousValueRef = useRef(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!isInView) return;

    const start = hasStartedRef.current ? previousValueRef.current : 0;
    const end = value;

    previousValueRef.current = value;
    hasStartedRef.current = true;

    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // cubic-bezier(0.16, 1, 0.3, 1) easeOutExpo style progression
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isInView]);

  return <span ref={ref}>{displayValue.toFixed(1)}%</span>;
}

// Custom helper for parsing and animating formatted string values (e.g. schools, communities, events)
function StringAnimatedCounter({ value }: { value: string }) {
  // Extract only numbers for the counter
  const cleanNumStr = value.replace(/[^0-9]/g, '');
  const numericVal = parseInt(cleanNumStr) || 0;
  // Get non-numeric characters at the end (e.g. '+')
  const suffix = value.replace(/[0-9,.]/g, '');

  return (
    <>
      <AnimatedCounter value={numericVal} />
      {suffix}
    </>
  );
}

export default function Home() {
  const { setActivePage } = useApp();
  const { metrics, volunteers, initiatives } = useDashboard();
  const [trackerWidth, setTrackerWidth] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculates percentage safely
  const percentage = Math.min((metrics.currentKg / metrics.targetKg) * 100, 100);

  const dashboardRef = useRef<HTMLDivElement>(null);

  const stats = [
    { 
      value: `${metrics.schoolsCount}`, 
      label: 'Schools Collaborated', 
      icon: GraduationCap, 
      color: 'text-green-400',
      borderColor: 'hover:border-green-500/40',
      glowColor: 'via-green-500/10',
      bgImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      value: `${metrics.eventsCount}`, 
      label: 'Events Hosted', 
      icon: Calendar, 
      color: 'text-teal-400',
      borderColor: 'hover:border-teal-500/40',
      glowColor: 'via-teal-500/10',
      bgImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      value: `${Math.max(metrics.volunteersCount, volunteers.length)}`, 
      label: 'Active Volunteers', 
      icon: Users, 
      color: 'text-sky-400',
      borderColor: 'hover:border-sky-500/40',
      glowColor: 'via-sky-500/10',
      bgImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      value: `${metrics.communitiesCount}`, 
      label: 'Communities Collaborated', 
      icon: Globe, 
      color: 'text-emerald-400',
      borderColor: 'hover:border-emerald-500/40',
      glowColor: 'via-emerald-500/10',
      bgImage: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=600&q=80' 
    }
  ];

  const valueCards = [
    {
      title: 'Reduce Waste',
      description: 'Optimize diversion rates and scale local sorting networks to prevent plastics, heavy metals, and organic material from impacting oceans and landfill reservoirs.',
      icon: Trash2,
      accent: 'border-green-500/20 group-hover:border-green-500/60',
      bgGlow: 'group-hover:bg-green-500/10',
      bgImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=850&q=80'
    },
    {
      title: 'Protect Nature',
      description: 'Safeguard sensitive regional eco-systems, preserve ancient forests, and reduce biodiversity loss by replacing virgin manufacturing demands with certified recycled sources.',
      icon: TreePine,
      accent: 'border-emerald-500/20 group-hover:border-emerald-500/60',
      bgGlow: 'group-hover:bg-emerald-500/10',
      bgImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=850&q=80'
    },
    {
      title: 'Create Impact',
      description: 'Deploy actionable tools and educational curricula that enable citizen-pioneers, local businesses, and municipal bodies to spark permanent, measurable community transformations.',
      icon: Users,
      accent: 'border-sky-500/20 group-hover:border-sky-500/60',
      bgGlow: 'group-hover:bg-sky-500/10',
      bgImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=850&q=80'
    }
  ];

  // Milestone check
  const isMilestoneReached = (threshold: number) => {
    return metrics.currentKg >= threshold;
  };

  // Dynamically generate 10 milestones evenly spaced up to metrics.targetKg
  const milestones = React.useMemo(() => {
    const list = [];
    const numMilestones = 10;
    const step = metrics.targetKg / numMilestones;
    for (let i = 1; i <= numMilestones; i++) {
      const value = Math.round(step * i);
      list.push({
        kg: value,
        label: value >= 1000 ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k` : `${value}`
      });
    }
    return list;
  }, [metrics.targetKg]);

  const scrollDown = () => {
    document.getElementById('impact-dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-slate-950 text-white min-h-screen">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-green-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute top-[60%] left-[40%] w-[350px] h-[350px] rounded-full bg-sky-500/5 blur-[120px]" />
      </div>

      {/* HERO SECTION */}
      <section
        id="hero_section"
        className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden pt-[90px] border-b border-white/5"
      >
        {/* Beautiful high-end environmental & recyclable banner image backdrop for Hero */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80"
            alt="Young green plant sprout and eco recycling environment"
            className="w-full h-full object-cover opacity-[0.16] mix-blend-lighten filter saturate-[0.85] contrast-[1.12]"
            style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.16)) scale(1.15)', transformOrigin: 'center center' }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950 to-transparent" />
          <div className="absolute inset-0 bg-slate-950/20" />
        </div>

        {/* Floating eco elements styled via framer motion */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[18%] left-[15%] text-green-500/40"
          >
            <Leaf className="w-10 h-10" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 30, 0],
              rotate: [0, -15, 15, 0],
              scale: [1, 0.95, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-[20%] left-[12%] text-emerald-500/30"
          >
            <Sprout className="w-12 h-12" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -35, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute top-[25%] right-[14%] text-sky-400/30"
          >
            <Leaf className="w-8 h-8" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 25, 0],
              x: [0, 10, -10, 0],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-[25%] right-[18%] text-green-400/25"
          >
            <TreePine className="w-11 h-11" />
          </motion.div>
        </div>

        {/* Ambient background decoration - Apple style circle */}
        <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 rounded-full border border-emerald-500/10 blur-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-75 animate-pulse memory-safe"></div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center px-4 md:px-6">
          
          {/* Left Column: Descriptive Context and Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white text-emerald-950 border border-emerald-300 shadow-xl shadow-green-950/10"
            >
              
              <span className="text-xs font-bold tracking-wider uppercase">
                A Dedicated Circular Initiative
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-4"
            >
              <span className="text-xs font-black tracking-widest uppercase text-emerald-400 block tracking-widest leading-none">
                RENEWA / SUSTAINABILITY UNIT
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.08] text-white">
                Transforming waste into a <span className="text-green-400 font-serif italic tracking-wide font-medium">sustainable</span> future
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-slate-300 font-sans font-medium leading-relaxed max-w-xl"
            >
              We are empowering local communities through verified, responsible recycling loops, smart waste collection registries, and targeted environmental activities. Together, we close the loop.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <button
                id="hero_join_btn"
                onClick={() => setActivePage('volunteer')}
                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xl shadow-green-950/30 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2 text-sm"
              >
                <span>Take Part In Initiative</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero_learn_btn"
                onClick={scrollDown}
                className="px-6 py-4 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm font-medium flex items-center justify-center"
              >
                Explore Active Dashboard
              </button>
            </motion.div>
          </div>

          {/* Right Column: Premium Framed Card Image with Badging */}
          <div className="lg:col-span-5 flex justify-center items-center w-full relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="group relative w-full max-w-[490px] aspect-[4/3] rounded-[2rem] border-[4px] border-white/95 p-1 bg-slate-950/40 shadow-2xl shadow-black/80 overflow-visible"
            >
              {/* Floating "Active Quota" sticker on left top, showing the current dynamic status label */}
              <div className="absolute -top-7 -left-5 z-25 bg-white text-slate-900 px-5 py-4 rounded-2xl shadow-2xl border border-slate-100 max-w-[210px] space-y-1 text-left select-none pointer-events-none">
                <div className="flex items-center space-x-1.5 text-emerald-600 text-xs font-black tracking-wider uppercase">
                  <Sprout className="w-4 h-4 text-emerald-500 animate-bounce" />
                  <span>Eco Registry</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentImageIndex}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.25 }}
                    className="text-[11px] text-slate-600 font-medium leading-relaxed font-sans"
                  >
                    Monitoring active regional loops for {carouselImages[currentImageIndex].label}.
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Core Image Wrapper */}
              <div className="w-full h-full rounded-[1.75rem] overflow-hidden relative bg-slate-900">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={carouselImages[currentImageIndex].url}
                    alt={carouselImages[currentImageIndex].label}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full object-cover filter saturate-[1.12] contrast-[1.08] brightness-[0.85]"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {/* Visual shadow overlay inside card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent z-10 pointer-events-none" />

                {/* Left Arrow Controls (Hover In) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-slate-950/85 hover:bg-emerald-600 text-white rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Right Arrow Controls (Hover In) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-slate-950/85 hover:bg-emerald-600 text-white rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Interactive Pagination Dot Indicators */}
                <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md py-1 px-3 rounded-full border border-white/10">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        index === currentImageIndex 
                          ? 'bg-green-400 w-3 shadow-[0_0_8px_rgba(74,222,128,0.5)]' 
                          : 'bg-white/40 hover:bg-white/75'
                      }`}
                      title={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Caption at the bottom */}
                <div className="absolute bottom-4 inset-x-4 bg-slate-950/85 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 z-20 text-left pointer-events-none select-none min-h-[58px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentImageIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="text-[11px] text-slate-300 font-sans leading-relaxed"
                    >
                      <span className="text-white font-bold">{carouselImages[currentImageIndex].label}:</span> {carouselImages[currentImageIndex].caption}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Centered Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-400 flex flex-col items-center space-y-1 text-xs cursor-pointer" onClick={scrollDown}>
          <span className="tracking-widest uppercase font-semibold text-[10px]">Impact Tracker</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-green-400" />
          </motion.div>
        </div>
      </section>

      {/* LIVE COLLECTION DASHBOARD */}
      <section
        id="impact-dashboard"
        className="py-24 px-6 max-w-7xl mx-auto relative z-10"
      >
        <div className="text-center space-y-3 mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-green-400">Live Telemetry Metrics</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
            Environmental Impact Dashboard
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Watch our active recovery process update in real-time as regional hubs recycle plastic, metals, glass and paper daily.
          </p>
        </div>

        {/* Dashboard Box (Glassmorphism Container) */}
        <motion.div
          id="dashboard_data_box"
          ref={dashboardRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-container-dark rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden backdrop-blur-3xl shadow-2xl"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#F8FAFC_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          {/* Top Row: Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center md:text-left relative z-10">
            <div id="stat_current_kg" className="bg-slate-900/40 p-6 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase block mb-1">Current Collection</span>
              <div className="flex items-baseline justify-center md:justify-start space-x-2">
                <span className="text-4xl md:text-5xl font-black font-heading text-green-400">
                  <AnimatedCounter value={metrics.currentKg} />
                </span>
                <span className="text-lg font-bold text-slate-500">KG</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-2 flex items-center justify-center md:justify-start space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                <span>Redirected from municipal landfill</span>
              </p>
            </div>

            <div id="stat_progress_pct" className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase block mb-1">Target Progress</span>
                <span className="text-4xl md:text-5xl font-black font-heading text-sky-400 block">
                  <AnimatedPercentage value={percentage} />
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 mt-4 overflow-hidden border border-white/5 relative">
                <motion.div
                  key={`top-bar-${percentage}`}
                  className="bg-gradient-to-r from-sky-500 to-indigo-400 h-full rounded-full relative overflow-hidden"
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Flowing energy particle traversing the progress bar */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                    initial={{ left: "-6rem" }}
                    animate={{ left: "100%" }}
                    transition={{
                      duration: 2.0,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  {/* Glowing dynamic tip indicator */}
                  <motion.div 
                    className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px] rounded-full"
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>

            <div id="stat_target_kg" className="bg-slate-900/40 p-6 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase block mb-1">Current Initiative Target</span>
              <div className="flex items-baseline justify-center md:justify-start space-x-2">
                <span className="text-4xl md:text-5xl font-black font-heading text-white">
                  <AnimatedCounter value={metrics.targetKg} />
                </span>
                <span className="text-lg font-bold text-slate-500">KG</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Phase 1 regional quota collection goal
              </p>
            </div>
          </div>

          {/* MAIN ELEMENT: Animated Horizontal Waste Tracker */}
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider">
              <span>0 KG</span>
              <span className="text-green-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>TARGET MILESTONE CORRIDOR</span>
              </span>
              <span><AnimatedCounter value={metrics.targetKg} /> KG</span>
            </div>

            {/* Tracker Track & Milestone Bullets */}
            <div className="relative py-10">
              
              {/* Outer Slider Line Track background */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-900 rounded-full -translate-y-1/2 border border-white/5"></div>
              
              {/* Green filled active progress track */}
              <motion.div
                id="active_progress_track"
                key={`corridor-bar-${percentage}`}
                className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-emerald-400 rounded-full -translate-y-1/2 shadow-[0_0_15px_rgba(52,211,153,0.6)] overflow-hidden"
                initial={{ width: "0%" }}
                whileInView={{ width: `${percentage}%` }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Flowing energy particle traversing the milestone corridor bar */}
                <motion.div
                  className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                  initial={{ left: "-8rem" }}
                  animate={{ left: "100%" }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                {/* Visual glow element sliding right on top of the progressive tracker */}
                <motion.div 
                  className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[3px] rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </motion.div>

              {/* Milestone Pulse nodes along the track */}
              <div className="absolute inset-0 flex items-center justify-between pointer-events-none select-none">
                {milestones.map((milestone) => {
                  const reached = isMilestoneReached(milestone.kg);
                  return (
                    <div
                      key={milestone.kg}
                      className="relative flex flex-col items-center"
                      style={{
                        position: 'absolute',
                        left: `${(milestone.kg / metrics.targetKg) * 100}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {/* Milestone Bullet node with sophisticated glowing ring visual */}
                      <div className="relative">
                        {reached && (
                          <motion.div
                            className="absolute -inset-2 rounded-full bg-green-500/25 blur-sm"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}

                        <motion.div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all relative z-10 ${
                            reached
                              ? 'bg-green-500 border-green-300 shadow-[0_0_15px_rgba(34,197,94,0.7)] text-slate-950 scale-125'
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                          animate={reached ? { scale: [1.2, 1.35, 1.2] } : {}}
                          transition={reached ? { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" } : {}}
                        >
                          {reached ? (
                            <span className="text-[7.5px] font-black uppercase">ok</span>
                          ) : (
                            <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                          )}
                        </motion.div>
                      </div>

                      {/* Milestone Label */}
                      <span className={`text-[10px] font-semibold mt-3 relative z-10 transition-all ${reached ? 'text-green-400 font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'text-slate-500'}`}>
                        {milestone.label}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Feedback system overlay at success */}
            {percentage >= 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm text-center font-semibold"
              >
                🎉 Outstanding! The target quota of {metrics.targetKg.toLocaleString()} KG is fully completed and processed! Let's scale our volunteer logistics drives.
              </motion.div>
            )}
          </div>



        </motion.div>
      </section>

      {/* SECTION 1: Why RenewA (Three Premium Cards) */}
      <section id="why_renewa_section" className="py-24 bg-slate-950/20 border-t border-b border-white/5 relative overflow-hidden">
        {/* Subtle decorative environmental background backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=80"
            alt="Nature panorama pattern background"
            className="w-full h-full object-cover opacity-[0.06] filter saturate-[0.5]"
            style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.08)) scale(1.15)', transformOrigin: 'center center' }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 mb-20">
            <span className="text-xs font-bold tracking-widest uppercase text-green-500">Pillar Philosophy</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
              Why RenewA exists
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
              The modern circular economy requires professional organization, reliable checkpoints, and high stakeholder alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueCards.map((card, idx) => (
              <motion.div
                key={idx}
                id={`value_card_${idx}`}
                whileHover={{ y: -10 }}
                className={`group p-8 rounded-2xl bg-slate-950/80 border ${card.accent} backdrop-blur-md transition-all duration-300 flex flex-col justify-between h-[300px] relative overflow-hidden`}
              >
                {/* Embedded environmental design background */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
                  <img
                    src={card.bgImage}
                    alt={card.title}
                    className="w-full h-full object-cover opacity-10 saturate-[0.7] brightness-[0.6] group-hover:opacity-25 group-hover:scale-105 transition-all duration-700 pointer-events-none select-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Absolute core vignette overlay block for readability constraint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent" />
                </div>

                <div className={`absolute -inset-px rounded-2xl ${card.bgGlow} transition-colors duration-300 pointer-events-none z-10`}></div>
                
                <div className="space-y-4 relative z-20">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-green-400 group-hover:text-green-300 group-hover:scale-105 group-hover:border-white/10 transition-all duration-300">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white tracking-tight">{card.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors duration-300">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

       {/* SECTION 2: Impact Numbers (Animated counters view) */}
       <section id="metrics_highlight" className="py-24 bg-slate-950 relative">
         <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
             {stats.map((stat, idx) => (
               <motion.div
                 key={idx}
                 id={`stat_card_row_${idx}`}
                 whileHover={{ y: -10, scale: 1.05 }}
                 whileTap={{ scale: 0.98 }}
                 transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                 className={`group relative p-6 md:p-8 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 ${stat.borderColor} text-center space-y-4 overflow-hidden shadow-2xl transition-all duration-300 cursor-default animate-fade-in`}
               >
                 {/* Beautiful high-end environmental background image with extreme vignette */}
                 <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
                   <img
                     src={stat.bgImage}
                     alt={stat.label}
                     className="w-full h-full object-cover opacity-20 saturate-[0.95] brightness-[0.45] group-hover:opacity-35 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none"
                     referrerPolicy="no-referrer"
                   />
                   {/* Premium dark gradient overlay for deep contrast & pristine readability */}
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
                 </div>

                 {/* Glow backdrop matching the theme */}
                 <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r from-transparent ${stat.glowColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10`} />

                 {/* Subtle top horizontal green/emerald glow accent */}
                 <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 group-hover:via-emerald-500/50 to-transparent transition-all duration-500 z-10" />

                 {/* Animated status glow/ring inside card on hover */}
                 <div className="relative z-10 w-12 h-12 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 group-hover:bg-white/10 mx-auto flex items-center justify-center transition-all duration-300">
                   <stat.icon className={`w-5.5 h-5.5 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                 </div>

                 <div className="relative z-10 space-y-1">
                   <h3 className="text-3xl md:text-4xl font-black font-heading text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                     <StringAnimatedCounter value={stat.value} />
                   </h3>
                   <p className="text-[9px] md:text-[10px] lg:text-xs font-black text-slate-400 group-hover:text-amber-300 uppercase tracking-widest leading-relaxed transition-colors duration-300">
                     {stat.label}
                   </p>
                 </div>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

      {/* SECTION 3: Recycling Journey (Beautiful timeline map) */}
      <section id="journey_section" className="py-24 bg-slate-950/20 border-t border-white/5 relative overflow-hidden">
        {/* Environmental stream and nature background backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1920&q=80"
            alt="Pristine dynamic river stream water preservation nature backdrop"
            className="w-full h-full object-cover opacity-[0.05] filter saturate-[0.6] contrast-[1.05]"
            style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.1)) scale(1.15)', transformOrigin: 'center center' }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 mb-20">
            <span className="text-xs font-bold tracking-widest uppercase text-sky-400">Step-By-Step Cycle</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
              Our Certified Recycling Journey
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
              Explore how materials we collect undergo state-of-the-art sorting and reprocessing to enter production loops again.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
            
            {/* Horizontal timeline connector lines for desktop */}
            <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-slate-800 z-0 pointer-events-none"></div>

            {[
              { title: 'Collection', desc: 'Waste is collected via partner hubs and volunteer depots.', icon: Truck, clr: 'text-green-400' },
              { title: 'Sorting', desc: 'Separated perfectly by physical material properties.', icon: Layers, clr: 'text-sky-400' },
              { title: 'Processing', desc: 'Cleaned, shredded, and melted down to raw pellets.', icon: Cpu, clr: 'text-emerald-400' },
              { title: 'Recycling', desc: 'Pellets are extruded into secondary industrial material.', icon: RefreshCw, clr: 'text-green-500' },
              { title: 'Reuse', desc: 'Pristine raw materials deployed to make brand new green goods.', icon: Sprout, clr: 'text-emerald-500' }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                id={`timeline_node_${idx}`}
                whileHover={{ scale: 1.05 }}
                className="relative z-10 bg-slate-950/85 p-6 rounded-2xl border border-white/5 text-center flex flex-col items-center space-y-4 shadow-xl"
              >
                {/* Node circle */}
                <div className="w-[52px] h-[52px] rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center transition-all duration-300 group-hover:border-green-500">
                  <step.icon className={`w-5 h-5 ${step.clr}`} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-green-500 tracking-widest uppercase block">PHASE 0{idx + 1}</span>
                  <p className="text-lg font-bold font-heading text-white">{step.title}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PackageOpen,
  FileText,
  Hammer,
  GlassWater,
  Cpu,
  Apple,
  RotateCw,
  FolderMinus,
  Sparkles,
  RefreshCw,
  Trash2
} from 'lucide-react';

export default function Methods() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const categories = [
    {
      id: 'plastic',
      title: 'Plastic Recycling',
      items: ['Polystyrene Bottles', 'PET Containers', 'Rigid Packaging'],
      desc: 'Polyethylene and PET containers are shredded, thoroughly washed, and thermal-treated into industrial pellets to manufacture new food-safe containers and textiles.',
      icon: PackageOpen,
      clr: 'from-green-400 to-emerald-500',
      badgeClr: 'bg-green-500/10 text-green-400 border-green-500/20',
      videoUrl: 'https://vcdn.pexels.com/video-files/8089013/8089013-sd_360_640_25fps.mp4',
      hoverAnim: {
        hover: { y: -8, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.15)' },
        icon: { rotate: 360, transition: { duration: 0.8, ease: 'easeInOut' } }
      }
    },
    {
      id: 'paper',
      title: 'Paper & Cardboard',
      items: ['Local Newspapers', 'Corrugated Cardboard', 'Periodicals & Books'],
      desc: 'Cellulose fibers are soaked and processed into a wet slurry, breaking down adhesives. The recycled fibers are pressed, dried, and formatted back into raw stock.',
      icon: FileText,
      clr: 'from-amber-400 to-orange-500',
      badgeClr: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      videoUrl: 'https://vcdn.pexels.com/video-files/8323675/8323675-sd_360_640_24fps.mp4',
      hoverAnim: {
        hover: { y: -8, boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)' },
        icon: { y: [0, -12, 4, 0], transition: { duration: 0.6, ease: 'easeOut' } } // paper flutter effect
      }
    },
    {
      id: 'metal',
      title: 'Metal Recycling',
      items: ['Aluminum Beverage Cans', 'Structural Steel Scrap', 'Tin Containers'],
      desc: 'Metals are electromagnetically separated, sorted by alloy composition, melted in high-temperature furnaces, and cast into raw industrial metal sheets.',
      icon: Hammer,
      clr: 'from-sky-400 to-blue-500',
      badgeClr: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      videoUrl: 'https://vcdn.pexels.com/video-files/3255124/3255124-sd_360_600_25fps.mp4',
      hoverAnim: {
        hover: { y: -8, boxShadow: '0 20px 40px rgba(14, 165, 233, 0.15)' },
        shine: { x: ['-100%', '100%'], transition: { duration: 1, ease: 'easeInOut' } } // shine effect
      }
    },
    {
      id: 'glass',
      title: 'Glass Bottles & Jars',
      items: ['Soda & Beverage Bottles', 'Cosmetic Jars', 'Standard Glass Vials'],
      desc: 'Glass is visually sorted by color family, crushed into fine cullet granules, stripped of impurities, blended, and melted back into high-fidelity custom glassware.',
      icon: GlassWater,
      clr: 'from-emerald-400 to-green-600',
      badgeClr: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      videoUrl: 'https://vcdn.pexels.com/video-files/8091176/8091176-sd_360_640_25fps.mp4',
      hoverAnim: {
        hover: { y: -8, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)' },
        reflection: { opacity: [0.1, 0.4, 0.1], scale: [0.95, 1.05, 0.95], transition: { duration: 1.5, repeat: Infinity } }
      }
    },
    {
      id: 'ewaste',
      title: 'E-Waste Electronics',
      items: ['Mobile Smartphones', 'Desktop Motherboards', 'Lithium Ion Batteries'],
      desc: 'Deconstructed under precise surgical safety protocols. Precious metals like copper, gold, and platinum are chemically extracted and returned to electronic supply lines.',
      icon: Cpu,
      clr: 'from-purple-400 to-indigo-500',
      badgeClr: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      videoUrl: 'https://vcdn.pexels.com/video-files/8085131/8085131-sd_360_640_25fps.mp4',
      hoverAnim: {
        hover: { y: -8, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)' },
        pulse: { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8], transition: { duration: 1, repeat: Infinity } }
      }
    },
    {
      id: 'organic',
      title: 'Organic Food Waste',
      items: ['Compostable Food Scraps', 'Garden Leaf Waste', 'Biodegradable Paper'],
      desc: 'Raw kitchen and garden scraps are routed into aerobic digesters. Micro-biological activity yields high-nitrogen natural compost fertilizers for regional green farms.',
      icon: Apple,
      clr: 'from-emerald-500 to-teal-600',
      badgeClr: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      videoUrl: 'https://vcdn.pexels.com/video-files/4236128/4236128-sd_360_640_30fps.mp4',
      hoverAnim: {
        hover: { y: -8, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)' },
        growth: { scale: [1, 1.25, 1.2], transition: { duration: 0.5, ease: 'easeOut' } }
      }
    }
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen py-32 px-6 relative overflow-hidden">
      
      {/* Decorative environment & recycling engineering backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&w=1920&q=80"
          alt="Recyclable materials sorting backdrop"
          className="w-full h-full object-cover opacity-[0.06] filter saturate-50 contrast-[1.1]"
          style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.12)) scale(1.15)', transformOrigin: 'center center' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* HERO HEADER SECTION */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold uppercase tracking-widest"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Educational Catalog</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-heading tracking-tighter leading-[1.1]"
          >
            Methods of Recycling
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed font-sans"
          >
            Learn the exact engineering processes and separation systems utilized to sort, digest, and recycle materials in our sustainable network.
          </motion.p>
        </div>

        {/* CLASSIFIED CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                id={`recycling_method_${cat.id}`}
                variants={{
                  rest: { y: 0 },
                  hover: cat.hoverAnim.hover
                }}
                initial="rest"
                whileHover="hover"
                onMouseEnter={() => setHoveredCard(cat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative bg-slate-900/40 rounded-3xl p-8 border border-white/5 backdrop-blur-md overflow-hidden flex flex-col justify-between min-h-[460px] shadow-lg transition-colors hover:border-white/10"
              >
                
                {/* Visual metal shine animation layer */}
                {cat.id === 'metal' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 z-0 pointer-events-none"
                    variants={{
                      rest: { x: '-150%' },
                      hover: cat.hoverAnim.shine
                    }}
                  />
                )}

                {/* Glass reflection vector layer */}
                {cat.id === 'glass' && (
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none z-0"
                    variants={{
                      rest: { opacity: 0 },
                      hover: cat.hoverAnim.reflection
                    }}
                  />
                )}

                <div className="space-y-6 relative z-10">
                  {/* Categorized icon container with specialized hover hooks */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.clr} p-0.5 shadow-md flex items-center justify-center relative overflow-hidden`}>
                      <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center relative overflow-hidden">
                        
                        {/* Static Icon */}
                        <motion.div
                          animate={{
                            opacity: hoveredCard === cat.id ? 0 : 1,
                            scale: hoveredCard === cat.id ? 0.7 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-center"
                        >
                          <motion.div
                            variants={{
                              rest: { rotate: 0, scale: 1, y: 0 },
                              hover: cat.id === 'plastic' ? cat.hoverAnim.icon :
                                     cat.id === 'paper' ? cat.hoverAnim.icon :
                                     cat.id === 'organic' ? cat.hoverAnim.growth :
                                     cat.id === 'ewaste' ? cat.hoverAnim.pulse : {}
                            }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </motion.div>
                        </motion.div>

                        {/* Muted Auto-playing micro-video loop aspect */}
                        {hoveredCard === cat.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 1.15 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 w-full h-full z-20"
                          >
                            <video
                              src={cat.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </motion.div>
                        )}

                      </div>
                    </div>

                    <span className="text-slate-500 font-mono text-xs font-bold uppercase tracking-widest">
                      [Class 0{idx + 1}]
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold font-heading text-white">{cat.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{cat.desc}</p>
                  </div>
                </div>

                {/* Categorized sub-items/manifest badges at physical card bottoms */}
                <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
                  <span className="text-xs font-bold text-slate-500 tracking-widest uppercase block">Acceptable Materials</span>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item, idy) => (
                      <span
                        key={idy}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium border ${cat.badgeClr}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* COLLABORATIVE BANNER AT BOTTOM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-container-dark rounded-3xl p-8 md:p-12 border border-white/5 text-center space-y-6 max-w-4xl mx-auto"
        >
          <Sparkles className="w-8 h-8 text-green-400 mx-auto animate-pulse" />
          <h3 className="text-2xl font-bold font-heading">Don't know where to send custom materials?</h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            Our educational team can audit your business, campus, or community facility and configure specialized pathways for compound materials, battery groups, and hazardous chemical disposal.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('renewa_header');
                el?.scrollIntoView({ behavior: 'smooth' });
                // Switch to toolkit tab
                setTimeout(() => {
                  const items = document.querySelectorAll('[id^="nav_btn_"]');
                  items.forEach((item) => {
                    if (item.id === 'nav_btn_toolkit') {
                      (item as HTMLButtonElement).click();
                    }
                  });
                }, 100);
              }}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors cursor-pointer text-sm font-semibold"
            >
              Access Business Toolkit
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

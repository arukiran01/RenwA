import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Leaf, Menu, X, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const { activePage, setActivePage, isAuthenticated, logoutAdmin } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // High-performance smooth page scroll tracker
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'methods', label: 'Methods of Recycling' },
    { id: 'toolkit', label: 'Toolkit' },
    { id: 'volunteer', label: 'Volunteer Recruitment' }
  ] as const;

  const navigateTo = (page: typeof activePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="renewea_header"
      className={`fixed top-0 left-0 right-0 z-50 h-[90px] transition-all duration-300 flex items-center ${
        scrolled
          ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/5 shadow-lg'
          : 'bg-transparent border-b border-white/0'
      }`}
    >
      {/* Sleek, ultra-thin scroll progress indicator at the absolute top of the header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Section */}
        <div
          id="renewea_logo_group"
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => navigateTo('home')}
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-700 p-0.5 shadow-inner transition-transform duration-500 group-hover:rotate-[360deg]">
            <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute -inset-0.5 rounded-xl bg-green-500/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white font-heading">
            Renewe<span className="text-green-500 transition-colors duration-300 group-hover:text-green-400">A</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop_nav" className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav_btn_${item.id}`}
                onClick={() => navigateTo(item.id)}
                className={`relative text-sm font-medium transition-colors py-2 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* CTA & Admin Shortcuts */}
        <div id="desktop_ctas" className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <button
                id="header_admin_btn"
                onClick={() => navigateTo('admin')}
                className={`flex items-center space-x-1.5 px-4 h-11 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                  activePage === 'admin'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent shadow shadow-green-500/20'
                    : 'bg-slate-900/50 hover:bg-slate-850 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Console</span>
              </button>
              <button
                id="header_logout_btn"
                onClick={logoutAdmin}
                className="p-2.5 bg-slate-900/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/20 rounded-lg transition-all cursor-pointer"
                title="Sign Out Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="header_login_link"
              onClick={() => navigateTo('login')}
              className="text-slate-400 hover:text-slate-300 text-xs uppercase tracking-widest font-semibold px-3 py-2 transition-all cursor-pointer"
            >
              Console
            </button>
          )}

          <button
            id="get_involved_cta"
            onClick={() => navigateTo('volunteer')}
            className="relative overflow-hidden px-6 h-11 bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-400 hover:to-emerald-500 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-green-500/15 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-1 cursor-pointer"
          >
            <span>Get Involved</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          {isAuthenticated && (
            <button
              id="mobile_header_admin_btn"
              onClick={() => navigateTo('admin')}
              className="p-2.5 bg-slate-900/50 border border-emerald-500/20 text-emerald-400 rounded-lg"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          )}
          <button
            id="mobile_menu_trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile_drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[90px] left-0 right-0 bg-slate-950 border-b border-white/5 shadow-2xl p-6 md:hidden flex flex-col space-y-4"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile_nav_btn_${item.id}`}
                onClick={() => navigateTo(item.id)}
                className={`w-full text-left py-3 px-4 rounded-xl text-base font-semibold transition-all ${
                  activePage === item.id
                    ? 'bg-green-500/10 text-green-400 pl-6 border-l-2 border-green-500'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              {isAuthenticated ? (
                <button
                  id="mobile_logout_nav_btn"
                  onClick={() => {
                    logoutAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-3 border border-red-500/20 text-red-400 hover:bg-red-500/5 rounded-xl font-semibold text-sm transition-colors"
                >
                  Sign Out Console
                </button>
              ) : (
                <button
                  id="mobile_login_nav_btn"
                  onClick={() => navigateTo('login')}
                  className="w-full text-center py-3 border border-white/10 text-slate-300 hover:bg-white/5 rounded-xl font-semibold text-sm transition-colors"
                >
                  Admin Access
                </button>
              )}

              <button
                id="mobile_involved_nav_cta"
                onClick={() => navigateTo('volunteer')}
                className="w-full text-center py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/10 hover:shadow-green-500/20 text-sm transition-all"
              >
                Get Involved
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

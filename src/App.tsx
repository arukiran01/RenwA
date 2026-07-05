/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DashboardProvider } from './context/DashboardContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Methods from './components/Methods';
import Toolkit from './components/Toolkit';
import Volunteer from './components/Volunteer';
import Login from './components/Login';
import Admin from './components/Admin';
import About from './components/About';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { activePage } = useApp();

  // Smooth scroll to top on page pivot transitions, setup scroll tracker, and update dynamic SEO metadata
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial sync

    // Dynamic SEO Title & Meta Tag update for maximum Google Search Console indexing precision
    const titleMap: Record<string, string> = {
      home: "ReneweA | Premium Environmental Sustainability & Recyclable Waste Tracker",
      about: "About Us & Our Mission | ReneweA Circularity Story",
      methods: "Certified Recycling Methods & Journeys | ReneweA",
      toolkit: "Circularity & Waste Sorting Toolkit | ReneweA",
      volunteer: "Volunteer Recruitment & Stewardship | ReneweA India",
      login: "Secure Telemetry Portal & Admin Dashboard | ReneweA",
      admin: "Central Coordination Panel | ReneweA Admin"
    };

    const descMap: Record<string, string> = {
      home: "Track live waste recovery, metrics, and certified circular economy loops with ReneweA. Explore dynamic data dashboards, regional collection hub statistics, and partner toolkits.",
      about: "Discover ReneweA's mission to close the loop on material waste in India. Meet Kiran Reddy and our team driving regional recycling hubs and traceability.",
      methods: "Learn about the advanced sorting, cleaning, and processing methods for Plastics, Metals, Glass, and Paper with complete transparency and circular compliance.",
      toolkit: "Access the ultimate recycling toolkit. Empower communities with sorting guidelines, waste reduction frameworks, and telemetry dashboard templates.",
      volunteer: "Apply to become a ReneweA local volunteer steward. Help coordinate coastal cleanups, e-waste drives, and eco-teaching across Indian cities.",
      login: "Authorized access to ReneweA's central telemetry coordination network. Manage volunteer approvals, collection logs, and live environmental stats.",
      admin: "Manage environmental collections, approve registered volunteer applications, and synchronize live telemetry across regional hubs."
    };

    const currentTitle = titleMap[activePage] || "ReneweA | Environmental Sustainability Tracker";
    const currentDesc = descMap[activePage] || descMap.home;

    document.title = currentTitle;

    // Update description meta tag dynamically
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', currentDesc);

    // Update OG elements
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', currentTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', currentDesc);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activePage]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans selection:bg-green-500/30 selection:text-white relative overflow-x-hidden">
      {/* GLOBAL ATMOSPHERIC ENVIRONMENTAL & RECYCLABLE BACKGROUND OVERLAYS */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.06] sm:opacity-[0.08]"
        style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.12)) scale(1.15)', transformOrigin: 'center center' }}
      >
        {/* Layer 1: Environmental Backdrop (Lush clean forest scenery) */}
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80"
          alt="Clean Forest Environment Background"
          className="absolute inset-0 w-full h-full object-cover filter saturate-75 contrast-[1.1]"
          referrerPolicy="no-referrer"
        />
        {/* Subtle blending overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 mix-blend-multiply" />
        
        {/* Layer 2: Recyclable Image Motif (Sorted clean recyclable materials) */}
        <img
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1920&q=80"
          alt="Recyclable Sorting Backdrop"
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-20"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Dynamic Sticky Header */}
      <Navbar />

      {/* Main View Transition Stack */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {activePage === 'home' && <Home />}
            {activePage === 'methods' && <Methods />}
            {activePage === 'toolkit' && <Toolkit />}
            {activePage === 'volunteer' && <Volunteer />}
            {activePage === 'login' && <Login />}
            {activePage === 'admin' && <Admin />}
            {activePage === 'about' && <About />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate Premium Footer Segment */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </AppProvider>
  );
}

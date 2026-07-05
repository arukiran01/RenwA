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

    // Advanced Page-Specific Structured Data Schema (JSON-LD) Injection for AEO, GEO, and SEO Excellence
    const schemas: Record<string, object> = {
      home: {
        "@context": "https://schema.org",
        "@type": "EnvironmentalAgency",
        "name": "ReneweA",
        "url": "https://renewa.live",
        "logo": "https://renewa.live/favicon.svg",
        "description": "India's premier environmental telemetry and waste recovery platform tracking live metrics across Hyderabad, Bangalore, Mumbai, Chennai, and Delhi NCR.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Deccan Circular Hub, Madhapur",
          "addressLocality": "Hyderabad",
          "addressRegion": "Telangana",
          "postalCode": "500081",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "17.4483",
          "longitude": "78.3741"
        },
        "telephone": "+91 40 2345 6789",
        "knowsAbout": ["Circular Economy", "Environmental Telemetry", "E-waste Logistics", "Recycling Methods", "Waste Sorting"],
        "sameAs": [
          "https://github.com/arukiranreddy",
          "https://renewa.live"
        ]
      },
      about: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
          "@type": "Organization",
          "name": "ReneweA",
          "founder": [
            {
              "@type": "Person",
              "name": "Kiran Reddy",
              "jobTitle": "Founder & Chief Sustainability Officer"
            },
            {
              "@type": "Person",
              "name": "Dr. Ananya Sen",
              "jobTitle": "Head of Materials & Circular Science"
            },
            {
              "@type": "Person",
              "name": "Aditya Sharma",
              "jobTitle": "Director of Regional Logistics & Operations"
            }
          ],
          "foundingDate": "2026-01-01",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Hyderabad",
            "addressRegion": "Telangana",
            "addressCountry": "IN"
          }
        }
      },
      methods: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Certified Material Reprocessing & Circular Sorting",
        "provider": {
          "@type": "Organization",
          "name": "ReneweA"
        },
        "serviceType": "Recycling and Waste Valorization",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "description": "State-of-the-art sorting and reprocessing methods for Plastic (PET, HDPE), Metal (Aluminium, Steel), Glass, and Paper with complete telemetry and transparency.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Recycling Methods Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Plastic Flaking & Thermal Extrusion",
                "description": "Sorting and processing polymers into food-grade circular flakes."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Hydropulping & Metal De-tinning",
                "description": "Paper fibre recovery and electrolytic metal recovery."
              }
            }
          ]
        }
      },
      toolkit: {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Circularity & Waste Sorting Toolkit",
        "description": "Essential instructions, partner agreements, and setup procedures for starting community circular sorting hubs and dry waste aggregation centers in Indian cities.",
        "author": {
          "@type": "Organization",
          "name": "ReneweA"
        },
        "inLanguage": "en",
        "about": [
          {
            "@type": "Thing",
            "name": "Waste Sorting"
          },
          {
            "@type": "Thing",
            "name": "Circular Economy Setup"
          },
          {
            "@type": "Thing",
            "name": "Environmental Auditing"
          }
        ]
      },
      volunteer: {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "ReneweA Citizen Mobilization & Waste Stewardship Hubs",
        "description": "Apply to join ReneweA's active recovery network. Help coordinate coastal cleanups, school eco-seminars, and regional sorting drives in any major Indian city.",
        "startDate": "2026-07-05T09:00:00+05:30",
        "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "Multiple Cities (Hyderabad, Bangalore, Mumbai, Chennai, Delhi NCR)",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Hyderabad, Bangalore, Mumbai, Chennai",
            "addressCountry": "IN"
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": "ReneweA"
        }
      },
      login: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Authorized Telemetry Coordinator Panel",
        "description": "Secure access point for central hubs, logistical coordinators, and verified environmental field agents to push telemetry metrics."
      },
      admin: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "ReneweA Central Command Telemetry Console",
        "description": "Protected administrative and synchronization desk to manage volunteer certifications and approve logistical collection weights."
      }
    };

    const currentSchema = schemas[activePage] || schemas.home;

    // Remove any existing dynamic schema tag to avoid duplicates, then append new
    let schemaScript = document.getElementById('dynamic-seo-schema');
    if (schemaScript) {
      schemaScript.remove();
    }
    schemaScript = document.createElement('script');
    schemaScript.setAttribute('id', 'dynamic-seo-schema');
    schemaScript.setAttribute('type', 'application/ld+json');
    schemaScript.textContent = JSON.stringify(currentSchema, null, 2);
    document.head.appendChild(schemaScript);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      const scriptToRemove = document.getElementById('dynamic-seo-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
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

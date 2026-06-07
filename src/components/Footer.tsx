import React from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { setActivePage } = useApp();

  const navigateTo = (page: 'home' | 'methods' | 'toolkit' | 'volunteer' | 'login') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="renewa_footer" className="bg-slate-950 text-slate-400 border-t border-white/5 relative z-10">
      
      {/* Outer Glow container */}
      <div className="absolute inset-x-0 bottom-0 height-[200px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
          
          {/* Column 1: App Identity */}
          <div className="space-y-4">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigateTo('home')}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-green-500 to-emerald-700 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-md flex items-center justify-center">
                  <Leaf className="w-4.5 h-4.5 text-green-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-heading">
                Renew<span className="text-green-500">A</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Closing circular material loops by coordinating modern waste diagnostics, neighborhood tracking points, and certified processing streams globally.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center space-x-1 text-[10px] text-slate-500 uppercase tracking-widest font-black">

              </span>
            </div>
          </div>

          {/* Column 2: Direct Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white font-heading">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-green-400 transition-colors cursor-pointer"
                >
                  Home Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('methods')}
                  className="hover:text-green-400 transition-colors cursor-pointer"
                >
                  Methods of Recycling
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('toolkit')}
                  className="hover:text-green-400 transition-colors cursor-pointer"
                >
                  Toolkit Steps
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('volunteer')}
                  className="hover:text-green-400 transition-colors cursor-pointer"
                >
                  Volunteer Recruitment
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Core Programs catalog */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white font-heading">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('methods')}
                  className="hover:text-green-400 transition-colors cursor-pointer text-left"
                >
                  Material Directives (Class 1-6)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('toolkit')}
                  className="hover:text-green-400 transition-colors cursor-pointer text-left"
                >
                  Initiative Accelerator Kits
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('volunteer')}
                  className="hover:text-green-400 transition-colors cursor-pointer text-left"
                >
                  Change Maker Action Drives
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('login')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left font-semibold text-emerald-500/80"
                >
                  Executive Log Console
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white font-heading">Contact Details</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-green-400" />
                <span>+1 (800) 555-RENEWA</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-green-400" />
                <span>earth@renewa-sustain.org</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
                <span className="leading-normal">
                  Sustained Hub Quarter Block 12A,<br />
                  San Francisco, CA 94103
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM METRIC BOX copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <div>
            <span>© 2026 RenewA. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-1.5 uppercase tracking-wider text-green-500">
            <Leaf className="w-3.5 h-3.5" />
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-heading">
              Transforming Waste Into A Sustainable Future
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

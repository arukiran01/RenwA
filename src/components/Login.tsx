import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Lock, Mail, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'A valid operator email address structure is required.' }),
  password: z.string().min(4, { message: 'Administrator passcode must be at least 4 characters long.' })
});

export default function Login() {
  const { loginAdmin, loginWithGoogle, setActivePage, isAuthenticated } = useApp();
  const [email, setEmail] = useState('admin@renewea.org');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle auto redirect if already authorized
  React.useEffect(() => {
    if (isAuthenticated) {
      setActivePage('admin');
    }
  }, [isAuthenticated, setActivePage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const success = await loginAdmin(password);
      if (success) {
        setActivePage('admin');
      } else {
        setError('Invalid entry credentials. (Hint: use "admin" or "renewea2026")');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center px-6 py-32 relative overflow-hidden">
      
      {/* Decorative environmental landscape backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
          alt="Pristine natural environment forest mist"
          className="w-full h-full object-cover opacity-[0.08] filter saturate-[0.6] contrast-[1.1]"
          style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * 0.12)) scale(1.15)', transformOrigin: 'center center' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-slate-900/60 border border-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-400">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter font-heading leading-tight">Console Access</h2>
          <p className="text-slate-400 text-xs">
            Authenticate to access the live waste management controls.
          </p>
        </div>

        {error && (
          <div
            id="login_error"
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-start space-x-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Operator email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@renewea.com"
                className="w-full bg-slate-950 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none text-sm transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Passcode</label>
              <button
                type="button"
                onClick={() => alert('Development Bypass active: Use key "admin" or "renewea2026" to login.')}
                className="text-[10px] text-green-400 hover:text-green-300 font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none text-sm transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            id="login_action_btn"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer mt-4 flex items-center justify-center space-x-1 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Authenticate'}</span>
          </button>

        </form>

      </motion.div>

    </div>
  );
}

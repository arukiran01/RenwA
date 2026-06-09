import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { motion, AnimatePresence } from 'motion/react';
import { z } from 'zod';
import {
  Heart,
  Send,
  X,
  Compass
} from 'lucide-react';

const volunteerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please introduce a valid email address structure.' }),
  phone: z.string().min(7, { message: 'Phone coordinates require a valid numeric pattern.' }),
  city: z.string().min(2, { message: 'Please declare your city of residence.' }),
  skills: z.string().optional(),
  availability: z.string().min(1, { message: 'Please select your availability.' }),
  appliedRole: z.string().min(1, { message: 'Please choose an active requirement post.' }),
  message: z.string().optional()
});

export default function Volunteer() {
  const { submitVolunteer } = useDashboard();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    skills: '',
    availability: 'Part-time (Weekends)',
    appliedRole: 'General Volunteer',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [justSubmittedName, setJustSubmittedName] = useState('');

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = volunteerSchema.shape[name as keyof typeof volunteerSchema.shape];
      if (fieldSchema) {
        const result = fieldSchema.safeParse(value);
        if (!result.success) {
          return result.error.issues[0].message;
        }
      }
    } catch {
      // Fallback
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full bg-slate-950/60 focus:bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border transition-all duration-200 placeholder-slate-600 focus:outline-none";
    if (touched[fieldName]) {
      if (formErrors[fieldName]) {
        return `${baseClass} border-red-500/70 focus:border-red-400 bg-red-950/5`;
      } else {
        const val = formData[fieldName as keyof typeof formData];
        if (val && val.trim() !== '') {
          return `${baseClass} border-emerald-500/50 focus:border-emerald-400 bg-emerald-950/5`;
        }
      }
    }
    return `${baseClass} border-white/10 focus:border-emerald-500`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Mark all input controls as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

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
        appliedRole: formData.appliedRole,
        status: 'Pending Review'
      });

      setJustSubmittedName(formData.name);
      setShowPopup(true);

      // Reset form controls
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        skills: '',
        availability: 'Part-time (Weekends)',
        appliedRole: 'General Volunteer',
        message: ''
      });
      setFormErrors({});
      setTouched({});
    } catch (err) {
      console.error("Volunteer application error: ", err);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-24 px-4 sm:px-6 relative overflow-hidden" id="volunteer_recruitment_view">
      
      {/* Background subtle glowing radial gradient elements (high-end visual layout) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Simple & Clear Main Title Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Volunteer Advocacy Network</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-5xl font-black font-heading tracking-tight text-white"
          >
            Volunteer Recruitment
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-slate-400 leading-relaxed font-sans"
          >
            Join active territorial change-makers today. Complete the simple application form below to support our circular network initiative.
          </motion.p>
        </div>

        {/* Centered Single-Column Intake Form Layout */}
        <div className="max-w-3xl mx-auto">
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-white/5 relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-emerald-500/10" id="volunteer_form_card">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/40 to-green-500/40" />
            
            <div className="text-left space-y-1.5 mb-6">
              <h3 className="text-xl font-bold font-heading text-white">Engagement Application</h3>
              <p className="text-xs text-slate-400">
                Complete the simple application form below. Fields marked with * are required.
              </p>
            </div>

            {/* ACTIVE FORM DETAILS */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Full Name *</label>
                    {touched.name && !formErrors.name && formData.name.trim() !== '' && (
                      <span className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">Valid</span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="e.g. Alexis Jenkins"
                    className={getInputClass('name')}
                  />
                  {touched.name && formErrors.name && (
                    <p className="text-[10px] text-red-400 font-semibold mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Email Address *</label>
                    {touched.email && !formErrors.email && formData.email.trim() !== '' && (
                      <span className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">Valid</span>
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="alexis@domain.com"
                    className={getInputClass('email')}
                  />
                  {touched.email && formErrors.email && (
                    <p className="text-[10px] text-red-400 font-semibold mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Phone Coordinates *</label>
                    {touched.phone && !formErrors.phone && formData.phone.trim() !== '' && (
                      <span className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">Valid</span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="+1 (555) 789-1234"
                    className={getInputClass('phone')}
                  />
                  {touched.phone && formErrors.phone && (
                    <p className="text-[10px] text-red-400 font-semibold mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* Residence */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">City of Residence *</label>
                    {touched.city && !formErrors.city && formData.city.trim() !== '' && (
                      <span className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">Valid</span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="e.g. Seattle, WA"
                    className={getInputClass('city')}
                  />
                  {touched.city && formErrors.city && (
                    <p className="text-[10px] text-red-400 font-semibold mt-1">{formErrors.city}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Availability */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Weekly Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none cursor-pointer transition-colors"
                  >
                    <option>Part-time (Weekends)</option>
                    <option>Weekly (Evenings)</option>
                    <option>Full-time logistics advocate</option>
                    <option>Remote/Digital advocacy only</option>
                  </select>
                </div>

                {/* Skills (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Special Skills (Optional)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="e.g. Graphic layout, driving, sorting"
                    className={getInputClass('skills')}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Ecological Focus Statement</label>
                <textarea
                  rows={2}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Briefly, what motivates you to support circular action networks?"
                  className={getInputClass('message') + " resize-none"}
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="submit_volunteer_btn"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all font-sans uppercase tracking-wider text-xs flex items-center justify-center space-x-2 shrink-0 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join Circular Network</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* POPUP RECRUITMENT CONFIRMATION */}
      <AnimatePresence>
        {showPopup && (
          <div
            id="volunteer_success_popup"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 relative shadow-2xl space-y-5 text-center"
            >
              <button
                id="close_success_popup"
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-1.5 bg-slate-950 hover:bg-slate-800 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-md">
                <Heart className="w-5 h-5 fill-emerald-400/10 text-emerald-400" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold font-heading text-white">Application Received</h3>
                <p className="text-slate-350 text-xs leading-relaxed">
                  Excellent, <span className="text-emerald-450 font-bold">{justSubmittedName}</span>! Your intake submission is active in our register.
                </p>
                <p className="text-[11px] text-slate-500 leading-normal max-w-xs mx-auto">
                  Our team will review your details and reach out to you within 24 hours.
                </p>
              </div>

              <div className="pt-1">
                <button
                  id="dismiss_popup_btn"
                  onClick={() => setShowPopup(false)}
                  className="w-full py-2 bg-white hover:bg-slate-200 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Ok
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

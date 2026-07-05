import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { motion, AnimatePresence } from 'motion/react';
import { z } from 'zod';
import {
  Heart,
  Send,
  X,
  Compass,
  CheckCircle2,
  AlertCircle
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

  // Floating Toast notifications state
  interface Toast {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error';
  }
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

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
      addToast(
        "Validation Failed",
        "Please review the highlighted fields in the application.",
        "error"
      );
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

      addToast(
        "Application Received",
        `Fantastic, ${formData.name}! Your details have been submitted.`,
        "success"
      );

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
      addToast(
        "Submission Error",
        "Failed to send application. Please try again.",
        "error"
      );
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
                    placeholder="e.g. +91 98765 43210"
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
                    list="indian_cities"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="e.g. Hyderabad, Telangana"
                    className={getInputClass('city')}
                  />
                  <datalist id="indian_cities">
                    <option value="Adilabad, Telangana" />
                    <option value="Agartala, Tripura" />
                    <option value="Agra, Uttar Pradesh" />
                    <option value="Ahmedabad, Gujarat" />
                    <option value="Ahmednagar, Maharashtra" />
                    <option value="Aizawl, Mizoram" />
                    <option value="Ajmer, Rajasthan" />
                    <option value="Akola, Maharashtra" />
                    <option value="Alappuzha, Kerala" />
                    <option value="Aligarh, Uttar Pradesh" />
                    <option value="Alwar, Rajasthan" />
                    <option value="Ambala, Haryana" />
                    <option value="Ambikapur, Chhattisgarh" />
                    <option value="Amravati, Maharashtra" />
                    <option value="Amritsar, Punjab" />
                    <option value="Anand, Gujarat" />
                    <option value="Anantapur, Andhra Pradesh" />
                    <option value="Anantnag, Jammu and Kashmir" />
                    <option value="Arrah, Bihar" />
                    <option value="Asansol, West Bengal" />
                    <option value="Aurangabad, Maharashtra" />
                    <option value="Ayodhya, Uttar Pradesh" />
                    <option value="Balasore, Odisha" />
                    <option value="Bangalore, Karnataka" />
                    <option value="Baran, Rajasthan" />
                    <option value="Bardhaman, West Bengal" />
                    <option value="Bareilly, Uttar Pradesh" />
                    <option value="Bathinda, Punjab" />
                    <option value="Begusarai, Bihar" />
                    <option value="Belgaum, Karnataka" />
                    <option value="Bellary, Karnataka" />
                    <option value="Berhampur, Odisha" />
                    <option value="Bhadrak, Odisha" />
                    <option value="Bhagalpur, Bihar" />
                    <option value="Bharuch, Gujarat" />
                    <option value="Bhavnagar, Gujarat" />
                    <option value="Bhilai, Chhattisgarh" />
                    <option value="Bhilwara, Rajasthan" />
                    <option value="Bhopal, Madhya Pradesh" />
                    <option value="Bhubaneswar, Odisha" />
                    <option value="Bhuj, Gujarat" />
                    <option value="Bidar, Karnataka" />
                    <option value="Bihar Sharif, Bihar" />
                    <option value="Bijapur, Karnataka" />
                    <option value="Bikaner, Rajasthan" />
                    <option value="Bilaspur, Chhattisgarh" />
                    <option value="Bilaspur, Himachal Pradesh" />
                    <option value="Bokaro Steel City, Jharkhand" />
                    <option value="Bongaigaon, Assam" />
                    <option value="Burhanpur, Madhya Pradesh" />
                    <option value="Chandigarh, Chandigarh" />
                    <option value="Chandrapur, Maharashtra" />
                    <option value="Chennai, Tamil Nadu" />
                    <option value="Chhindwara, Madhya Pradesh" />
                    <option value="Coimbatore, Tamil Nadu" />
                    <option value="Cuttack, Odisha" />
                    <option value="Daman, Daman and Diu" />
                    <option value="Darbhanga, Bihar" />
                    <option value="Darjeeling, West Bengal" />
                    <option value="Davanagere, Karnataka" />
                    <option value="Dehradun, Uttarakhand" />
                    <option value="Delhi NCR, Delhi" />
                    <option value="Deoghar, Jharkhand" />
                    <option value="Dewas, Madhya Pradesh" />
                    <option value="Dharamshala, Himachal Pradesh" />
                    <option value="Dharmanagar, Tripura" />
                    <option value="Dhanbad, Jharkhand" />
                    <option value="Dhule, Maharashtra" />
                    <option value="Dibrugarh, Assam" />
                    <option value="Dimapur, Nagaland" />
                    <option value="Dindigul, Tamil Nadu" />
                    <option value="Diu, Daman and Diu" />
                    <option value="Durgapur, West Bengal" />
                    <option value="Dwarka, Delhi" />
                    <option value="Eluru, Andhra Pradesh" />
                    <option value="English Bazar, West Bengal" />
                    <option value="Erode, Tamil Nadu" />
                    <option value="Faridabad, Haryana" />
                    <option value="Firozabad, Uttar Pradesh" />
                    <option value="Gandhinagar, Gujarat" />
                    <option value="Ganganagar, Rajasthan" />
                    <option value="Gangtok, Sikkim" />
                    <option value="Gaya, Bihar" />
                    <option value="Geyzing, Sikkim" />
                    <option value="Ghaziabad, Uttar Pradesh" />
                    <option value="Giridih, Jharkhand" />
                    <option value="Gopalpur, West Bengal" />
                    <option value="Gorakhpur, Uttar Pradesh" />
                    <option value="Greater Noida, Uttar Pradesh" />
                    <option value="Gulbarga, Karnataka" />
                    <option value="Guntur, Andhra Pradesh" />
                    <option value="Gurgaon, Haryana" />
                    <option value="Guwahati, Assam" />
                    <option value="Gwalior, Madhya Pradesh" />
                    <option value="Haldwani, Uttarakhand" />
                    <option value="Hamirpur, Himachal Pradesh" />
                    <option value="Haridwar, Uttarakhand" />
                    <option value="Hazaribagh, Jharkhand" />
                    <option value="Hisar, Haryana" />
                    <option value="Hosapete, Karnataka" />
                    <option value="Hoshiarpur, Punjab" />
                    <option value="Howrah, West Bengal" />
                    <option value="Hubli-Dharwad, Karnataka" />
                    <option value="Hyderabad, Telangana" />
                    <option value="Imphal, Manipur" />
                    <option value="Indore, Madhya Pradesh" />
                    <option value="Itanagar, Arunachal Pradesh" />
                    <option value="Jabalpur, Madhya Pradesh" />
                    <option value="Jagdalpur, Chhattisgarh" />
                    <option value="Jaipur, Rajasthan" />
                    <option value="Jalandhar, Punjab" />
                    <option value="Jalgaon, Maharashtra" />
                    <option value="Jamnagar, Gujarat" />
                    <option value="Jammu, Jammu and Kashmir" />
                    <option value="Jamshedpur, Jharkhand" />
                    <option value="Jhansi, Uttar Pradesh" />
                    <option value="Jodhpur, Rajasthan" />
                    <option value="Jorhat, Assam" />
                    <option value="Jowai, Meghalaya" />
                    <option value="Junagadh, Gujarat" />
                    <option value="Kadapa, Andhra Pradesh" />
                    <option value="Kakinada, Andhra Pradesh" />
                    <option value="Kakching, Manipur" />
                    <option value="Kalyan-Dombivli, Maharashtra" />
                    <option value="Kannur, Kerala" />
                    <option value="Kanpur, Uttar Pradesh" />
                    <option value="Karimnagar, Telangana" />
                    <option value="Karnal, Haryana" />
                    <option value="Karur, Tamil Nadu" />
                    <option value="Kasaragod, Kerala" />
                    <option value="Kashipur, Uttarakhand" />
                    <option value="Kathua, Jammu and Kashmir" />
                    <option value="Katihar, Bihar" />
                    <option value="Kavaratti, Lakshadweep" />
                    <option value="Khammam, Telangana" />
                    <option value="Kharagpur, West Bengal" />
                    <option value="Kochi, Kerala" />
                    <option value="Kohima, Nagaland" />
                    <option value="Kolkata, West Bengal" />
                    <option value="Kolhapur, Maharashtra" />
                    <option value="Kollam, Kerala" />
                    <option value="Korba, Chhattisgarh" />
                    <option value="Kota, Rajasthan" />
                    <option value="Kottayam, Kerala" />
                    <option value="Kozhikode, Kerala" />
                    <option value="Kullu, Himachal Pradesh" />
                    <option value="Kurnool, Andhra Pradesh" />
                    <option value="Latur, Maharashtra" />
                    <option value="Leh, Ladakh" />
                    <option value="Lucknow, Uttar Pradesh" />
                    <option value="Ludhiana, Punjab" />
                    <option value="Lunglei, Mizoram" />
                    <option value="Madurai, Tamil Nadu" />
                    <option value="Maheshtala, West Bengal" />
                    <option value="Mahbubnagar, Telangana" />
                    <option value="Mandi, Himachal Pradesh" />
                    <option value="Mangalore, Karnataka" />
                    <option value="Mapusa, Goa" />
                    <option value="Margao, Goa" />
                    <option value="Mathura, Uttar Pradesh" />
                    <option value="Meerut, Uttar Pradesh" />
                    <option value="Mehsana, Gujarat" />
                    <option value="Mira-Bhayandar, Maharashtra" />
                    <option value="Moga, Punjab" />
                    <option value="Mohali, Punjab" />
                    <option value="Mokokchung, Nagaland" />
                    <option value="Morbi, Gujarat" />
                    <option value="Moradabad, Uttar Pradesh" />
                    <option value="Mumbai, Maharashtra" />
                    <option value="Munger, Bihar" />
                    <option value="Murwara (Katni), Madhya Pradesh" />
                    <option value="Mysore, Karnataka" />
                    <option value="Nadiad, Gujarat" />
                    <option value="Nagaon, Assam" />
                    <option value="Nagercoil, Tamil Nadu" />
                    <option value="Nagpur, Maharashtra" />
                    <option value="Naharlagun, Arunachal Pradesh" />
                    <option value="Nainital, Uttarakhand" />
                    <option value="Nalgonda, Telangana" />
                    <option value="Namchi, Sikkim" />
                    <option value="Nanded, Maharashtra" />
                    <option value="Nashik, Maharashtra" />
                    <option value="Navi Mumbai, Maharashtra" />
                    <option value="Nellore, Andhra Pradesh" />
                    <option value="Nizamabad, Telangana" />
                    <option value="Noida, Uttar Pradesh" />
                    <option value="Panchkula, Haryana" />
                    <option value="Panaji, Goa" />
                    <option value="Panipat, Haryana" />
                    <option value="Pasighat, Arunachal Pradesh" />
                    <option value="Patiala, Punjab" />
                    <option value="Patna, Bihar" />
                    <option value="Pathankot, Punjab" />
                    <option value="Pimpri-Chinchwad, Maharashtra" />
                    <option value="Palakkad, Kerala" />
                    <option value="Pali, Rajasthan" />
                    <option value="Ponda, Goa" />
                    <option value="Port Blair, Andaman and Nicobar Islands" />
                    <option value="Prayagraj, Uttar Pradesh" />
                    <option value="Puducherry, Puducherry" />
                    <option value="Pune, Maharashtra" />
                    <option value="Puri, Odisha" />
                    <option value="Purnia, Bihar" />
                    <option value="Raichur, Karnataka" />
                    <option value="Raipur, Chhattisgarh" />
                    <option value="Rajahmundry, Andhra Pradesh" />
                    <option value="Rajkot, Gujarat" />
                    <option value="Rajnandgaon, Chhattisgarh" />
                    <option value="Ramagundam, Telangana" />
                    <option value="Ranchi, Jharkhand" />
                    <option value="Ratlam, Madhya Pradesh" />
                    <option value="Rewa, Madhya Pradesh" />
                    <option value="Rishikesh, Uttarakhand" />
                    <option value="Rohtak, Haryana" />
                    <option value="Roorkee, Uttarakhand" />
                    <option value="Rourkela, Odisha" />
                    <option value="Rudrapur, Uttarakhand" />
                    <option value="Sagar, Madhya Pradesh" />
                    <option value="Saharanpur, Uttar Pradesh" />
                    <option value="Salem, Tamil Nadu" />
                    <option value="Sambalpur, Odisha" />
                    <option value="Sangli, Maharashtra" />
                    <option value="Satna, Madhya Pradesh" />
                    <option value="Secunderabad, Telangana" />
                    <option value="Shillong, Meghalaya" />
                    <option value="Shimla, Himachal Pradesh" />
                    <option value="Shimoga, Karnataka" />
                    <option value="Silchar, Assam" />
                    <option value="Siliguri, West Bengal" />
                    <option value="Silvassa, Dadra and Nagar Haveli" />
                    <option value="Singrauli, Madhya Pradesh" />
                    <option value="Srinagar, Jammu and Kashmir" />
                    <option value="Solan, Himachal Pradesh" />
                    <option value="Solapur, Maharashtra" />
                    <option value="Sonipat, Haryana" />
                    <option value="Sopore, Jammu and Kashmir" />
                    <option value="Surat, Gujarat" />
                    <option value="Tawang, Arunachal Pradesh" />
                    <option value="Tezpur, Assam" />
                    <option value="Thane, Maharashtra" />
                    <option value="Thanjavur, Tamil Nadu" />
                    <option value="Thiruvananthapuram, Kerala" />
                    <option value="Thoubal, Manipur" />
                    <option value="Thrissur, Kerala" />
                    <option value="Tinsukia, Assam" />
                    <option value="Tirunelveli, Tamil Nadu" />
                    <option value="Tirupati, Andhra Pradesh" />
                    <option value="Tiruppur, Tamil Nadu" />
                    <option value="Trichy, Tamil Nadu" />
                    <option value="Tumkur, Karnataka" />
                    <option value="Tura, Meghalaya" />
                    <option value="Udaipur, Rajasthan" />
                    <option value="Udaipur, Tripura" />
                    <option value="Udupi, Karnataka" />
                    <option value="Ujjain, Madhya Pradesh" />
                    <option value="Vadodara, Gujarat" />
                    <option value="Valsad, Gujarat" />
                    <option value="Vapi, Gujarat" />
                    <option value="Varanasi, Uttar Pradesh" />
                    <option value="Vasco da Gama, Goa" />
                    <option value="Vasai-Virar, Maharashtra" />
                    <option value="Vellore, Tamil Nadu" />
                    <option value="Vijayawada, Andhra Pradesh" />
                    <option value="Visakhapatnam, Andhra Pradesh" />
                    <option value="Vizianagaram, Andhra Pradesh" />
                    <option value="Warangal, Telangana" />
                    <option value="Yamunanagar, Haryana" />
                  </datalist>
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

      {/* FLOATING TOAST NOTIFICATION STACK */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-3 pointer-events-auto relative overflow-hidden ${
                t.type === 'success'
                  ? 'bg-slate-900/95 border-emerald-500/20 text-white'
                  : 'bg-slate-900/95 border-red-500/20 text-white'
              }`}
              layout
            >
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                t.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
              }`} />

              <div className="mt-0.5 shrink-0">
                {t.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
              </div>

              <div className="flex-1 text-left space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider">{t.title}</h4>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{t.message}</p>
              </div>

              <button
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="text-slate-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

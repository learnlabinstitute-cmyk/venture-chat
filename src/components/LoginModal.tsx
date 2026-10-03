import React, { useState } from 'react';
import { VentureLogo } from './VentureLogo';
import { ShieldCheck, Phone, Mail, User, ArrowRight } from 'lucide-react';

export interface CustomerProfile {
  name: string;
  email: string;
  mobile: string;
  plan?: 'silver' | 'gold' | 'platinum';
}

interface LoginModalProps {
  isOpen: boolean;
  initialProfile?: CustomerProfile;
  onComplete: (profile: CustomerProfile) => void;
  isEditing?: boolean;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  initialProfile,
  onComplete,
  isEditing = false,
  onClose,
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Client');
  const [email, setEmail] = useState(initialProfile?.email || 'learnlabinstitute@gmail.com');
  const [mobile, setMobile] = useState(initialProfile?.mobile || '9876543210');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};

    if (!name.trim()) errs.name = 'Kripya apna naam enter karein.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Kripya ek valid email ID enter karein.';
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) errs.mobile = '10-digit mobile number enter karein.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onComplete({
      name: name.trim(),
      email: email.trim(),
      mobile: cleanMobile,
      plan: initialProfile?.plan,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center">
          <div className="flex justify-center mb-2">
            <VentureLogo size="md" showSubtitle={false} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Venture Infotech Support 24
          </h2>
          <p className="mt-1 text-emerald-100 text-xs leading-relaxed">
            {isEditing
              ? 'Apna contact profile update karein'
              : 'Dedicated 24/7 issue handling & client assistance desk'}
          </p>
        </div>

        {/* Form Body - Only takes Login details (Email & Mobile & Name), NO silver/gold on first page */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aapka naam"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Dedicated IVR & Official Recorded Support Channel.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {isEditing && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <span>Connect to Support Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

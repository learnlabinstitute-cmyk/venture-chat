import React, { useState } from 'react';
import { CustomerProfile } from './LoginModal';
import { PLANS } from '../data/ventureData';
import { AlertCircle, CheckCircle, Clock, ShieldCheck, X, LifeBuoy } from 'lucide-react';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProfile;
  onTicketCreated: (ticketData: any) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  customer,
  onTicketCreated,
}) => {
  const [category, setCategory] = useState('Website Technical Issue');
  const [level, setLevel] = useState<'Level 1' | 'Level 2' | 'Level 3'>('Level 2');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('High');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<any | null>(null);

  if (!isOpen) return null;

  const currentPlan = (customer.plan && PLANS[customer.plan]) ? PLANS[customer.plan] : PLANS.silver;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/ticket/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          customerEmail: customer.email,
          customerMobile: customer.mobile,
          planId: customer.plan,
          category,
          priority,
          level,
          subject: subject.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (data.ticket) {
        setSuccessTicket(data.ticket);
        onTicketCreated(data.ticket);
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSLA = (lvl: string) => {
    switch (lvl) {
      case 'Level 1':
        return 'SLA: 0 to 2 Hours (Frontline AI & Executive)';
      case 'Level 2':
        return 'SLA: 4 to 12 Hours (Senior Technical Lead & PM)';
      case 'Level 3':
        return 'SLA: 24 to 48 Hours (Grievance Officer & Operations Head)';
      default:
        return 'Standard SLA';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-emerald-300">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Raise Formal Escalation / Ticket</h3>
              <p className="text-xs text-emerald-200">
                Official Venture Infotech Escalation Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successTicket ? (
          /* Success Screen */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              Escalation Ticket Registered!
            </h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Ticket ID:</span>
                <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {successTicket.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tier Level:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{successTicket.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority:</span>
                <span className="font-semibold text-amber-600">{successTicket.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned SLA:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{getSLA(successTicket.level)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aapka ticket hamari technical support team ko transmit ho chuka hai. Hamari assistant Aarohi ne chat me bhi confirmation add kar di hai!
            </p>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Back to Chat
            </button>
          </div>
        ) : (
          /* Ticket Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Customer Plan Context */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Registered Client:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">{customer.name}</strong>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white bg-gradient-to-r ${currentPlan.badgeColor}`}>
                {currentPlan.name} ({currentPlan.websitesCount} {currentPlan.websitesCount === 1 ? 'Site' : 'Sites'})
              </span>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              >
                <option>Website Technical Issue / Bug</option>
                <option>Milestone Delivery Delay</option>
                <option>Domain DNS / Hosting Setup</option>
                <option>Cancellation & Refund Policy Review</option>
                <option>Multi-website Allocation Query</option>
                <option>Out of Scope / Change Request</option>
                <option>Other Operational Dispute</option>
              </select>
            </div>

            {/* Level selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Escalation Level Matrix</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                  ventureinfotech.in/escalation
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Level 1', 'Level 2', 'Level 3'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      level === lvl
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{lvl}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {lvl === 'Level 1' ? 'Frontline' : lvl === 'Level 2' ? 'Tech Lead' : 'Grievance'}
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                {getSLA(level)}
              </p>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <div className="flex gap-2">
                {(['Normal', 'High', 'Urgent'] as const).map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setPriority(pr)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      priority === pr
                        ? pr === 'Urgent'
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold'
                          : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ticket Subject *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Website launch timeline clarification"
                className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Concern
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Aapki pareshani ya query vistaar se likhein taaki team turant action le sake..."
                className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Generate Official Escalation Ticket'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

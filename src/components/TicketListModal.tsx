import React, { useEffect, useState } from 'react';
import { CustomerProfile } from './LoginModal';
import { SupportTicket } from '../data/ventureData';
import { LifeBuoy, Clock, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';

interface TicketListModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProfile;
  onOpenEscalation: () => void;
}

export const TicketListModal: React.FC<TicketListModalProps> = ({
  isOpen,
  onClose,
  customer,
  onOpenEscalation,
}) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    }
  }, [isOpen, customer]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ticket/list?email=${encodeURIComponent(customer.email)}&mobile=${encodeURIComponent(customer.mobile)}`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Your Support & Escalation Tickets
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track status under Venture Infotech Escalation SLA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Abhi koi open ticket nahi hai.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenEscalation();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                + Raise New Escalation Ticket
              </button>
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {t.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {t.subject}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.description}
                </p>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{t.level}</span>
                    <span>•</span>
                    <span className="text-amber-600 font-medium">{t.priority} Priority</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <a
            href="https://www.ventureinfotech.in/escalation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Escalation Policy Guide <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => {
              onClose();
              onOpenEscalation();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            + New Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

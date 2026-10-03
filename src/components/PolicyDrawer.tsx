import React, { useState } from 'react';
import { VENTURE_POLICIES, PolicyItem } from '../data/ventureData';
import { BookOpen, ExternalLink, Search, X, MessageSquareQuote, CheckCircle, ShieldAlert, Clock, AlertTriangle, FileText } from 'lucide-react';

interface PolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAskPolicy: (query: string) => void;
}

export const PolicyDrawer: React.FC<PolicyDrawerProps> = ({ isOpen, onClose, onAskPolicy }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePolicyId, setActivePolicyId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Support', 'Finance', 'Conduct', 'Operations', 'Legal'];

  const filtered = VENTURE_POLICIES.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      p.keyPoints.some((k) => k.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const activePolicy = VENTURE_POLICIES.find((p) => p.id === activePolicyId);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Support':
        return <Clock className="w-3.5 h-3.5 text-blue-500" />;
      case 'Finance':
        return <FileText className="w-3.5 h-3.5 text-amber-500" />;
      case 'Conduct':
        return <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />;
      case 'Operations':
        return <Clock className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Legal':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Venture Infotech Official Policies
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                13 Official policies governing client agreements & operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search refund, escalation, whatsapp, zero tolerance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activePolicy ? (
            /* Detailed Policy View */
            <div className="space-y-4">
              <button
                onClick={() => setActivePolicyId(null)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 mb-2"
              >
                ← Back to all 13 policies
              </button>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                    {activePolicy.category} Policy
                  </span>
                  <a
                    href={activePolicy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>ventureinfotech.in/{activePolicy.id}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  {activePolicy.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activePolicy.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Clauses & Rules
                </h4>
                <ul className="space-y-2">
                  {activePolicy.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Full Policy Clarification
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {activePolicy.fullDetails}
                </p>
              </div>

              <button
                onClick={() => {
                  onAskPolicy(activePolicy.faqPrompt);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>Ask Aarohi about "{activePolicy.title}"</span>
              </button>
            </div>
          ) : (
            /* List of Policies */
            <div className="space-y-2.5">
              {filtered.map((policy) => (
                <div
                  key={policy.id}
                  onClick={() => setActivePolicyId(policy.id)}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-all duration-150 flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950">
                        {getCategoryIcon(policy.category)}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {policy.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {policy.category}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {policy.summary}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>View clauses & SLA</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Koi policy match nahi hui "{search}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with direct website link */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500">
          <span>Official Domain: <strong>ventureinfotech.in</strong></span>
          <a
            href="https://www.ventureinfotech.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
          >
            Visit Website <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

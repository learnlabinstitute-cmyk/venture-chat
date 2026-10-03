import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const VentureLogo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', text: 'text-lg', sub: 'text-xs' },
    lg: { box: 'w-14 h-14', text: 'text-2xl', sub: 'text-sm' },
  };

  const dim = sizeMap[size];

  return (
    <div className="flex items-center gap-3">
      {/* Dynamic emerald & lime ribbon emblem matching Venture Infotech insignia */}
      <div className={`relative ${dim.box} flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900/60 p-1.5 shadow-md shadow-emerald-900/20 border border-emerald-500/30`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(74,222,128,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="limeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="50%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <linearGradient id="emeraldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
            <linearGradient id="ribbonShine" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#bef264" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#166534" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Upper ribbon curve */}
          <path
            d="M 52 10 
               C 68 18, 76 34, 60 48 
               C 48 58, 38 60, 32 68 
               C 24 78, 28 88, 38 90 
               C 22 84, 18 68, 30 54 
               C 42 40, 56 36, 52 24 
               C 50 18, 44 14, 52 10 Z"
            fill="url(#limeGrad1)"
          />

          {/* Lower entwined ribbon curve */}
          <path
            d="M 48 90 
               C 32 82, 24 66, 40 52 
               C 52 42, 62 40, 68 32 
               C 76 22, 72 12, 62 10 
               C 78 16, 82 32, 70 46 
               C 58 60, 44 64, 48 76 
               C 50 82, 56 86, 48 90 Z"
            fill="url(#emeraldGrad2)"
          />

          {/* Dynamic center fold accent */}
          <path
            d="M 38 52 C 45 46, 55 46, 62 52 C 55 58, 45 58, 38 52 Z"
            fill="url(#ribbonShine)"
            opacity="0.9"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${dim.text}`}>
            VENTURE <span className="text-emerald-600 dark:text-emerald-400">INFOTECH</span>
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
            OFFICIAL
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-slate-500 dark:text-slate-400 font-medium ${dim.sub} flex items-center gap-1.5`}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Support Concierge • 24/7 Policies Desk
          </span>
        )}
      </div>
    </div>
  );
};

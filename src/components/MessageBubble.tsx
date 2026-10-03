import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { speakSweetVoice, stopSpeaking } from '../utils/speech';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  ticketRef?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  customerName?: string;
  onSelectActionChip?: (text: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  customerName,
  onSelectActionChip,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const isBot = message.role === 'model';

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakSweetVoice(message.content, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format text with bolding, lists, and links
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-2" />;
          }

          // Headers
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-base text-slate-900 dark:text-white mt-3 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-bold text-lg text-slate-900 dark:text-white mt-3 mb-1">
                {line.replace('## ', '')}
              </h3>
            );
          }

          // Bullet points
          const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
          const lineText = isBullet ? line.trim().slice(2) : line;

          // Parse markdown bold **text** and links [text](url)
          const parts: React.ReactNode[] = [];
          const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
          let lastIndex = 0;
          let match: RegExpExecArray | null;

          while ((match = regex.exec(lineText)) !== null) {
            if (match.index > lastIndex) {
              parts.push(lineText.substring(lastIndex, match.index));
            }
            const token = match[0];
            if (token.startsWith('**') && token.endsWith('**')) {
              parts.push(
                <strong key={`${idx}-${match.index}`} className="font-semibold text-slate-900 dark:text-white">
                  {token.slice(2, -2)}
                </strong>
              );
            } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
              const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
              if (linkMatch) {
                const label = linkMatch[1];
                const href = linkMatch[2];
                parts.push(
                  <a
                    key={`${idx}-${match.index}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mx-0.5"
                  >
                    <span>{label}</span>
                    <ExternalLink className="w-3 h-3 inline" />
                  </a>
                );
              }
            }
            lastIndex = match.index + token.length;
          }

          if (lastIndex < lineText.length) {
            parts.push(lineText.substring(lastIndex));
          }

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                <div className="flex-1">{parts}</div>
              </div>
            );
          }

          return <p key={idx}>{parts}</p>;
        })}
      </div>
    );
  };

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex items-start gap-2.5 max-w-[85%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        {isBot ? (
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 border border-emerald-400/30">
              <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none">
                <path d="M 52 10 C 68 18, 76 34, 60 48 C 48 58, 38 60, 32 68 C 24 78, 28 88, 38 90 C 22 84, 18 68, 30 54 C 42 40, 56 36, 52 24 C 50 18, 44 14, 52 10 Z" fill="#bef264" />
                <path d="M 48 90 C 32 82, 24 66, 40 52 C 52 42, 62 40, 68 32 C 76 22, 72 12, 62 10 C 78 16, 82 32, 70 46 C 58 60, 44 64, 48 76 C 50 82, 56 86, 48 90 Z" fill="#22c55e" />
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow">
            {customerName ? customerName.slice(0, 2).toUpperCase() : 'ME'}
          </div>
        )}

        {/* Message bubble card */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {isBot ? 'Aarohi (Venture Infotech AI Support)' : customerName || 'You'}
            </span>
            <span className="text-[10px] text-slate-400">
              {message.timestamp}
            </span>
            {isBot && (
              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Official Assistant
              </span>
            )}
          </div>

          <div
            className={`rounded-2xl p-4 shadow-sm transition-all ${
              isBot
                ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/15'
            }`}
          >
            {renderFormattedContent(message.content)}

            {/* Ticket badge if referenced */}
            {message.ticketRef && (
              <div className="mt-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Referenced Ticket: <strong>{message.ticketRef}</strong></span>
              </div>
            )}
          </div>

          {/* Footer buttons for Bot Message */}
          {isBot && (
            <div className="flex items-center gap-2 mt-1 px-1">
              <button
                onClick={handleToggleVoice}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                  isPlayingAudio
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isPlayingAudio ? 'Stop Voice' : 'Listen with Sweet Voice'}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                    <span className="text-[10px]">Speaking...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Listen Voice</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
                title="Copy reply"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { VentureLogo } from './components/VentureLogo';
import { LoginModal, CustomerProfile } from './components/LoginModal';
import { EscalationModal } from './components/EscalationModal';
import { TicketListModal } from './components/TicketListModal';
import { MessageBubble, ChatMessage } from './components/MessageBubble';
import {
  Send,
  Mic,
  MicOff,
  LifeBuoy,
  RotateCcw,
  Sparkles,
  ExternalLink,
  User,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

const STORAGE_KEY = 'venture_customer_session_v4';
const ESCALATION_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfG5JMuC4wqn_BiSjp48mKrOmB3TKmckKeM6r0wYXzMCUbPcQ/viewform?usp=header';

export default function App() {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [isTicketListOpen, setIsTicketListOpen] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load saved session or prompt login
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomer(parsed);
        initIshaGreeting(parsed);
      } else {
        setIsLoginOpen(true);
      }
    } catch {
      setIsLoginOpen(true);
    }
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition setup for mobile & desktop
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'hi-IN';

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognizer.onerror = () => setIsListening(false);
      recognizer.onend = () => setIsListening(false);
      recognitionRef.current = recognizer;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition support aapke browser me available nahi hai. Kripya type karein.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const handleProfileComplete = (profile: CustomerProfile) => {
    setCustomer(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setIsLoginOpen(false);
    initIshaGreeting(profile);
  };

  // Conversational greeting from Isha
  const initIshaGreeting = (prof: CustomerProfile) => {
    const initialGreeting: ChatMessage = {
      id: 'greeting-isha',
      role: 'model',
      content: `Hello ${prof.name}, welcome to **Venture Infotech Solution Support 24**! 😊

Main **Isha** baat kar rahi hoon.

Hum aapke har concern aur issue ko structured, transparent aur professional tareeqe se resolve karte hain. Aaj aap kya enquiry ya issue face kar rahe hain, kindly vistaar se batayein? Main yahan aapki poori sahayata karne ke liye tayyar hoon!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialGreeting]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading || !customer) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          customer,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Response error');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content:
          'Network issue ki wajah se thoda delay hua. Main Isha hoon, aap bejhijhak apna concern dobara bhej sakte hain.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketCreated = (ticket: any) => {
    const confirmationMsg: ChatMessage = {
      id: `ticket-notice-${Date.now()}`,
      role: 'model',
      content: `Aapka official Escalation Ticket **${ticket.id}** successfully register ho chuka hai!

- **Subject:** "${ticket.subject}"
- **Assigned Level:** **${ticket.level}** (${ticket.priority} Priority)

Hamari technical support team **Venture Infotech Dispute Policy** ke mutaabiq is par turant action le rahi hai. Reference number: **${ticket.id}**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ticketRef: ticket.id,
    };
    setMessages((prev) => [...prev, confirmationMsg]);
  };

  // Conversational real-world client prompts
  const realisticPrompts = [
    "Sales executive ne daily thousands bola tha, kya jhoot bola?",
    "Mera ad chal raha hai par sales nahi aa rahi, ad abhi OFF kar do!",
    "Mera phone disconnect hone par offline kyu bata raha hai?",
    "Sales nahi aayi toh main consumer court / police case karunga!",
    "Mujhe mera paisa wapas chahiye, refund karo!",
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 select-text overflow-hidden">
      
      {/* Mobile-First Header */}
      <header className="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2.5 z-30 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          
          {/* Executive & Brand Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Friendly Avatar with online badge */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-emerald-500/20">
                👩‍💼
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  Isha
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Support 24
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span>Venture Infotech Solution • Online</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Official Escalation Google Form Link */}
            <a
              href={ESCALATION_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300/40 text-xs font-bold flex items-center gap-1 hover:bg-amber-100 transition-colors"
              title="Official Dispute Escalation Form"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Dispute Form</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            {/* In-app Ticket Creator */}
            <button
              onClick={() => setIsEscalationOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
              title="Internal Support Ticket"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Ticket</span>
            </button>

            {customer && (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors"
                title={`${customer.name} - Profile Edit`}
              >
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            )}

            <button
              onClick={() => customer && initIshaGreeting(customer)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 text-xs transition-colors"
              title="Restart Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Support Chat View - Mobile First */}
      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col overflow-hidden px-2 sm:px-4 py-2">
        
        {/* Soft Sub-banner with IVR notice */}
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Dedicated IVR System • Structured Dispute Resolution Policy</span>
          </div>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[10px]">
            24/7 Verified
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              customerName={customer?.name}
              onSelectActionChip={(q) => handleSendMessage(q)}
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-1.5 px-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                ISHA
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-2xl shadow-xs">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Isha review kar rahi hain...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Realistic Quick Query Chips */}
        <div className="pt-2 pb-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {realisticPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-emerald-400/50 rounded-full text-xs text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Mobile-Friendly Chat Input Bar */}
        <div className="mt-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-1.5 flex items-center gap-1.5">
          
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            title={isListening ? 'Stop listening' : 'Boliye apna issue'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isListening
                ? 'Sun rahi hoon... boliye ji...'
                : 'Aapka sawal ya pareshani likhein...'
            }
            className="flex-1 bg-transparent px-2.5 py-1 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center shadow-sm shadow-emerald-700/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 flex-shrink-0"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Subtext */}
        <div className="mt-1 text-center text-[10px] text-slate-400">
          Venture Infotech Solution • Dispute Resolution & Anti-Harassment Compliance
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        initialProfile={customer || undefined}
        onComplete={handleProfileComplete}
        isEditing={Boolean(customer)}
        onClose={() => setIsLoginOpen(false)}
      />

      {/* Escalation Ticket Form */}
      {customer && (
        <EscalationModal
          isOpen={isEscalationOpen}
          onClose={() => setIsEscalationOpen(false)}
          customer={{ ...customer, plan: customer.plan || 'silver' }}
          onTicketCreated={handleTicketCreated}
        />
      )}

      {/* Ticket Tracking Drawer */}
      {customer && (
        <TicketListModal
          isOpen={isTicketListOpen}
          onClose={() => setIsTicketListOpen(false)}
          customer={{ ...customer, plan: customer.plan || 'silver' }}
          onOpenEscalation={() => setIsEscalationOpen(true)}
        />
      )}
    </div>
  );
}

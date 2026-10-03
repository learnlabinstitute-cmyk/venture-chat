/**
 * Audio helpers for Sweet Speech Synthesis (listening to bot) & Speech Recognition (speaking to bot)
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakSweetVoice(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown characters from speech
  const cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[#>`_~]/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  // Find a sweet, pleasant voice (Hindi or Indian English or soft female voice)
  const voices = window.speechSynthesis.getVoices();
  const sweetVoice =
    voices.find((v) => v.lang.includes('hi') || v.lang.includes('HI')) ||
    voices.find((v) => v.name.includes('Natural') || v.name.includes('Sweet') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('India')) ||
    voices[0];

  if (sweetVoice) {
    utterance.voice = sweetVoice;
  }

  // Sweet gentle tone pitch & speed
  utterance.rate = 0.98;
  utterance.pitch = 1.05;

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

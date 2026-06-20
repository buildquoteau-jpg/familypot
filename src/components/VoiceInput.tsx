'use client';

import { useState, useRef, useCallback } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySpeechRecognition = any;

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
  });
  const recognitionRef = useRef<AnySpeechRecognition>(null);

  const startListening = useCallback(() => {
    if (!isSupported || isListening || disabled) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechRecognitionClass = w.SpeechRecognition || w.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognitionRef.current = recognition;

    recognition.lang = 'en-AU';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: AnySpeechRecognition) => {
      const transcript = event.results[0][0].transcript as string;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }, [isSupported, isListening, disabled, onTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onPointerDown={startListening}
      onPointerUp={isListening ? stopListening : undefined}
      disabled={disabled}
      aria-label={isListening ? 'Listening... tap to stop' : 'Tap to speak'}
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        border: 'none',
        background: isListening ? '#E06010' : '#E8D4A8',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        transition: 'background 0.2s, transform 0.1s',
        transform: isListening ? 'scale(1.08)' : 'scale(1)',
        boxShadow: isListening
          ? '0 0 0 6px rgba(196,87,42,0.18), 0 4px 16px rgba(196,87,42,0.3)'
          : '0 2px 8px rgba(61,43,31,0.15)',
      }}
    >
      {isListening && (
        <span
          className="voice-pulse"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
      )}
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isListening ? '#fff' : '#5D4033'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0014 0" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
    </button>
  );
}

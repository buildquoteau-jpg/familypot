'use client';

import { useState, useRef, useCallback } from 'react';
import { useFamilyData } from '@/lib/context';
import { parseSpendText } from '@/lib/categorizer';
import VoiceInput from './VoiceInput';

export default function SpendEntry() {
  const { data, addSpend } = useFamilyData();
  const [input, setInput] = useState('');
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const activeEnvelopes = data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney)
    .sort((a, b) => a.order - b.order);

  const parsed = input.trim() ? parseSpendText(input, activeEnvelopes) : null;

  const effectiveEnvelopeId = selectedEnvelopeId ||
    (parsed?.suggestedEnvelopeName
      ? activeEnvelopes.find(e => e.name === parsed.suggestedEnvelopeName)?.id ?? ''
      : '');

  const handleVoiceTranscript = useCallback((text: string) => {
    setInput(text);
    setSelectedEnvelopeId('');
    setError('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!parsed || parsed.amount <= 0) {
      setError('Enter an amount and description, e.g. "$42 petrol"');
      return;
    }
    if (!effectiveEnvelopeId) {
      setError('Choose an envelope for this spend');
      return;
    }

    addSpend(effectiveEnvelopeId, parsed.amount, parsed.description || input);
    setInput('');
    setSelectedEnvelopeId('');
    setError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    inputRef.current?.focus();
  }, [parsed, effectiveEnvelopeId, addSpend, input]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Prompt */}
      <div style={{ marginBottom: 20, paddingTop: 8 }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.65rem',
          fontWeight: 700,
          color: '#3D2B1F',
          lineHeight: 1.25,
          margin: 0,
        }}>
          What did we spend?
        </h2>
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '0.88rem',
          color: '#8B6B55',
          margin: '6px 0 0',
        }}>
          Type an amount and what it was for
        </p>
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <input
          ref={inputRef}
          type="text"
          className="pot-input"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setSelectedEnvelopeId('');
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="$42 petrol"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          style={{ flex: 1 }}
        />
        <VoiceInput onTranscript={handleVoiceTranscript} />
      </div>

      {/* Parsed amount preview */}
      {parsed && parsed.amount > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
          fontFamily: 'Nunito, sans-serif',
          fontSize: '0.9rem',
          color: '#5D4033',
          animation: 'fadeIn 0.2s ease',
        }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#3D2B1F' }}>
            ${parsed.amount.toFixed(2)}
          </span>
          {parsed.description && (
            <span style={{ color: '#8B6B55' }}>— {parsed.description}</span>
          )}
        </div>
      )}

      {/* Envelope selector */}
      {activeEnvelopes.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 8,
          }}>
            Envelope
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {activeEnvelopes.map(env => {
              const isSelected = env.id === effectiveEnvelopeId;
              const isSuggested = env.name === parsed?.suggestedEnvelopeName && !selectedEnvelopeId;
              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => setSelectedEnvelopeId(env.id === effectiveEnvelopeId && selectedEnvelopeId ? '' : env.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 9999,
                    border: isSelected ? `2px solid ${env.color}` : '2px solid #D4C4A0',
                    background: isSelected ? env.color : isSuggested ? 'rgba(196,87,42,0.07)' : '#F9F0DC',
                    color: isSelected ? '#fff' : '#3D2B1F',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? `0 2px 6px ${env.color}44` : 'none',
                  }}
                >
                  {env.name}
                  {isSuggested && !isSelected && (
                    <span style={{ fontSize: '0.7rem', marginLeft: 4, opacity: 0.6 }}>auto</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          color: '#B84C08',
          fontFamily: 'Nunito, sans-serif',
          fontSize: '0.88rem',
          marginBottom: 12,
          fontWeight: 600,
        }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!input.trim() || saved}
        style={{ marginBottom: 8 }}
      >
        {saved ? 'Added' : 'Add Spend'}
      </button>

      {saved && (
        <div style={{
          textAlign: 'center',
          fontFamily: 'Nunito, sans-serif',
          fontSize: '0.88rem',
          color: '#6B7A36',
          fontWeight: 700,
          marginTop: 8,
          animation: 'fadeIn 0.2s ease',
        }}>
          Recorded
        </div>
      )}
    </div>
  );
}

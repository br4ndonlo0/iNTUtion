'use client';

import { useEffect, useRef } from 'react';
import { useVoice } from '@/context/VoiceContext';

interface VoiceInputProps {
  id: string;
  type?: 'text' | 'password';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  fieldName: 'username' | 'password' | 'confirm' | 'search' | 'amount';
}

export function VoiceInput({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  fieldName,
}: VoiceInputProps) {
  const { voiceState, pendingFieldValue, clearPendingValue } = useVoice();
  const inputRef = useRef<HTMLInputElement>(null);

  const isTargeted = voiceState.targetField === fieldName;
  const isListening = voiceState.isListening && isTargeted;

  // When voice command targets this field, apply the value
  useEffect(() => {
    if (pendingFieldValue && pendingFieldValue.field === fieldName) {
      onChange(pendingFieldValue.value);
      clearPendingValue();
      
      // Focus the input after voice input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [pendingFieldValue, fieldName, onChange, clearPendingValue]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 border-2 rounded-lg transition-all ${
          isListening
            ? 'border-green-500 bg-green-50 ring-4 ring-green-200'
            : 'border-gray-300 focus:border-blue-500'
        }`}
      />
      {isListening && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="flex items-center gap-2">
            <div className="animate-pulse flex gap-1">
              <div className="w-1 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm font-semibold text-green-600">Listening...</span>
          </div>
        </div>
      )}
    </div>
  );
}

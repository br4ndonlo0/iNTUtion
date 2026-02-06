"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 1. DEFINE THE NEW SHAPE (Adding recipient & amount)
interface VoiceState {
  isListening: boolean;
  transcript: string;
  // 👇 These were missing in your log!
  recipient?: string; 
  amount?: string;
  field?: string;
  value?: string;
  // Allow dynamic fields just in case
  [key: string]: any;
  recipient?: string; // For transfer target
  amount?: string;    // For transfer amount
  field?: string;     // For generic fields
  value?: string;     // For generic values
}

// 2. DEFINE ACTIONS
type VoiceAction =
  | { type: 'START_LISTENING' }
  | { type: 'STOP_LISTENING' }
  | { type: 'SET_TRANSCRIPT'; payload: string }
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'CLEAR_FIELDS' };

// 3. INITIAL STATE
const initialVoiceState: VoiceState = {
  isListening: false,
  transcript: '',
  recipient: '',
  amount: '',
};

// 4. THE REDUCER (The Logic)
function voiceReducer(state: VoiceState, action: VoiceAction): VoiceState {
  switch (action.type) {
    case 'START_LISTENING':
      return { ...state, isListening: true };
    case 'STOP_LISTENING':
      return { ...state, isListening: false };
    case 'SET_TRANSCRIPT':
      return { ...state, transcript: action.payload };
      
    // 👇 THIS IS THE CRITICAL PART
    case 'SET_FIELD':
      console.log(`[VoiceContext] 💾 Saving: ${action.field} = ${action.value}`);
      return {
        ...state,
        [action.field]: action.value, // dynamically saves 'recipient' or 'amount'
      };

    case 'CLEAR_FIELDS':
      return initialVoiceState;
      
    default:
      return state;
  }
}

// 5. CREATE CONTEXT
const VoiceContext = createContext<{
  voiceState: VoiceState;
  isListening: boolean;
  toggleListening: () => void;
  setFieldValue: (field: string, value: string) => void;
  resetTranscript: () => void;
  clearPendingValue: () => void; // Added for compatibility
  pendingFieldValue: any; // Added for compatibility
} | undefined>(undefined);

// 6. PROVIDER COMPONENT
export function VoiceProvider({ children }: { children: ReactNode }) {
  const [voiceState, dispatch] = useReducer(voiceReducer, initialVoiceState);

  const toggleListening = () => {
    dispatch({ type: voiceState.isListening ? 'STOP_LISTENING' : 'START_LISTENING' });
  };

  const setFieldValue = (field: string, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const resetTranscript = () => {
    dispatch({ type: 'SET_TRANSCRIPT', payload: '' });
  };
  
  // Helper to clear fields (optional, but good for cleanup)
  const clearPendingValue = () => {
     dispatch({ type: 'CLEAR_FIELDS' });
  };

  return (
    <VoiceContext.Provider value={{ 
      voiceState, 
      isListening: voiceState.isListening, 
      toggleListening, 
      setFieldValue,
      resetTranscript,
      // Mapping these to keep your other pages happy
      clearPendingValue,
      pendingFieldValue: null 
    }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) throw new Error('useVoice must be used within a VoiceProvider');
  return context;
}
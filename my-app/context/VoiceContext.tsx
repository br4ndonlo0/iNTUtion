'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';

// 1. DEFINE THE NEW STATE SHAPE
// This allows the AI to inject data directly into your app
interface VoiceState {
  isListening: boolean;
  transcript: string;
  recipient?: string; // For transfer target
  amount?: string;    // For transfer amount
  field?: string;     // For generic fields
  value?: string;     // For generic values
  // Allow dynamic fields so the AI can fill anything
  [key: string]: any; 
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
  field: '',
  value: '',
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
      
    // 👇 THIS IS THE MAGIC PART
    // It takes whatever the AI gives (e.g., 'recipient', 'amount') and saves it
    case 'SET_FIELD':
      console.log(`[VoiceContext] 💾 Saving: ${action.field} = ${action.value}`);
      return {
        ...state,
        [action.field]: action.value,
        // Also save to field/value for pendingFieldValue
        field: action.field,
        value: action.value,
      };

    case 'CLEAR_FIELDS':
      // Only clear the field/value pair used by pendingFieldValue
      // Keep other data like isListening, transcript, recipient, amount
      return {
        ...state,
        field: '',
        value: '',
      };
      
    default:
      return state;
  }
}

// 5. DEFINE CONTEXT TYPE
interface VoiceContextType {
  voiceState: VoiceState;
  isListening: boolean;
  toggleListening: () => void;
  setFieldValue: (field: string, value: string) => void;
  resetTranscript: () => void;
  // Legacy stubs to prevent crashes
  processVoiceCommand: (cmd: string) => void;
  pendingFieldValue: any;
  clearPendingValue: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

// 6. PROVIDER COMPONENT
export function VoiceProvider({ children }: { children: ReactNode }) {
  const [voiceState, dispatch] = useReducer(voiceReducer, initialVoiceState);

  const toggleListening = useCallback(() => {
    dispatch({ type: voiceState.isListening ? 'STOP_LISTENING' : 'START_LISTENING' });
  }, [voiceState.isListening]);

  // The AI Hook uses this to save data
  const setFieldValue = useCallback((field: string, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const resetTranscript = useCallback(() => {
    dispatch({ type: 'SET_TRANSCRIPT', payload: '' });
  }, []);

  // Legacy stub: We don't need manual command processing anymore
  const processVoiceCommand = useCallback((cmd: string) => {
    console.log("[VoiceContext] Legacy command received (ignored):", cmd);
  }, []);

  const clearPendingValue = useCallback(() => {
    dispatch({ type: 'CLEAR_FIELDS' });
  }, []);

  // Create pendingFieldValue from voiceState
  const pendingFieldValue = (voiceState.field && voiceState.value) 
    ? { field: voiceState.field, value: voiceState.value }
    : null;

  return (
    <VoiceContext.Provider value={{ 
      voiceState, 
      isListening: voiceState.isListening, 
      toggleListening, 
      setFieldValue,
      resetTranscript,
      processVoiceCommand, 
      pendingFieldValue, 
      clearPendingValue
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
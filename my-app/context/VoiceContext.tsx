'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { VoiceState, VoiceCommand, GestureType, CommandContext, InputMode } from '@/types/commands';

interface VoiceContextType {
  voiceState: VoiceState;
  processVoiceCommand: (command: string, transcript?: string) => void;
  processGesture: (gesture: GestureType) => void;
  setFieldValue: (field: string, value: string) => void;
  pendingFieldValue: { field: string; value: string } | null;
  clearPendingValue: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

const INITIAL_STATE: VoiceState = {
  mode: 'idle',
  targetField: null,
  lastCommand: null,
  isListening: false,
  transcript: '',
};

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [voiceState, setVoiceState] = useState<VoiceState>(INITIAL_STATE);
  const [pendingFieldValue, setPendingFieldValue] = useState<{ field: string; value: string } | null>(null);
  const pendingListeningRef = useRef<{ field: string; targetField: 'username' | 'password' | 'confirm' | 'search' | 'amount' | 'navigate' | null; command: VoiceCommand } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const getCommandContext = useCallback((): CommandContext => {
    return {
      currentPath: pathname,
      isAuthPage: pathname === '/login' || pathname === '/register',
      isTransferPage: pathname === '/transfer',
      isTransferDetailPage: pathname.startsWith('/transfer/') && pathname !== '/transfer',
    };
  }, [pathname]);

  const setFieldValue = useCallback((field: string, value: string) => {
    setPendingFieldValue({ field, value });
  }, []);

  const clearPendingValue = useCallback(() => {
    setPendingFieldValue(null);
  }, []);

  const processVoiceCommand = useCallback((commandText: string, transcript?: string) => {
    const command = commandText.toLowerCase() as VoiceCommand;
    const context = getCommandContext();

    console.log('[VOICE] ========== COMMAND RECEIVED ==========');
    console.log('[VOICE] Command:', command);
    console.log('[VOICE] Transcript:', transcript);
    console.log('[VOICE] Current Context:', context);
    console.log('[VOICE] Pending Listening State:', pendingListeningRef.current);

    // If we have a pending listening state OR current mode is listening_for_value, capture the input
    const listeningField = pendingListeningRef.current?.targetField || (voiceState.mode === 'listening_for_value' ? voiceState.targetField : null);
    
    if (listeningField && !['username', 'password', 'confirm', 'home', 'account', 'settings', 'transfer', 'search', 'navigate'].includes(command)) {
      // This is a value input, not a command
      const value = transcript || commandText;
      console.log('[VOICE] 🎯 LISTENING MODE - Capturing value for field:', listeningField);
      console.log('[VOICE] 📝 Captured value:', value);
      
      // Special handling for navigate target
      if (listeningField === 'navigate') {
        const target = value.toLowerCase();
        console.log('[VOICE] 🔀 NAVIGATE target:', target);
        console.log('[VOICE] 📍 Current path:', context.currentPath);
        
        if (target === 'settings') {
          console.log('[VOICE] ✅ NAVIGATE → /settings');
          router.push('/settings');
        } else if (target === 'transfer') {
          console.log('[VOICE] ✅ NAVIGATE → /transfer');
          router.push('/transfer');
        } else if (target === 'account') {
          console.log('[VOICE] ✅ NAVIGATE → /account');
          router.push('/account');
        } else if (target === 'home') {
          if (context.isAuthPage) {
            console.log('[VOICE] ✅ NAVIGATE → / (auth page detected)');
            router.push('/');
          } else {
            console.log('[VOICE] ✅ NAVIGATE → /home (logged in)');
            router.push('/home');
          }
        } else if (target === 'history') {
          console.log('[VOICE] ✅ NAVIGATE → /history');
          router.push('/history');
        } else {
          console.log('[VOICE] ⚠️  Unknown navigate target: "' + target + '" (expected: settings, transfer, account, home, history)');
        }
      } else {
        setFieldValue(listeningField, value);
      }
      
      setVoiceState(INITIAL_STATE);
      pendingListeningRef.current = null;
      return;
    }

    // Process commands
    switch (command) {
      case 'username':
        console.log('[VOICE] ✅ USERNAME command - Setting up listening mode');
        pendingListeningRef.current = { field: 'username', targetField: 'username', command: 'username' };
        setVoiceState({
          mode: 'listening_for_value',
          targetField: 'username',
          lastCommand: 'username',
          isListening: true,
          transcript: '',
        });
        break;

      case 'password':
        console.log('[VOICE] ✅ PASSWORD command - Setting up listening mode');
        pendingListeningRef.current = { field: 'password', targetField: 'password', command: 'password' };
        setVoiceState({
          mode: 'listening_for_value',
          targetField: 'password',
          lastCommand: 'password',
          isListening: true,
          transcript: '',
        });
        break;

      case 'confirm':
        if (context.isAuthPage) {
          console.log('[VOICE] ✅ CONFIRM command - On auth page, listening for confirm password');
          // On auth pages, "confirm" sets up listening for confirm password
          pendingListeningRef.current = { field: 'confirm', targetField: 'confirm', command: 'confirm' };
          setVoiceState({
            mode: 'listening_for_value',
            targetField: 'confirm',
            lastCommand: 'confirm',
            isListening: true,
            transcript: '',
          });
        } else if (context.isTransferDetailPage && voiceState.lastCommand === 'transfer') {
          console.log('[VOICE] ✅ CONFIRM command - On transfer detail page, confirming transaction');
          // On transfer detail page after setting amount, confirm transaction
          setFieldValue('confirm_transaction', 'true');
          setVoiceState(INITIAL_STATE);
          pendingListeningRef.current = null;
        } else {
          console.log('[VOICE] ⚠️  CONFIRM command - Not in applicable context');
        }
        break;

      case 'home':
        console.log('[VOICE] ✅ HOME command');
        if (context.isAuthPage) {
          console.log('[VOICE] 🔀 Redirecting to / (auth page detected)');
          router.push('/');
        } else {
          console.log('[VOICE] 🔀 Redirecting to /home');
          router.push('/home');
        }
        setVoiceState(INITIAL_STATE);
        pendingListeningRef.current = null;
        break;

      case 'account':
        console.log('[VOICE] ✅ ACCOUNT command - Redirecting to /account');
        router.push('/account');
        setVoiceState(INITIAL_STATE);
        pendingListeningRef.current = null;
        break;

      case 'settings':
        console.log('[VOICE] ✅ SETTINGS command - Redirecting to /settings');
        router.push('/settings');
        setVoiceState(INITIAL_STATE);
        pendingListeningRef.current = null;
        break;

      case 'transfer':
        if (context.isTransferDetailPage) {
          console.log('[VOICE] ✅ TRANSFER command - On transfer detail page, listening for amount');
          // On transfer detail page, listen for amount
          pendingListeningRef.current = { field: 'amount', targetField: 'amount', command: 'transfer' };
          setVoiceState({
            mode: 'listening_for_value',
            targetField: 'amount',
            lastCommand: 'transfer',
            isListening: true,
            transcript: '',
          });
        } else {
          console.log('[VOICE] ✅ TRANSFER command - Redirecting to /transfer');
          // Navigate to transfer page
          router.push('/transfer');
          setVoiceState(INITIAL_STATE);
          pendingListeningRef.current = null;
        }
        break;

      case 'search':
        if (context.isTransferPage) {
          console.log('[VOICE] ✅ SEARCH command - On transfer page, listening for account/phone');
          // Listen for account number/phone to search
          pendingListeningRef.current = { field: 'search', targetField: 'search', command: 'search' };
          setVoiceState({
            mode: 'listening_for_value',
            targetField: 'search',
            lastCommand: 'search',
            isListening: true,
            transcript: '',
          });
        } else {
          console.log('[VOICE] ⚠️  SEARCH command - Not on transfer page, ignoring');
        }
        break;

      case 'navigate':
        console.log('[VOICE] ✅ NAVIGATE command - Listening for target destination');
        pendingListeningRef.current = { field: 'navigate', targetField: 'navigate', command: 'navigate' };
        setVoiceState({
          mode: 'listening_for_value',
          targetField: 'navigate',
          lastCommand: 'navigate',
          isListening: true,
          transcript: '',
        });
        break;

      default:
        console.log('[VOICE] ❌ UNKNOWN command:', command);
    }
    console.log('[VOICE] ========== END COMMAND ==========');
  }, [voiceState, getCommandContext, router, setFieldValue]);

  const processGesture = useCallback((gesture: GestureType) => {
    console.log('[GESTURE] ========== GESTURE DETECTED ==========');
    console.log('[GESTURE] Gesture type:', gesture);
    console.log('[GESTURE] Current VoiceState:', voiceState);
    
    // You can map gestures to actions here
    switch (gesture) {
      case 'Thumb_Up':
        // Confirm current action
        if (voiceState.mode === 'listening_for_value') {
          // Submit the current field
          console.log('[GESTURE] 👍 Thumb_Up - Confirming field input for:', voiceState.targetField);
        }
        break;
      
      case 'Thumb_Down':
        // Cancel current action
        console.log('[GESTURE] 👎 Thumb_Down - Cancelling current action');
        setVoiceState(INITIAL_STATE);
        setPendingFieldValue(null);
        break;

      case 'Open_Palm':
        // Go back
        console.log('[GESTURE] ✋ Open_Palm - Going back');
        router.back();
        break;

      case 'Victory':
        // Toggle something (example: toggle voice mode)
        console.log('[GESTURE] ✌️  Victory - Toggling mode');
        break;

      default:
        console.log('[GESTURE] ⚠️  Unknown gesture:', gesture);
      // Add more gesture mappings as needed
    }
    console.log('[GESTURE] ========== END GESTURE ==========');
  }, [voiceState, router]);

  return (
    <VoiceContext.Provider
      value={{
        voiceState,
        processVoiceCommand,
        processGesture,
        setFieldValue,
        pendingFieldValue,
        clearPendingValue,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}

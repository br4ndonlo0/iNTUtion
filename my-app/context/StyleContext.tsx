'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AccessibilityProfile, DEFAULT_PROFILE } from '../types/accessibility';

interface StyleContextType {
  styleSettings: AccessibilityProfile;
  updateSettings: (profile: AccessibilityProfile) => void;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export function StyleProvider({ children }: { children: ReactNode }) {
  const [styleSettings, setStyleSettings] = useState<AccessibilityProfile>(DEFAULT_PROFILE);

  const updateSettings = useCallback((profile: AccessibilityProfile) => {
    setStyleSettings(profile);
  }, []);

  return (
    <StyleContext.Provider value={{ styleSettings, updateSettings }}>
      {children}
    </StyleContext.Provider>
  );
}

export function useStyle() {
  const context = useContext(StyleContext);
  if (context === undefined) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
}

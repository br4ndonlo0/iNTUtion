'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface TranslationContextType {
  currentLanguageCode: string;
  setLanguage: (lang: string) => void;
  setLanguageByCode: (code: string) => void;
  translate: (text: string, targetLang: string) => Promise<string>;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const LANGUAGE_MAP: { [key: string]: string } = {
  'en': 'en',
  'english': 'en',
  'es': 'es',
  'spanish': 'es',
  'fr': 'fr',
  'french': 'fr',
  'de': 'de',
  'german': 'de',
  'it': 'it',
  'italian': 'it',
  'pt': 'pt',
  'portuguese': 'pt',
  'ru': 'ru',
  'russian': 'ru',
  'ja': 'ja',
  'japanese': 'ja',
  'zh': 'zh-CN',
  'chinese': 'zh-CN',
  'zh-CN': 'zh-CN',
  'ar': 'ar',
  'arabic': 'ar',
  'hi': 'hi',
  'hindi': 'hi',
  'ko': 'ko',
  'korean': 'ko',
  'ms': 'ms',
  'melayu': 'ms',
};

const LANGUAGE_CODES: { [key: string]: string } = {
  'en': 'en',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'pt': 'pt',
  'ru': 'ru',
  'ja': 'ja',
  'zh-CN': 'zh-CN',
  'ar': 'ar',
  'hi': 'hi',
  'ko': 'ko',
  'ms': 'ms',
};

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguageCode, setCurrentLanguageCode] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const translationCache = React.useRef<{ [key: string]: string }>({});
  const pendingRequests = React.useRef<{ [key: string]: Promise<string> }>({});
  const REQUEST_TIMEOUT = 5000; // 5 second timeout

  const translate = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'en' || !text) return text;

    const cacheKey = `${text}|${targetLang}`;
    
    // Return cached result immediately
    if (translationCache.current[cacheKey]) {
      return translationCache.current[cacheKey];
    }

    // Return pending request if already in progress (avoid duplicate requests)
    if (pendingRequests.current[cacheKey]) {
      return pendingRequests.current[cacheKey];
    }

    setIsTranslating(true);

    // Create the promise for this request
    const requestPromise = (async () => {
      try {
        const langCode = LANGUAGE_CODES[targetLang] || targetLang;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langCode}&de=yixuanchay@gmail.com`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.responseStatus === 200) {
          const translatedText = data.responseData.translatedText;
          translationCache.current[cacheKey] = translatedText;
          return translatedText;
        }
        
        return text;
      } catch (error) {
        // Silently fail and return original text
        console.warn('Translation failed, using original text:', error);
        return text;
      } finally {
        setIsTranslating(false);
        delete pendingRequests.current[cacheKey];
      }
    })();

    pendingRequests.current[cacheKey] = requestPromise;
    return requestPromise;
  }, []);

  const handleSetLanguage = useCallback((lang: string) => {
    const normalized = lang.toLowerCase();
    const langCode = LANGUAGE_MAP[normalized];
    if (langCode) {
      setCurrentLanguageCode(langCode);
      // Update HTML lang attribute
      if (typeof document !== 'undefined') {
        document.documentElement.lang = langCode;
      }
    }
  }, []);

  const handleSetLanguageByCode = useCallback((code: string) => {
    setCurrentLanguageCode(code);
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
    }
  }, []);

  return (
    <TranslationContext.Provider
      value={{
        currentLanguageCode,
        setLanguage: handleSetLanguage,
        setLanguageByCode: handleSetLanguageByCode,
        translate,
        isTranslating,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

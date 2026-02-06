'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/context/TranslationContext';

interface TranslateProps {
  children: string;
  className?: string;
}

export function T({ children, className }: TranslateProps) {
  const { currentLanguageCode, translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (currentLanguageCode === 'en') {
      setTranslatedText(children);
    } else {
      translate(children, currentLanguageCode).then(setTranslatedText);
    }
  }, [children, currentLanguageCode, translate]);

  return <span className={className}>{translatedText}</span>;
}

// For use in Next.js metadata and other non-component contexts
export function useTranslatedText(text: string) {
  const { currentLanguageCode, translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (currentLanguageCode === 'en') {
      setTranslatedText(text);
    } else {
      translate(text, currentLanguageCode).then(setTranslatedText);
    }
  }, [text, currentLanguageCode, translate]);

  return translatedText;
}

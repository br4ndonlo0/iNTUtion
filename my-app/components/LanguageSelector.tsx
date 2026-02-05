'use client';

import React from 'react';
import { useTranslation } from '@/context/TranslationContext';

export function LanguageButtons() {
  const { currentLanguageCode, setLanguageByCode } = useTranslation();

  return (
    <div className="fixed top-4 left-4 flex gap-2 z-50" style={{ pointerEvents: "auto" }}>
      {/* ENGLISH BUTTON */}
      <button
        onClick={() => setLanguageByCode('en')}
        className={`px-4 py-2 rounded font-bold shadow-md hover:scale-105 transition-all ${
          currentLanguageCode === 'en'
            ? "bg-blue-600 text-white ring-2 ring-blue-300"
            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
        }`}
        style={{ minWidth: '80px' }}
      >
        ENG 🇸🇬
      </button>

      {/* CHINESE BUTTON */}
      <button
        onClick={() => setLanguageByCode('zh-CN')}
        className={`px-4 py-2 rounded font-bold shadow-md hover:scale-105 transition-all ${
          currentLanguageCode === 'zh-CN'
            ? "bg-red-600 text-white ring-2 ring-red-300"
            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
        }`}
        style={{ minWidth: '80px' }}
      >
        中文
      </button>

      {/* MALAY BUTTON */}
      <button
        onClick={() => setLanguageByCode('ms')}
        className={`px-4 py-2 rounded font-bold shadow-md hover:scale-105 transition-all ${
          currentLanguageCode === 'ms'
            ? "bg-yellow-600 text-white ring-2 ring-yellow-300"
            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
        }`}
        style={{ minWidth: '80px' }}
      >
        MELAYU
      </button>
    </div>
  );
}

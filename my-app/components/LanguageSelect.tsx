'use client';

import React from 'react';

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function LanguageSelect({ value, onChange, label = "Preferred Language" }: LanguageSelectProps) {
  const languages = [
    { code: 'en', name: 'English 🇸🇬' },
    { code: 'zh-CN', name: 'Chinese (中文)' },
    { code: 'ms', name: 'Malay (Bahasa Melayu)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'it', name: 'Italian (Italiano)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'ko', name: 'Korean (한국어)' },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 py-3 px-4 text-slate-900 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none transition"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

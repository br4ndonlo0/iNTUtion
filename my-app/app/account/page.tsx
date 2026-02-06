'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/TranslationContext";
import { T } from "@/components/Translate";

export default function AccountPage() {
  const router = useRouter();
  const { currentLanguageCode, setLanguageByCode } = useTranslation();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("Not available");
  const [userPhoneNumber, setUserPhoneNumber] = useState("Not available");
  const [userBalance, setUserBalance] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguageCode);
  const [loading, setLoading] = useState(true);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'zh-CN', name: '中文' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ko', name: '한국어' },
    { code: 'ms', name: 'Bahasa Melayu' },
  ];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        
        if (res.ok) {
          const data = await res.json();
          setUserName(data.user.name);
          setUserEmail(data.user.email);
          setUserPhoneNumber(data.user.phoneNumber || "Not available");
          setUserBalance(data.user.balance);
          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(data.user));
          setLoading(false);
        } else {
          console.log('Session expired or invalid');
          localStorage.removeItem("user");
          router.push('/login');
        }
      } catch (error) {
        console.error("Auth check failed", error);
        localStorage.removeItem("user");
        router.push('/login');
      }
    };

    checkSession();
    setSelectedLanguage(currentLanguageCode);
  }, [currentLanguageCode, router]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    setLanguageByCode(newLanguage);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem("user");
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-500 animate-pulse">Loading secure data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#C8102E] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">←</span>
            <span className="text-sm font-medium"><T>Dashboard</T></span>
          </Link>
          <h1 className="text-2xl font-bold"><T>Bank Buddy</T></h1>
          <span className="text-sm"><T>Account</T></span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2"><T>Your Profile</T></h2>
          <p className="text-slate-700 mb-4">
            <T>Review your account details and manage security.</T>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500"><T>Name</T></p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{userName}</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500"><T>Email</T></p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{userEmail}</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500"><T>Phone</T></p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{userPhoneNumber}</p>
            </div>
            <div className="border border-[#C8102E]/20 rounded-lg p-4 bg-[#C8102E]/5">
              <p className="text-xs uppercase tracking-wide text-[#C8102E] font-semibold"><T>Account Balance</T></p>
              <p className="text-lg font-bold text-[#C8102E] mt-1">${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2"><T>Security</T></h3>
            <p className="text-sm text-slate-700 mb-4">
              <T>Update your password and keep your account safe.</T>
            </p>
            <Link
              href="/change_pass"
              className="block w-full text-center rounded-lg bg-[#C8102E] py-2 text-white hover:bg-[#A50D26] transition"
            >
              <T>Change password</T>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2"><T>Preferences</T></h3>
            <p className="text-sm text-slate-700 mb-4">
              <T>Select your preferred language for the application.</T>
            </p>
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2"><T>Session</T></h3>
            <p className="text-sm text-slate-700 mb-4">
              <T>Sign out of your account on this device.</T>
            </p>
            <button
              type="button"
              className="w-full text-center rounded-lg border border-slate-300 py-2 text-slate-800 hover:bg-slate-50 transition"
              onClick={handleLogout}
            >
              <T>Log out</T>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 text-center px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            <T>Back to Dashboard</T>
          </Link>
        </div>
      </main>
      <SilverTellerHub screenName="Account" />
    </div>
  );
}

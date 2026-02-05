'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { T } from "@/components/Translate";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useTranslation } from "@/context/TranslationContext";

export default function AccountPage() {
  const router = useRouter();
  const { setLanguageByCode } = useTranslation();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("Not available");
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || user.username || "User");
      setUserEmail(user.email || "Not available");
      setPreferredLanguage(user.preferredLanguage || "en");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "http://localhost:3000";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#C8102E] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold"><T>Bank Buddy</T></h1>
          <span className="text-sm">Account</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Your Profile</h2>
          <p className="text-slate-700 mb-4">
            Review your account details and manage security.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{userName}</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{userEmail}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Security</h3>
            <p className="text-sm text-slate-700 mb-4">
              Update your password and keep your account safe.
            </p>
            <Link
              href="/change_pass"
              className="block w-full text-center rounded-lg bg-[#C8102E] py-2 text-white hover:bg-[#A50D26] transition"
            >
              Change password
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Language</h3>
            <p className="text-sm text-slate-700 mb-4">
              Choose your preferred language for the application.
            </p>
            <LanguageSelect
              value={preferredLanguage}
              onChange={(lang) => {
                setPreferredLanguage(lang);
                setLanguageByCode(lang);
                // Update stored user preference
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                  const user = JSON.parse(storedUser);
                  user.preferredLanguage = lang;
                  localStorage.setItem("user", JSON.stringify(user));
                }
              }}
              label=""
            />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Session</h3>
            <p className="text-sm text-slate-700 mb-4">
              Sign out of your account on this device.
            </p>
            <button
              type="button"
              className="w-full text-center rounded-lg border border-slate-300 py-2 text-slate-800 hover:bg-slate-50 transition"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 text-center px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

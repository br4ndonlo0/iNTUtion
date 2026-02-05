'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("Not available");
  const [userPhoneNumber, setUserPhoneNumber] = useState("Not available");
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || user.username || "User");
      setUserEmail(user.email || "Not available");
      setUserPhoneNumber(user.phoneNumber || user.phone || "Not available");
      setUserBalance(user.balance || 0);
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
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">←</span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold">Bank Buddy</h1>
          <span className="text-sm">Account</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Your Profile</h2>
          <p className="text-slate-700 mb-4">
            Review your account details and manage security.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{userName}</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{userEmail}</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{userPhoneNumber}</p>
            </div>
            <div className="border border-[#C8102E]/20 rounded-lg p-4 bg-[#C8102E]/5">
              <p className="text-xs uppercase tracking-wide text-[#C8102E] font-semibold">Account Balance</p>
              <p className="text-lg font-bold text-[#C8102E] mt-1">${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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

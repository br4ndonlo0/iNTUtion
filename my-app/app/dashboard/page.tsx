'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { T } from '@/components/Translate';
import SilverTellerHub from '../components/SilverTellerHub';
import { useHandleAiResponse } from "@/hooks/useHandleAiResponse";

export default function Dashboard() {
  const router = useRouter();
  const handleAiResponse = useHandleAiResponse();
  const [userName, setUserName] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    amount: number;
    type: 'sent' | 'received';
    senderName: string;
    recipientName: string;
    createdAt: string;
    status: string;
  }>>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        
        if (res.ok) {
          const data = await res.json();
          // The server says we are logged in!
          setUserName(data.user.name);
          setUserBalance(data.user.balance);
          setLoading(false);
        } else {
          // The server says 401 (Unauthorized)
          console.log('Session expired or invalid');
          router.push('/login');
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.push('/login');
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/transactions?limit=5');
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    checkSession();
    fetchTransactions();
  }, [router]);

  const userInitial = (userName || 'U').charAt(0).toUpperCase();

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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <SilverTellerHub screenName="Dashboard" />
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-[#C8102E]">Bank Buddy</Link>
            <p className="text-sm text-gray-500">Today ▾</p>
          </div>

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-3 py-2"
              onClick={() => setProfileOpen((open) => !open)}
            >
              <div className="w-9 h-9 rounded-full bg-[#C8102E] text-white flex items-center justify-center font-semibold">
                {userInitial}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">{userName || 'User'}</p>
                <p className="text-xs text-gray-500"><T>Profile</T></p>
              </div>
              <span className="text-gray-500">▾</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-sm z-20">
                <Link
                  href="/account"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
                  onClick={() => setProfileOpen(false)}
                >
                  <T>View Profile</T>
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setProfileOpen(false)}
                >
                  <T>Settings</T>
                </Link>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm text-[#C8102E] hover:bg-gray-50 rounded-b-xl"
                  onClick={handleLogout}
                >
                  <T>Log out</T>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl p-8 border-2 border-[#C8102E] shadow-lg">
            <p className="text-sm font-semibold text-[#C8102E] mb-2 uppercase tracking-wide">Your Account Balance</p>
            <p className="text-5xl font-bold text-[#C8102E]">${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm text-green-600 mt-3 font-medium">+11.01% from last month ↗</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/transfer"
              className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#C8102E] rounded-xl hover:bg-[#C8102E] hover:text-white transition-all group shadow-sm"
            >
              <svg className="w-12 h-12 mb-3 text-[#C8102E] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-lg">Transfer Money</span>
              <span className="text-sm text-gray-500 group-hover:text-white/80 mt-1">Send funds to others</span>
            </Link>
            <button
              className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all cursor-not-allowed opacity-60 shadow-sm"
              disabled
            >
              <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="font-semibold text-lg text-gray-600">Request Money</span>
              <span className="text-sm text-gray-400 mt-1">Coming soon</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4"><T>Recent Transactions</T></h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loadingTransactions ? (
              <div className="p-8 text-center">
                <p className="text-gray-500"><T>Loading transactions...</T></p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 font-medium"><T>No transactions yet</T></p>
                <p className="text-sm text-gray-400 mt-2"><T>Your transfers will appear here</T></p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <div key={txn.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          txn.type === 'sent' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {txn.type === 'sent' ? (
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {txn.type === 'sent' ? (
                              <><T>Sent to</T> {txn.recipientName}</>
                            ) : (
                              <><T>Received from</T> {txn.senderName}</>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(txn.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          txn.type === 'sent' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {txn.type === 'sent' ? '-' : '+'}${txn.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{txn.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SilverTellerHub screenName="Dashboard" onAiAction={handleAiResponse}/>
    </div>
  );
}

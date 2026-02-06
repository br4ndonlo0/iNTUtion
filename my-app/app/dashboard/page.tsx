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

    checkSession();
  }, [router]);

  const userInitial = (userName || 'U').charAt(0).toUpperCase();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem("user");
    window.location.href = '/login';
  };

  const spendingCategories = [
    { name: 'Food & Dining', amount: 850, maxAmount: 1000, color: '#C8102E' },
    { name: 'Shopping', amount: 620, maxAmount: 1000, color: '#C8102E' },
    { name: 'Transport', amount: 340, maxAmount: 1000, color: '#C8102E' },
    { name: 'Utilities', amount: 280, maxAmount: 1000, color: '#C8102E' },
    { name: 'Entertainment', amount: 190, maxAmount: 1000, color: '#C8102E' },
    { name: 'Healthcare', amount: 150, maxAmount: 1000, color: '#C8102E' },
  ];

  const weeklyData = [
    { day: 'Mon', current: 1200, previous: 800 },
    { day: 'Tue', current: 1800, previous: 1200 },
    { day: 'Wed', current: 2400, previous: 2100 },
    { day: 'Thu', current: 5200, previous: 3800 },
    { day: 'Fri', current: 4100, previous: 4500 },
    { day: 'Sat', current: 3200, previous: 3000 },
    { day: 'Sun', current: 2800, previous: 2400 },
  ];

  const monthlySpending = [
    { category: 'Groceries', amount: 450 },
    { category: 'Dining', amount: 380 },
    { category: 'Shopping', amount: 520 },
    { category: 'Transport', amount: 280 },
    { category: 'Bills', amount: 620 },
    { category: 'Other', amount: 180 },
  ];

  const paymentTypes = [
    { type: 'Debit Card', percentage: 38.6, color: '#C8102E' },
    { type: 'Credit Card', percentage: 30.8, color: '#333' },
    { type: 'Bank Transfer', percentage: 22.5, color: '#666' },
    { type: 'Cash', percentage: 8.1, color: '#999' },
  ];

  const maxSpending = Math.max(...monthlySpending.map(s => s.amount));
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


        {/* Charts Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Line Chart */}
          <div className="col-span-3 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-6 mb-6">
              <h3 className="font-semibold text-gray-900">Weekly Transactions</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#C8102E]"></span>
                  This Week
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                  Last Week
                </span>
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 50}
                    x2="700"
                    y2={i * 50}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Previous week line (gray) */}
                <polyline
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  points={weeklyData.map((d, i) => 
                    `${i * 100 + 50},${200 - (d.previous / 60)}`
                  ).join(' ')}
                />
                
                {/* Current week line (red) */}
                <polyline
                  fill="none"
                  stroke="#C8102E"
                  strokeWidth="3"
                  points={weeklyData.map((d, i) => 
                    `${i * 100 + 50},${200 - (d.current / 60)}`
                  ).join(' ')}
                />
                
                {/* Data points for current week */}
                {weeklyData.map((d, i) => (
                  <circle
                    key={i}
                    cx={i * 100 + 50}
                    cy={200 - (d.current / 60)}
                    r="5"
                    fill="#C8102E"
                  />
                ))}

                {/* Tooltip for Thursday */}
                <g transform="translate(350, 85)">
                  <rect x="-50" y="-30" width="100" height="30" rx="5" fill="#333" />
                  <text x="0" y="-10" textAnchor="middle" fill="white" fontSize="12">
                    Thu: $5,256.59
                  </text>
                </g>
              </svg>
              
              {/* X-axis labels */}
              <div className="flex justify-between px-4 mt-2 text-sm text-gray-500">
                {weeklyData.map((d, i) => (
                  <span key={i}>{d.day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Spending Categories */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-6">Top Categories</h3>
            <div className="space-y-4">
              {spendingCategories.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="text-[#C8102E] font-medium">${cat.amount}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#C8102E] h-2 rounded-full"
                      style={{ width: `${(cat.amount / cat.maxAmount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-6">Monthly Spending by Category</h3>
            <div className="flex items-end justify-between h-48 gap-4">
              {monthlySpending.map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full rounded-t-lg"
                    style={{
                      height: `${(item.amount / maxSpending) * 160}px`,
                      background: i === 4 ? '#C8102E' : i % 2 === 0 ? '#1a1a1a' : '#666',
                    }}
                  ></div>
                  <p className="text-xs text-gray-500 mt-2 text-center">{item.category}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-400">
              <span>$0</span>
              <span>$300</span>
              <span>$600</span>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-6">Payment Methods</h3>
            <div className="flex items-center gap-8">
              {/* Donut */}
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {paymentTypes.reduce((acc, type, i) => {
                    const prevOffset = i === 0 ? 0 : acc.offset;
                    const dashArray = type.percentage * 2.83; // circumference = 283
                    acc.elements.push(
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={type.color}
                        strokeWidth="10"
                        strokeDasharray={`${dashArray} 283`}
                        strokeDashoffset={-prevOffset}
                      />
                    );
                    acc.offset = prevOffset + dashArray;
                    return acc;
                  }, { elements: [] as JSX.Element[], offset: 0 }).elements}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="space-y-3">
                {paymentTypes.map((type, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    ></span>
                    <span className="text-sm text-gray-700">{type.type}</span>
                    <span className="text-sm font-semibold ml-auto">{type.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SilverTellerHub screenName="Dashboard" onAiAction={handleAiResponse}/>
    </div>
  );
}

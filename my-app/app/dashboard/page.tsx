'use client';

import { useState } from 'react';

export default function Home() {
  const [balance] = useState(12458.32);
  const transactions = [
    { id: 1, name: 'Grocery Store', amount: -85.20, date: 'Feb 5, 2026', type: 'debit' },
    { id: 2, name: 'Salary Deposit', amount: 3200.00, date: 'Feb 1, 2026', type: 'credit' },
    { id: 3, name: 'Netflix', amount: -15.99, date: 'Jan 30, 2026', type: 'debit' },
    { id: 4, name: 'Electric Bill', amount: -124.50, date: 'Jan 28, 2026', type: 'debit' },
    { id: 5, name: 'Transfer from John', amount: 250.00, date: 'Jan 25, 2026', type: 'credit' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏦 SecureBank</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, Alex</span>
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-green-600 mt-2">↑ 2.5% from last month</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Savings Account</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">$8,540.00</p>
            <p className="text-xs text-slate-500 mt-2">Goal: $10,000</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Credit Card</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">$1,234.56</p>
            <p className="text-xs text-slate-500 mt-2">Limit: $5,000 • Due: Feb 15</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition">
              <span className="text-2xl">💸</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Send Money</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition">
              <span className="text-2xl">📥</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Request</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition">
              <span className="text-2xl">💳</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pay Bills</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Analytics</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.type === 'credit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{tx.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tx.date}</p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'credit' ? '+' : ''}{tx.amount.toLocaleString('en-US', { 
                    style: 'currency', 
                    currency: 'USD' 
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

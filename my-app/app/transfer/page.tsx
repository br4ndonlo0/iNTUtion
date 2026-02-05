
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const recipients = [
  { id: "john-1234", name: "John Tan", detail: "Phone: 9123 1234" },
  { id: "maya-7788", name: "Maya Lim", detail: "Account: 7788 9900" },
  { id: "ben-5566", name: "Ben Lee", detail: "Phone: 9988 5566" },
];

export default function TransferPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/transfer/${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-[#C8102E] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏦 Bank Buddy</h1>
          <span className="text-sm">Transfer</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Intro */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Transfer Money
          </h2>
          <p className="text-sm text-slate-700">
            Search a phone number / account number, or select a recipient below.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-md p-6 space-y-3"
        >
          <label className="text-sm text-slate-700">
            Recipient phone / account number
          </label>

          <div className="flex gap-3">
            <input
              className="flex-1 rounded-lg border border-slate-200 bg-white py-3 px-3 text-black outline-none
                         focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]
                         placeholder:text-slate-400"
              placeholder="e.g. 91231234 or 77889900"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              type="submit"
              className="px-4 py-3 rounded-lg bg-[#C8102E] text-white hover:bg-[#A50D26] transition"
            >
              Search
            </button>
          </div>

          <p className="text-xs text-slate-600">
            “Search” voice command can fill this field, then route to
            /transfer/[id].
          </p>
        </form>

        {/* Recipients */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Saved Recipients</h3>
            <Link
              href="/dashboard"
              className="text-sm text-[#C8102E] hover:underline"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="divide-y divide-slate-200">
            {recipients.map((r) => (
              <button
                key={r.id}
                onClick={() => router.push(`/transfer/${r.id}`)}
                className="w-full text-left py-4 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition"
              >
                <div>
                  <p className="font-medium text-slate-900">{r.name}</p>
                  <p className="text-sm text-slate-600">{r.detail}</p>
                </div>
                <span className="text-sm text-slate-400">Select →</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

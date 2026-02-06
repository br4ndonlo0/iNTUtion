
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SilverTellerHub from "../components/SilverTellerHub";
import { T } from "@/components/Translate";

export default function TransferPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    const normalized = phoneNumber.replace(/\D/g, "");
    if (normalized.length !== 8) {
      setSearchError("Phone number must be exactly 8 digits.");
      return;
    }

    const selfId = (() => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        const u = JSON.parse(raw);
        return typeof u?.id === "string" ? u.id : null;
      } catch {
        return null;
      }
    })();

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/users/search?phoneNumber=${encodeURIComponent(normalized)}`,
      );
      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        user?: { id: string; name: string; phoneNumber: string } | null;
      };

      if (!res.ok || !data.success) {
        setSearchError(data.message || "Search failed.");
        return;
      }

      if (!data.user) {
        setSearchError("No user found with that phone number.");
        return;
      }

      if (selfId && data.user.id === selfId) {
        setSearchError("You can’t transfer to your own account.");
        return;
      }

      router.push(`/transfer/${encodeURIComponent(data.user.id)}`);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-[#C8102E] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">←</span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold">Bank Buddy</h1>
          <span className="text-sm">Transfer</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-md p-6 space-y-3"
        >
          <label className="text-sm text-slate-700">Recipient phone number</label>

          <div className="flex gap-3">
            <input
              type="tel"
              inputMode="numeric"
              pattern="\d{8}"
              maxLength={8}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-3 px-3 text-black outline-none
                         focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]
                         placeholder:text-slate-400"
              placeholder="e.g. 91231234"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 8))}
            />

            <button
              type="submit"
              className="px-4 py-3 rounded-lg bg-[#C8102E] text-white hover:bg-[#A50D26] transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          {searchError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {searchError}
            </div>
          )}

          <p className="text-xs text-slate-600">
            “Search” voice command can fill this field, then route to
            /transfer/[id].
          </p>
        </form>
      </main>
      <SilverTellerHub screenName="Transfer" />
    </div>
  );
}

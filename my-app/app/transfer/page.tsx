
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SilverTellerHub from "../components/SilverTellerHub";
import { useState, useEffect, useEffect } from "react"; 
// 2. Import the Context
import { useVoice } from "@/context/VoiceContext";
import { T } from "@/components/Translate";
import { useHandleAiResponse } from "@/hooks/useHandleAiResponse";

export default function TransferPage() {
  const router = useRouter();

  
  const { voiceState } = useVoice(); 
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const handleAiResponse = useHandleAiResponse();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        
        if (res.ok) {
          const data = await res.json();
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
  }, [router]);

  // 4. LISTEN FOR AI UPDATES
  // When the AI resolves "Ah Boy" to "84817223", this runs instantly.
  useEffect(() => {
    if (voiceState.recipient) {
      setPhoneNumber(voiceState.recipient);
    }
  }, [voiceState.recipient]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-500 animate-pulse">Loading secure data...</p>
      </div>
    );
  }

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
      <SilverTellerHub screenName="Transfer" onAiAction={handleAiResponse}/>
    </div>
  );
}

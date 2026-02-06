"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SilverTellerHub from "../components/SilverTellerHub";
import { useState, useEffect, useCallback } from "react";
import { useVoice } from "@/context/VoiceContext";
import { useHandleAiResponse } from "@/hooks/useHandleAiResponse";

export default function TransferPage() {
  const router = useRouter();
  const { voiceState, clearPendingValue } = useVoice();
  const handleAiResponse = useHandleAiResponse();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Unified Status: 'idle' | 'searching' | 'transferring' | 'success' | 'error'
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- Auth Check ---
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("user", JSON.stringify(data.user));
          setLoading(false);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };
    checkSession();
  }, [router]);

  // 1. THE EXECUTION LOGIC (Moved here from ID Page)
  const executeTransfer = useCallback(async (recipientId: string, transferAmount: number) => {
    setStatus("transferring");
    
    const senderId = JSON.parse(localStorage.getItem("user") || "{}").id;
    if (!senderId) {
      setErrorMessage("Session invalid. Please login again.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId,
          recipientId,
          amount: transferAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Transfer failed.");
        setStatus("error");
        return;
      }

      // Update Local Balance
      if (data.sender?.balance !== undefined) {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        u.balance = data.sender.balance;
        localStorage.setItem("user", JSON.stringify(u));
      }

      // Success! Redirect to Dashboard
      console.log("✅ Transfer Successful!");
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1500); // Brief delay to show success state

    } catch (err) {
      console.error("Transfer error:", err);
      setErrorMessage("Transfer failed network request.");
      setStatus("error");
    }
  }, [router]);

  // 2. THE SEARCH + DECIDE LOGIC
  const performAction = useCallback(async (phone: string, amt: string) => {
    const normalized = phone.replace(/\D/g, "");
    if (!normalized) return;

    setStatus("searching");
    setErrorMessage(null);

    try {
      // A. Find User ID
      const res = await fetch(`/api/users/search?phoneNumber=${encodeURIComponent(normalized)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        setErrorMessage(data.message || "User not found.");
        setStatus("error");
        return;
      }

      const selfId = JSON.parse(localStorage.getItem("user") || "{}").id;
      if (selfId && data.user.id === selfId) {
        setErrorMessage("You can’t transfer to your own account.");
        setStatus("error");
        return;
      }

      // B. DECISION: Transfer Now OR Go to Confirmation Page?
      const parsedAmount = Number(amt);
      
      if (parsedAmount > 0) {
        // We have everything! Execute immediately.
        console.log(`[Transfer Page] 🚀 Found user ${data.user.name}, executing transfer of $${parsedAmount}...`);
        await executeTransfer(data.user.id, parsedAmount);
      } else {
        // Missing amount? Go to detail page to ask for it.
        console.log(`[Transfer Page] ➡️ Found user, redirecting for amount...`);
        router.push(`/transfer/${encodeURIComponent(data.user.id)}`);
      }

    } catch (err) {
      setErrorMessage("Search failed.");
      setStatus("error");
    }
  }, [router, executeTransfer]);

  // 3. VOICE LISTENER (Auto-Trigger)
useEffect(() => {
    const safeState = voiceState as any;
    
    // 1. If no data, do nothing
    if (!safeState.recipient && !safeState.amount) return;

    let newPhone = "";
    let newAmount = "";

    // 2. Sync State (Visuals)
    if (safeState.recipient) {
      setPhoneNumber(safeState.recipient);
      newPhone = safeState.recipient;
    }
    
    if (safeState.amount) {
      setAmount(safeState.amount);
      newAmount = safeState.amount;
    }

    // 3. Auto-Submit Logic
    if (newPhone) {
      console.log("[Transfer Page] ⏳ Scheduling auto-submit...");
      
      const timer = setTimeout(() => {
        console.log("[Transfer Page] 🚀 Executing auto-submit & clearing context");
        // Perform the action
        performAction(newPhone, newAmount || amount);
        // 🔥 Clear context HERE, after the action fires
        clearPendingValue(); 
      }, 800);

      // Cleanup: Cancels timer if user speaks again/component unmounts
      return () => clearTimeout(timer);
    } 
    else {
      // If we only got partial data (e.g. just amount), clear the voice memory 
      // so it doesn't get processed again, but don't submit yet.
      // (The value is already saved to React state above)
      clearPendingValue();
    }

  }, [voiceState, performAction, amount, clearPendingValue]);

  // Manual Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAction(phoneNumber, amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-500 animate-pulse"><T>Loading secure data...</T></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#C8102E] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">←</span>
            <span className="text-sm font-medium"><T>Dashboard</T></span>
          </Link>
          <h1 className="text-2xl font-bold"><T>Bank Buddy</T></h1>
          <span className="text-sm"><T>Transfer</T></span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-md p-6 space-y-3"
        >
          <label className="text-sm text-slate-700"><T>Recipient phone number</T></label>

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
              {isSearching ? <T>Searching...</T> : <T>Search</T>}
            </button>
          </div>

          {searchError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {searchError}
            </div>
          )}

          <p className="text-xs text-slate-600">
            <T>“Search” voice command can fill this field, then route to</T>
            <T> /transfer/[id].</T>
          </p>
        </form>
      </main>

      <SilverTellerHub screenName="Transfer" onAiAction={handleAiResponse} />
    </div>
  );
}
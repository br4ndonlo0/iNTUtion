"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SilverTellerHub from "../components/SilverTellerHub";
import { useState, useEffect, useCallback } from "react";
import { useVoice } from "@/context/VoiceContext";
import { useHandleAiResponse } from "@/hooks/useHandleAiResponse";
import { T } from "@/components/Translate";

export default function TransferPage() {
  const router = useRouter();
  const { voiceState, clearPendingValue } = useVoice();
  const handleAiResponse = useHandleAiResponse();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Status: 'idle' | 'searching' | 'transferring' | 'success' | 'error'
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

  // 1. EXECUTION LOGIC
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
        body: JSON.stringify({ senderId, recipientId, amount: transferAmount }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Transfer failed.");
        setStatus("error");
        return;
      }

      if (data.sender?.balance !== undefined) {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        u.balance = data.sender.balance;
        localStorage.setItem("user", JSON.stringify(u));
      }

      console.log("✅ Transfer Successful!");
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1500);

    } catch (err) {
      console.error("Transfer error:", err);
      setErrorMessage("Transfer failed network request.");
      setStatus("error");
    }
  }, [router]);

  // 2. SEARCH + DECIDE LOGIC
  const performAction = useCallback(async (phone: string, amt: string) => {
    const normalized = phone.replace(/\D/g, "");
    if (!normalized) return;

    setStatus("searching");
    setErrorMessage(null);

    try {
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

      const parsedAmount = Number(amt);
      
      if (parsedAmount > 0) {
        console.log(`[Transfer Page] 🚀 Found user ${data.user.name}, executing transfer...`);
        await executeTransfer(data.user.id, parsedAmount);
      } else {
        console.log(`[Transfer Page] ➡️ Found user, redirecting for amount...`);
        router.push(`/transfer/${encodeURIComponent(data.user.id)}`);
      }

    } catch (err) {
      setErrorMessage("Search failed.");
      setStatus("error");
    }
  }, [router, executeTransfer]);

  // 3. VOICE LISTENER
  useEffect(() => {
    const safeState = voiceState as any;
    
    if (!safeState.recipient && !safeState.amount) return;

    let newPhone = "";
    let newAmount = "";
    let hasData = false;

    if (safeState.recipient) {
      setPhoneNumber(safeState.recipient);
      newPhone = safeState.recipient;
      hasData = true;
    }
    
    if (safeState.amount) {
      setAmount(safeState.amount);
      newAmount = safeState.amount;
      hasData = true;
    }

    // Auto-Submit ONLY if we have a phone number
    if (newPhone) {
      console.log("[Transfer Page] ⏳ Scheduling auto-submit...");
      const timer = setTimeout(() => {
        performAction(newPhone, newAmount || amount);
        clearPendingValue(); 
      }, 800);
      return () => clearTimeout(timer);
    } 
    else if (hasData) {
      clearPendingValue();
    }
  }, [voiceState, performAction, amount, clearPendingValue]);

  // 4. MANUAL SUBMIT WRAPPER
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAction(phoneNumber, amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-500 animate-pulse"><T>Loading...</T></p>
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
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 👇 FIX 1: Use handleManualSubmit here */}
        <form onSubmit={handleManualSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
          
          {status === "success" && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
              <span className="text-xl">✅</span> <T>Transfer Successful! Redirecting...</T>
            </div>
          )}

          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700"><T>Recipient phone number</T></label>
            <input
              type="tel"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#C8102E]/20 outline-none"
              placeholder="e.g. 91231234"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={status === "transferring" || status === "success"}
            />
          </div>

          {/* 👇 FIX 2: Added Amount Input back */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700"><T>Amount (Optional)</T></label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-500">$</span>
              <input
                type="number"
                className="w-full pl-7 rounded-lg border border-slate-200 bg-white py-3 px-3 text-black outline-none focus:ring-2 focus:ring-[#C8102E]/20"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={status === "transferring" || status === "success"}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm font-medium">
              <T>{errorMessage}</T>
            </div>
          )}

          {/* 👇 FIX 3: Unified Action Button */}
          <button
            type="submit"
            disabled={status === "searching" || status === "transferring" || status === "success"}
            className={`w-full text-white p-4 rounded-lg font-bold text-lg transition disabled:opacity-50 ${
              status === "success" ? "bg-green-600" : "bg-[#C8102E] hover:bg-[#A50D26]"
            }`}
          >
            {status === "searching" ? <T>Finding User...</T> : 
             status === "transferring" ? <T>Sending Money...</T> : 
             status === "success" ? <T>Sent!</T> : <T>Next</T>}
          </button>
        </form>
      </main>

      <SilverTellerHub screenName="Transfer" onAiAction={handleAiResponse} />
    </div>
  );
}
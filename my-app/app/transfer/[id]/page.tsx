"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SilverTellerHub from "../../components/SilverTellerHub";

export default function TransferToIdPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const recipientId = useMemo(() => {
    const raw = params?.id ?? "";
    return decodeURIComponent(Array.isArray(raw) ? raw[0] : raw);
  }, [params]);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    setError(null);
    if (isTransferring) return;

    if (!amount.trim()) {
      setError("Please enter an amount.");
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a valid number greater than 0.");
      return;
    }

    setIsTransferring(true);

    const senderId = (() => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        const u = JSON.parse(raw);
        return typeof u?.id === "string" ? u.id : null;
      } catch {
        return null;
      }
    })();

    if (!senderId) {
      setIsTransferring(false);
      setError("You must be logged in to transfer.");
      return;
    }

    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId,
          recipientId,
          amount: parsedAmount,
        }),
      });

      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        sender?: { id: string; balance: number };
      };

      if (!res.ok || !data.success) {
        setError(data.message || "Transfer failed.");
        return;
      }

      // Update sender balance in localStorage session so dashboard reflects it.
      if (data.sender?.balance !== undefined) {
        try {
          const raw = localStorage.getItem("user");
          if (raw) {
            const u = JSON.parse(raw);
            u.balance = data.sender.balance;
            localStorage.setItem("user", JSON.stringify(u));
          }
        } catch {
          // ignore
        }
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Transfer error:", err);
      setError("Transfer failed. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-[#C8102E] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/transfer" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">←</span>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Bank Buddy</h1>
          <span className="text-sm">Transfer</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Recipient */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Transfer to Recipient
          </h2>
          <p className="text-sm text-slate-700">
            Recipient ID:{" "}
            <span className="font-medium text-slate-900">{recipientId}</span>
          </p>
        </div>

        {/* Amount + actions */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-700">Amount</label>
            <input
              inputMode="decimal"
              className="w-full rounded-lg border border-slate-200 bg-white py-3 px-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] placeholder:text-slate-500"
              placeholder="e.g. 50 or 25.90"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleTransfer}
              className="flex-1 px-4 py-3 rounded-lg bg-[#C8102E] text-white hover:bg-[#A50D26] transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isTransferring}
            >
              Transfer
            </button>

            <Link
              href="/transfer"
              className="flex-1 text-center px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      </main>
      <SilverTellerHub screenName="TransferDetail" />
    </div>
  );
}

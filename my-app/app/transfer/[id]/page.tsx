"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function TransferToIdPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const recipientId = useMemo(() => {
    const raw = params?.id ?? "";
    return decodeURIComponent(Array.isArray(raw) ? raw[0] : raw);
  }, [params]);

  const [amount, setAmount] = useState("");
  const [transferReady, setTransferReady] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = useMemo(() => {
    // allow "12", "12.34"
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const handleTransfer = () => {
    setError(null);
    setConfirmed(false);

    if (!amount.trim()) {
      setTransferReady(false);
      setError("Please enter an amount.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setTransferReady(false);
      setError("Amount must be a valid number greater than 0.");
      return;
    }

    // demo: mark as ready to confirm
    setTransferReady(true);
  };

  const handleConfirm = () => {
    setError(null);

    if (!transferReady) {
      setError("Please press Transfer first.");
      return;
    }

    // demo: confirm the transaction
    setConfirmed(true);

    // optional: after 1 second, go back to dashboard
    // setTimeout(() => router.push("/dashboard"), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏦 SecureBank</h1>
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
              className="w-full rounded-lg border border-slate-200 bg-white py-3 px-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-slate-500"
              placeholder="e.g. 50 or 25.90"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-slate-600">
              Tip: your voice “Transfer” command can set focus here and the next
              input can be the amount.
            </p>
          </div>

          {/* Status */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {transferReady && !confirmed && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              Transfer prepared. Say/press <b>Confirm</b> to complete.
            </div>
          )}

          {confirmed && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              ✅ Transfer confirmed! (Demo)
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleTransfer}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Transfer
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 rounded-lg transition ${
                transferReady
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
              disabled={!transferReady}
            >
              Confirm
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Link
            href="/transfer"
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition"
          >
            Back to Transfer
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

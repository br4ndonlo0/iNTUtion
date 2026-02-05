"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏦 SecureBank</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome back</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Bank Login</h2>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Email</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white py-3 px-3 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700">Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 bg-white py-3 px-3 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-lg bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition"
            >
              Sign in
            </button>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <button type="button" className="hover:underline">
                Forgot password?
              </button>
              <Link href="/register" className="text-blue-600 hover:underline">
                Create account
              </Link>
            </div>

            {/* Optional helper link (keep if you like) */}
            <Link
              href="/dashboard"
              className="block text-center text-sm text-blue-600 hover:underline"
            >
              Continue to dashboard (demo)
            </Link>
          </form>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏦 SecureBank</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Create Account</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Create an account
          </h2>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Full name</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white py-3 px-3 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Alex Tan"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700">Email</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white py-3 px-3 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="name@example.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm text-slate-700">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 px-3 outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-700">Confirm</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 px-3 outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" className="mt-1" />
              <span>I agree to the Terms.</span>
            </label>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-lg bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition"
            >
              Create account
            </button>

            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

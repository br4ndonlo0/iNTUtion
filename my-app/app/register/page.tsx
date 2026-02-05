"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as { success: boolean; message?: string };

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Registration failed.");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error("Register error:", error);
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏦 SecureBank</h1>
          <span className="text-sm">Create Account</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Create an account
          </h2>

          {/* 👇 attach submit handler */}
          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Full name</label>
              <input
                className="w-full rounded-lg border border-slate-200 py-3 px-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-200 py-3 px-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                className="rounded-lg border border-slate-200 py-3 px-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                minLength={8}
                required
              />
              <input
                type="password"
                className="rounded-lg border border-slate-200 py-3 px-3"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm"
                minLength={8}
                required
              />
            </div>

            {errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : null}

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" className="mt-1" />
              <span>I agree to the Terms.</span>
            </label>

            {/* ✅ submit button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create account"}
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

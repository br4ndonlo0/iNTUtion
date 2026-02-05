"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { T } from "@/components/Translate";
import { useTranslation } from "@/context/TranslationContext";

export default function LoginPage() {
  const router = useRouter();
  const { setLanguageByCode } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { 
        success: boolean; 
        message?: string;
<<<<<<< HEAD
        user?: { id: string; name: string; email: string; phoneNumber?: string | null; balance?: number };
=======
        user?: { id: string; name: string; email: string; preferredLanguage?: string };
>>>>>>> f37d5c7905ddbcdd611c714a6cc6d7ff0201f1e6
      };

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Login failed.");
        return;
      }

      // Store user info in localStorage (for demo purposes)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Set the language based on user's preference
        if (data.user.preferredLanguage) {
          setLanguageByCode(data.user.preferredLanguage);
        }
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C8102E] to-[#A50D26] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#C8102E] font-bold text-xl">B</span>
            </div>
            <h1 className="text-3xl font-bold text-white"><T>Bank Buddy</T></h1>
          </div>
          <span className="text-sm text-white/80"><T>YNBA — You&apos;ll Never Bank Alone</T></span>
        </div>
      </header>

      <main className="flex-1 flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2"><T>Sign In</T></h2>
            <p className="text-gray-600 mb-8"><T>Welcome back to your banking dashboard</T></p>

            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900"><T>Email Address</T></label>
                <input
                  type="email"
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 transition"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900"><T>Password</T></label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 transition"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-red-600">{errorMessage}</p>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#C8102E] text-white py-3 font-bold text-lg hover:bg-[#A50D26] transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? <T>Signing in...</T> : <T>Sign In</T>}
              </button>

              {/* Footer Links */}
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <button type="button" className="w-full text-center text-sm text-gray-600 hover:text-[#C8102E] transition font-medium">
                  <T>Forgot password?</T>
                </button>
                <div className="text-center text-sm text-gray-600">
                  <T>Don&apos;t have an account?</T>{" "}
                  <Link href="/register" className="text-[#C8102E] hover:underline font-bold">
                    <T>Create one</T>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

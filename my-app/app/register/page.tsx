"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { T } from "@/components/Translate";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useTranslation } from "@/context/TranslationContext";
import SilverTellerHub from "../components/SilverTellerHub";
import { useHandleAiResponse } from "@/hooks/useHandleAiResponse";
import { useVoice } from "@/context/VoiceContext";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  // Removed phone field, only use phoneNumber
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const { pendingFieldValue, clearPendingValue } = useVoice();
  const handleAiResponse = useHandleAiResponse();
  const { setLanguageByCode } = useTranslation();

  useEffect(() => {
    if (!pendingFieldValue) return;

    if (pendingFieldValue.field === "name") {
      // Remove command word (e.g., 'full name') from value
      const value = pendingFieldValue.value.trim();
      const filtered = value.replace(/^full\s*name\s+/i, "").replace(/^nama\s*penuh\s+/i, "");
      setName(filtered);
      clearPendingValue();
      return;
    }

    if (pendingFieldValue.field === "username") {
      // Remove command word (e.g., 'username') from value
      const value = pendingFieldValue.value.trim();
      const filtered = value.replace(/^username\s+/i, "").replace(/^user\s+/i, "");
      setUsername(filtered);
      clearPendingValue();
      return;
    }

    if (pendingFieldValue.field === "phone") {
      setPhoneNumber(pendingFieldValue.value.replace(/\D/g, "").slice(0, 8));
      clearPendingValue();
      return;
    }

    if (pendingFieldValue.field === "email") {
      setEmail(pendingFieldValue.value);
      clearPendingValue();
      return;
    }

    if (pendingFieldValue.field === "password") {
      setPassword(pendingFieldValue.value);
      clearPendingValue();
      return;
    }

    if (pendingFieldValue.field === "confirm") {
      setConfirmPassword(pendingFieldValue.value);
      clearPendingValue();
    }
  }, [pendingFieldValue, clearPendingValue]);

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!agreedToTerms) {
      setErrorMessage("Please agree to the Terms of Service.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          phoneNumber,
          email,
          password,
          confirmPassword,
          preferredLanguage,
        }),
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-[#C8102E] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <span className="text-3xl">🏦</span>
            <span className="text-2xl font-bold tracking-tight"><T>Bank Buddy</T></span>
          </Link>
          <Link 
            href="/login" 
            className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition font-medium"
          >
            <T>Sign In</T>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-red-900/10 p-8 border border-slate-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C8102E] rounded-2xl mb-4 shadow-lg shadow-red-500/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900"><T>Create your account</T></h2>
              <p className="text-slate-500 mt-2"><T>Join Bank Buddy and start managing your finances</T></p>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700"><T>Full Name</T></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none transition"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="janedoe"
                    required
                  />
                </div>
              </div>

              {/* Phone Number (8-digit local) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="\d{8}"
                    maxLength={8}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none transition"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder="8-digit phone number"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700"><T>Email Address</T></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700"><T>Password</T></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none transition"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700"><T>Confirm Password</T></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 focus:outline-none transition"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                    >
                      {showConfirmPassword ? (
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
                <p className="text-xs text-slate-500"><T>Must be at least 8 characters</T></p>
              </div>

              {/* Language Selection */}
              <LanguageSelect
                value={preferredLanguage}
                onChange={(lang) => {
                  setPreferredLanguage(lang);
                  setLanguageByCode(lang);
                }}
                label="Preferred Language"
              />

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="peer sr-only" 
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:border-[#C8102E] peer-checked:bg-[#C8102E] transition-all">
                    <svg className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                  <T>I agree to the</T>{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-[#C8102E] hover:underline font-medium"
                  >
                    <T>Terms of Service</T>
                  </button>
                  {" "}<T>and</T>{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="text-[#C8102E] hover:underline font-medium"
                  >
                    <T>Privacy Policy</T>
                  </button>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-[#C8102E] text-white py-3.5 font-semibold hover:bg-[#A50D26] focus:ring-4 focus:ring-[#C8102E]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-500/30"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <T>Creating account...</T>
                  </span>
                ) : (
                  <T>Create account</T>
                )}
              </button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-slate-600 mt-6">
                <T>Already have an account?</T>{" "}
                <Link href="/login" className="text-[#C8102E] hover:underline font-semibold">
                  <T>Sign in</T>
                </Link>
              </p>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-6">
            <T>Protected by enterprise-grade security</T>
          </p>

          {(showTerms || showPrivacy) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {showTerms ? "Terms of Service" : "Privacy Policy"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTerms(false);
                      setShowPrivacy(false);
                    }}
                    className="text-slate-500 hover:text-slate-700"
                    aria-label="Close dialog"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto px-6 py-4 text-sm text-slate-700 space-y-4">
                  {showTerms ? (
                    <>
                      <p>By creating an account, you agree to use the service responsibly and follow all applicable laws.</p>
                      <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
                      <p>We may suspend or terminate accounts that violate these terms or attempt fraudulent activity.</p>
                      <p>Service availability may vary, and features may change with notice as we improve the product.</p>
                    </>
                  ) : (
                    <>
                      <p>We collect basic account details such as your name, email, and phone number to provide services.</p>
                      <p>We use your data to authenticate you, process transactions, and improve the app experience.</p>
                      <p>We do not sell your personal data. We only share information when required by law.</p>
                      <p>You can request data removal by contacting support, subject to regulatory requirements.</p>
                    </>
                  )}
                </div>
                <div className="flex justify-end border-t border-slate-200 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTerms(false);
                      setShowPrivacy(false);
                    }}
                    className="rounded-lg bg-[#C8102E] px-4 py-2 text-white hover:bg-[#A50D26]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SilverTellerHub screenName="Register" onAiAction={handleAiResponse} />
    </div>
  );
}

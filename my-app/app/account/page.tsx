import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#C8102E] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏦 Bank Buddy</h1>
          <span className="text-sm">Account</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Your Account</h2>
            <p className="text-slate-700">
                Welcome to your account page. Here you can manage your personal
                information, view transaction history, and update your settings.
            </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Security</h3>
          <p className="text-sm text-slate-700 mb-4">
            Manage your security and sign-in preferences.
          </p>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Two-factor authentication</span>
              <input type="checkbox" className="h-4 w-4 accent-[#C8102E]" />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Biometric login</span>
              <input type="checkbox" className="h-4 w-4 accent-[#C8102E]" />
            </label>

            <Link
              href="/change_pass"
              className="block w-full text-center rounded-lg border border-slate-300 py-2 text-slate-800 hover:bg-slate-50 transition"
            >
              Change password
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Accessibility</h3>
          <p className="text-sm text-slate-700 mb-4">
            Adjust the interface for your comfort.
          </p>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">High contrast mode</span>
              <input type="checkbox" className="h-4 w-4 accent-[#C8102E]" />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Larger text</span>
              <input type="checkbox" className="h-4 w-4 accent-[#C8102E]" />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Reduce motion</span>
              <input type="checkbox" className="h-4 w-4 accent-[#C8102E]" />
            </label>
          </div>
        </div>

        
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 text-center px-4 py-2 rounded-lg bg-[#C8102E] text-white hover:bg-[#A50D26] transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}




import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏦 SecureBank</h1>
          <span className="text-sm">Settings</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Title Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Settings
          </h2>
          <p className="text-sm text-slate-700">
            Manage your security, privacy, and accessibility preferences.
          </p>
        </div>

        {/* Settings cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="font-semibold text-slate-900">Security</h3>

            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">
                Two-factor authentication
              </span>
              <input type="checkbox" className="h-4 w-4" />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Biometric login</span>
              <input type="checkbox" className="h-4 w-4" />
            </label>

            <Link
              href="/change_pass"
              className="block w-full text-center rounded-lg border border-slate-300 py-2 text-slate-800 hover:bg-slate-50 transition"
            >
              Change password
            </Link>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="font-semibold text-slate-900">Accessibility</h3>

            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">High contrast mode</span>
              <input type="checkbox" className="h-4 w-4" />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Larger text</span>
              <input type="checkbox" className="h-4 w-4" />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Reduce motion</span>
              <input type="checkbox" className="h-4 w-4" />
            </label>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-3">
          <Link
            href="/account"
            className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Back to Account
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


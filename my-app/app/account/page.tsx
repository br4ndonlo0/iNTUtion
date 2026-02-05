import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏦 SecureBank</h1>
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

        
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 text-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/settings"
            className="flex-1 text-center px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
>
    
            Settings
          </Link>
        </div>
      </main>
    </div>
  );
}




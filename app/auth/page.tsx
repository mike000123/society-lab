export default function AuthPage() {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-panel p-6">
      <h1 className="text-2xl font-bold">Authentication Placeholder</h1>
      <p className="text-slate-300">Ready for Supabase Auth integration (email magic link, OAuth providers, and profile sync).</p>
      <ul className="list-disc pl-6 text-sm text-slate-400">
        <li>Sign in with email/OAuth UI shells</li>
        <li>Session-aware navigation state</li>
        <li>Protected routes for simulations and governance tools</li>
      </ul>
    </div>
  );
}

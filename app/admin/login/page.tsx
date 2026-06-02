'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to sign in');
      return;
    }
    router.push('/admin/dashboard');
  }

  return (
    <main>
      <div className="container" style={{ padding: '4rem 0' }}>
        <h1>Admin Sign In</h1>
        {error ? <div className="alert alert-error">{error}</div> : null}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: 420 }}>
          <label>Admin password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="button" type="submit">Sign in</button>
        </form>
      </div>
    </main>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Unable to login.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main>
      <div className="auth-page">
        <div className="container auth-card">
          <h1>Login to your account</h1>
          {error ? <div className="alert alert-error">{error}</div> : null}
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label>Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p className="auth-note">
            New to Cloudfund? <Link href="/register">Create an account</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}

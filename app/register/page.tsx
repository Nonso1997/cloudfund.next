'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Unable to register.');
      setLoading(false);
      return;
    }

    router.push('/account-pending');
  }

  return (
    <main>
      <div className="auth-page">
        <div className="container auth-card">
          <h1>Create an account</h1>
          {error ? <div className="alert alert-error">{error}</div> : null}
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
            <label>Email</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label>Phone</label>
            <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
            <label>Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="auth-note">
            Already have an account? <Link href="/login">Login here</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}

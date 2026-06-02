'use client';

import { FormEvent, useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unable to send your email right now.');
        return;
      }

      setMessage(data.message || 'Thanks. Your email has been sent.');
      setEmail('');
    } catch {
      setError('Unable to send your email right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="subscribe-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="subscribe-email">
          Email address
        </label>
        <input
          id="subscribe-email"
          type="email"
          placeholder="Enter Your Email Address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Subscribe'}
        </button>
      </form>
      {message ? <p className="subscribe-status subscribe-status-success">{message}</p> : null}
      {error ? <p className="subscribe-status subscribe-status-error">{error}</p> : null}
    </>
  );
}

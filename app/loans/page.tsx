"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoansPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    netIncome: '',
    amount: 50000,
    tenure: 12,
  });

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const monthly = Number(form.amount) && Number(form.tenure) ? (Number(form.amount) / Number(form.tenure)) : 0;

  function formatUSD(value: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    (async () => {
      try {
        const res = await fetch('/api/loans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            netIncome: form.netIncome,
            amount: form.amount,
            tenure: form.tenure,
          }),
        });
        const d = await res.json();
        if (!res.ok) {
          alert(d.error || 'Unable to submit application');
          return;
        }
        alert('Application submitted — we will review it shortly.');
      } catch (err) {
        alert('Unable to submit application');
      }
    })();
  }

  return (
    <main>
      <section className="hero loans-hero">
        <div className="container hero-content">
          <div className="pending-card">
            <p className="eyebrow">Loans</p>
            <h1>Our lifestyle loan solutions are personalized to meet your unique needs.</h1>
            <p className="pending-copy">Flexible repayment periods, competitive rates and a quick application process. Fill the application form below to get started.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid" style={{ gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
          <form className="pending-card loan-form" onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label>
                First Name *
                <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="First Name" />
              </label>
              <label>
                Last Name *
                <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Last Name" />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <label>
                Email *
                <input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Email" />
              </label>
              <label>
                Phone Number *
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Phone" />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <label>
                Net Monthly Income *
                <input value={form.netIncome} onChange={(e) => update('netIncome', e.target.value)} placeholder="Net Monthly Income" />
              </label>
              <label>
                How much would you like to borrow? *
                <input type="number" value={form.amount} onChange={(e) => update('amount', Number(e.target.value))} placeholder="Amount" />
              </label>
            </div>

            <label style={{ marginTop: '0.75rem' }}>
              Loan Tenor Requested *
              <select value={form.tenure} onChange={(e) => update('tenure', Number(e.target.value))}>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m} Months</option>
                ))}
              </select>
            </label>

            <label style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" /> I have read the Privacy Policy and hereby give my consent.
            </label>

            <div style={{ marginTop: '1rem' }}>
              <button className="button" type="submit">Submit Application</button>
            </div>
          </form>

          <aside>
            <div className="pending-note-card loan-calculator">
              <h3 style={{ marginBottom: '0.5rem' }}>Try Our Loan Calculator</h3>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{formatUSD(Number(form.amount))}</div>
                <input type="range" min={1000} max={10000000} step={1000} value={form.amount as number} onChange={(e) => update('amount', Number(e.target.value))} />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1rem' }}> 
                <div style={{ fontWeight: 700 }}>{form.tenure} Months</div>
                <input type="range" min={1} max={24} value={form.tenure} onChange={(e) => update('tenure', Number(e.target.value))} />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ color: '#b9c2dc', fontSize: '0.9rem' }}>Monthly Payment</div>
                <div style={{ background: '#0b1224', padding: '1rem', borderRadius: '6px', marginTop: '0.5rem', fontWeight: 800, fontSize: '1.05rem' }}>{formatUSD(Number(monthly))}</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

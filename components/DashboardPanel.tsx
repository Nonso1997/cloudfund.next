'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Package, Transaction, User } from '../lib/types';

type Props = {
  initialUser: User;
  initialPackages: Package[];
  initialTransactions: Transaction[];
};

export default function DashboardPanel({ initialUser, initialPackages, initialTransactions }: Props) {
  const [user, setUser] = useState<User>(initialUser);
  const [packages] = useState<Package[]>(initialPackages);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(String(user.package_id ?? ''));
  const router = useRouter();

  const currentPackage = useMemo(
    () => packages.find((pkg) => pkg.id === user.package_id),
    [packages, user.package_id]
  );

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    router.push('/login');
  }

  async function handleAction(path: string, body: Record<string, unknown>) {
    setError(null);
    setMessage(null);

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Unable to complete request.');
      return;
    }

    setMessage(data.message || 'Action completed.');
    setUser(data.user);
    setTransactions(data.transactions);
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-left">
          <div className="eyebrow">Welcome back</div>
          <h1>Welcome back, {user.name}</h1>
          <p>Track your account performance, deposit funds, and manage your investment package in one place.</p>

          <div className="dashboard-metrics">
            <div>
              <span>Total balance</span>
              <strong>${user.balance.toFixed(2)}</strong>
            </div>
            <div>
              <span>Monthly profit</span>
              <strong>${(user.balance * 0.08).toFixed(2)}</strong>
            </div>
            <div>
              <span>Plan</span>
              <strong>{currentPackage?.name ?? 'Starter'}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-hero-right">
          <div className="hero-card">
            <div className="hero-card-header">
              <span>Overview</span>
              <button type="button" className="button button-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <div className="overview-value">
              <strong>${user.balance.toFixed(2)}</strong>
              <span>Current balance</span>
            </div>
            <div className="overview-chart">
              <div className="chart-bar" style={{ width: '72%' }} />
              <div className="chart-bar" style={{ width: '58%' }} />
              <div className="chart-bar" style={{ width: '83%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-cards">
        <div className="summary-card large-card">
          <h3>Total assets</h3>
          <p>${user.balance.toFixed(2)}</p>
          <span>Current balance</span>
        </div>
        <div className="summary-card">
          <h3>Active package</h3>
          <p>{currentPackage?.name ?? 'No plan selected'}</p>
          <span>{currentPackage?.monthly_return}% APR</span>
        </div>
        <div className="summary-card">
          <h3>Account status</h3>
          <p>{user.status}</p>
          <span>{user.status === 'active' ? 'Ready to trade' : 'Pending approval'}</span>
        </div>
      </section>

      <section className="dashboard-actions-grid">
        <div className="action-panel">
          <h2>Deposit funds</h2>
          <p>Deposit money directly into your Cloudfund account.</p>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await handleAction('/api/user/deposit', { amount: Number(depositAmount) });
              setDepositAmount('');
            }}
          >
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={depositAmount}
              onChange={(event) => setDepositAmount(event.target.value)}
              required
            />
            <button type="submit" className="button">
              Deposit
            </button>
          </form>
        </div>

        <div className="action-panel secondary">
          <h2>Withdraw funds</h2>
          <p>Request a withdrawal from your available balance.</p>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await handleAction('/api/user/withdraw', { amount: Number(withdrawAmount) });
              setWithdrawAmount('');
            }}
          >
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(event) => setWithdrawAmount(event.target.value)}
              required
            />
            <button type="submit" className="button button-secondary">
              Withdraw
            </button>
          </form>
        </div>
      </section>

      <section className="panel plan-panel">
        <div className="panel-header">
          <h2>Featured plans</h2>
          <p>Choose the right investment plan for your goals.</p>
        </div>
        <div className="grid grid-3 dashboard-plans">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`plan-card ${currentPackage?.id === pkg.id ? 'featured' : ''}`}>
              <h3>{pkg.name}</h3>
              <p className="plan-price">${pkg.amount.toFixed(2)}</p>
              <ul>
                <li>{pkg.monthly_return}% monthly return</li>
                <li>{pkg.max_trade} active trades</li>
                <li>{pkg.support_level} support</li>
              </ul>
              <button
                className="button"
                onClick={() => {
                  setSelectedPackage(String(pkg.id));
                  handleAction('/api/user/package', { packageId: pkg.id });
                }}
              >
                Choose plan
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel history-panel">
        <div className="panel-header">
          <h2>Recent transactions</h2>
        </div>
        <div className="table-responsive dashboard-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4}>No transactions yet.</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.created_at).toLocaleString()}</td>
                    <td>{transaction.type}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{transaction.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

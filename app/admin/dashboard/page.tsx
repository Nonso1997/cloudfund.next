'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  id: string | number;
  name: string;
  email: string;
  status: string;
  balance: number;
  created_at?: string;
};

type Loan = {
  id: string | number;
  user_id?: string | number | null;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  net_income?: number;
  amount: number;
  tenure: number;
  status: string;
  created_at?: string;
};

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balanceInputs, setBalanceInputs] = useState<Record<string, string>>({});
  const [savingBalance, setSavingBalance] = useState<Record<string, boolean>>({});
  const [loans, setLoans] = useState<Loan[]>([]);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to load users');
      setLoading(false);
      return;
    }
    setUsers(data.users || []);
    // load loans
    try {
      const r2 = await fetch('/api/admin/loans');
      if (r2.ok) {
        const d2 = await r2.json();
        setLoans(d2.loans || []);
      }
    } catch (e) {
      // ignore
    }
    setBalanceInputs(
      (data.users || []).reduce((acc: Record<string, string>, user: User) => {
        acc[String(user.id)] = user.balance?.toFixed(2) ?? '0.00';
        return acc;
      }, {})
    );
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateUser(id: string | number, updates: { status?: string; balance?: number }) {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || 'Unable to update');
      return false;
    }

    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, ...updates } : user))
    );

    if (updates.balance !== undefined) {
      setBalanceInputs((current) => ({ ...current, [String(id)]: updates.balance!.toFixed(2) }));
    }

    return true;
  }

  async function updateStatus(id: string | number, status: string) {
    await updateUser(id, { status });
  }

  async function handleLoanAction(id: string | number, status: string) {
    const res = await fetch('/api/admin/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || 'Unable to update loan');
      return;
    }
    setLoans((current) => current.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  async function saveBalance(id: string | number) {
    const key = String(id);
    const value = balanceInputs[key] ?? '';
    const parsedBalance = Number(value);

    if (Number.isNaN(parsedBalance)) {
      alert('Enter a valid balance amount');
      return;
    }

    setSavingBalance((current) => ({ ...current, [key]: true }));
    const success = await updateUser(id, { balance: parsedBalance });
    setSavingBalance((current) => ({ ...current, [key]: false }));

    if (!success) {
      setBalanceInputs((current) => ({ ...current, [key]: users.find((user) => String(user.id) === key)?.balance.toFixed(2) ?? '0.00' }));
    }
  }

  const pendingCount = users.filter((user) => user.status === 'pending').length;

  return (
    <main className="admin-dashboard-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>Cloudfund</span>
          <small>Admin</small>
        </div>
        <nav className="admin-nav">
          <Link href="/admin/dashboard" className="admin-nav-link active">
            Dashboard
          </Link>
          <Link href="#users" className="admin-nav-link">
            Users
          </Link>
          <Link href="#customers" className="admin-nav-link">
            Customers
          </Link>
          <Link href="#buysell" className="admin-nav-link">
            Buy/Sell
          </Link>
          <Link href="#accounts" className="admin-nav-link">
            Accounts
          </Link>
          <Link href="#funds" className="admin-nav-link">
            Funds
          </Link>
          <Link href="#lending" className="admin-nav-link">
            Lending
          </Link>
          <Link href="#expenses" className="admin-nav-link">
            Expenses
          </Link>
        </nav>
        <button type="button" className="button button-secondary admin-logout">
          Log Out
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Admin Overview</h1>
          </div>
          <div className="admin-profile">
            <span className="status-dot" />
            <div>
              <p>Innocent</p>
              <small>Super Admin</small>
            </div>
          </div>
        </header>

        <div className="admin-summary-grid">
          <div className="admin-summary-card">
            <span>Total Funds</span>
            <strong>$1.2M</strong>
          </div>
          <div className="admin-summary-card">
            <span>Total Customers</span>
            <strong>2</strong>
          </div>
          <div className="admin-summary-card">
            <span>Users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="admin-summary-card">
            <span>Accounts</span>
            <strong>2</strong>
          </div>
        </div>

        <div className="admin-dashboard-grid">
          <div className="admin-panel admin-chart-panel">
            <div className="panel-header">
              <h2>Active Visitors</h2>
              <span>Jan ’22 – May ’22</span>
            </div>
            <div className="chart-placeholder chart-visitors" />
          </div>

          <div className="admin-panel admin-chart-panel">
            <div className="panel-header">
              <h2>Wallet Usage</h2>
              <span>This Week</span>
            </div>
            <div className="wallet-chart">
              <div className="wallet-donut" />
              <div className="wallet-legend">
                <div><span className="dot yellow" />Manual Wallet: 45%</div>
                <div><span className="dot pink" />Exchange Wallet: 55%</div>
              </div>
            </div>
          </div>
        </div>

        <section className="admin-panel admin-users-panel" id="users">
          <div className="panel-header">
            <h2>Pending accounts</h2>
            <span>{pendingCount} waiting approval</span>
          </div>
          <div className="admin-user-grid">
            {users.slice(0, 6).map((user) => (
              <div key={user.id} className="admin-user-card">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <div className={`status-badge ${user.status}`}>{user.status}</div>
                <div className="balance-group">
                  <label htmlFor={`balance-${user.id}`}>Balance</label>
                  <div className="balance-input-row">
                    <input
                      id={`balance-${user.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={balanceInputs[String(user.id)] ?? ''}
                      onChange={(event) =>
                        setBalanceInputs((current) => ({ ...current, [String(user.id)]: event.target.value }))
                      }
                    />
                    <button
                      className="button button-small"
                      type="button"
                      onClick={() => saveBalance(user.id)}
                      disabled={savingBalance[String(user.id)]}
                    >
                      {savingBalance[String(user.id)] ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
                <div className="user-card-actions">
                  {user.status !== 'active' ? (
                    <button className="button button-small" onClick={() => updateStatus(user.id, 'active')}>
                      Approve
                    </button>
                  ) : null}
                  {user.status !== 'rejected' ? (
                    <button className="button button-outline button-small" onClick={() => updateStatus(user.id, 'rejected')}>
                      Reject
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="admin-panel admin-users-panel" id="loans" style={{ marginTop: '1.5rem' }}>
          <div className="panel-header">
            <h2>Loan Applications</h2>
            <span>{loans.filter((l) => l.status === 'pending').length} waiting review</span>
          </div>
          <div className="admin-user-grid">
            {loans.map((loan) => (
              <div key={loan.id} className="admin-user-card">
                <strong>{loan.first_name} {loan.last_name}</strong>
                <span>{loan.email || loan.phone}</span>
                <div className={`status-badge ${loan.status}`}>{loan.status}</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <div>Amount: ${Number(loan.amount).toFixed(2)}</div>
                  <div>Tenure: {loan.tenure} months</div>
                </div>
                <div className="user-card-actions" style={{ marginTop: '0.5rem' }}>
                  {loan.status !== 'approved' ? (
                    <button className="button button-small" onClick={() => handleLoanAction(loan.id, 'approved')}>Approve</button>
                  ) : null}
                  {loan.status !== 'rejected' ? (
                    <button className="button button-outline button-small" onClick={() => handleLoanAction(loan.id, 'rejected')}>Reject</button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

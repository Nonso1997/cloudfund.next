import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../lib/auth';

export default async function AccountPendingPage() {
  const user = await getCurrentUser();

  if (user?.status === 'active') {
    redirect('/dashboard');
  }

  return (
    <main>
      <div className="auth-page">
        <div className="container auth-card pending-card">
          <p className="eyebrow">Account pending</p>
          <div className="pending-header">
            <div className="pending-badge">Pending approval</div>
            <h1>Registration process is pending approval</h1>
          </div>

          <p className="pending-copy">
            Please wait while we verify your account. Once your information is reviewed, your dashboard access will be enabled.
          </p>

          <div className="pending-note-card">
            <p className="pending-note-title">Awaiting verification</p>
            <p className="pending-note-desc">Verification taking too long? Contact support.</p>
          </div>

          {user?.email ? (
            <div className="pending-meta">
              <span>Registered email</span>
              <strong>{user.email}</strong>
            </div>
          ) : null}

          <div className="pending-actions">
            <Link href="/" className="button">
              Back to homepage
            </Link>
            <Link href="/login" className="button-outline">
              Sign in later
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

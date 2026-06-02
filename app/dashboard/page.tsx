import { redirect } from 'next/navigation';
import { requireUser } from '../../lib/auth';
import { getPackages, getTransactionsForUser } from '../../lib/data';
import DashboardPanel from '../../components/DashboardPanel';
import type { User } from '../../lib/types';

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) {
    redirect('/login');
  }

  const [packages, transactions] = await Promise.all([getPackages(), getTransactionsForUser(user.id)]);

  return <DashboardPanel initialUser={user as User} initialPackages={packages} initialTransactions={transactions} />;
}

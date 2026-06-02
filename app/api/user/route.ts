import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { getTransactionsForUser } from '../../../lib/data';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const transactions = await getTransactionsForUser(user.id);
    return NextResponse.json({ user, transactions });
  } catch {
    return NextResponse.json({ error: 'Unable to load transactions.' }, { status: 500 });
  }
}

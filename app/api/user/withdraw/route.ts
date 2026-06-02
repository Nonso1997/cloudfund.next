import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { createTransaction, getUserDashboardData, updateUser } from '../../../../lib/data';

async function buildResponse(userId: string | number) {
  const { user, transactions } = await getUserDashboardData(userId);
  return NextResponse.json({ user, transactions: transactions ?? [], message: 'Withdrawal request submitted. Admin approval is pending.' });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const amount = Number(body.amount ?? 0);

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Withdrawal amount must be greater than zero.' }, { status: 400 });
  }
  if (amount > Number(user.balance)) {
    return NextResponse.json({ error: 'Insufficient balance for withdrawal.' }, { status: 400 });
  }

  try {
    await createTransaction({ user_id: user.id, type: 'withdraw', amount, status: 'pending' });
    await updateUser(user.id, { balance: Number(user.balance) - amount });
  } catch {
    return NextResponse.json({ error: 'Unable to record withdrawal request. Please try again.' }, { status: 500 });
  }

  return buildResponse(user.id);
}

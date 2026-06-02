import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { createTransaction, getUserDashboardData, updateUser } from '../../../../lib/data';

async function buildResponse(userId: string | number) {
  const { user, transactions } = await getUserDashboardData(userId);
  return NextResponse.json({ user, transactions: transactions ?? [], message: 'Deposit recorded successfully.' });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const amount = Number(body.amount ?? 0);

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Deposit amount must be greater than zero.' }, { status: 400 });
  }

  try {
    await createTransaction({ user_id: user.id, type: 'deposit', amount, status: 'completed' });
    await updateUser(user.id, { balance: Number(user.balance) + amount });
  } catch {
    return NextResponse.json({ error: 'Unable to record deposit. Please try again.' }, { status: 500 });
  }

  return buildResponse(user.id);
}

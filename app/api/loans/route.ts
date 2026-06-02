import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createLoanApplication } from '../../../lib/data';

const JWT_SECRET = process.env.JWT_SECRET || 'cloudfund_dev_secret';

function getUserIdFromRequest(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/cloudfund_token=([^;]+)/);
    if (!match) return null;
    const token = decodeURIComponent(match[1]);
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return payload?.sub ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount ?? 0);
    const tenure = Number(body.tenure ?? 0);
    if (!amount || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    if (!tenure || tenure <= 0) return NextResponse.json({ error: 'Invalid tenure' }, { status: 400 });

    const userId = getUserIdFromRequest(request) || body.user_id;

    await createLoanApplication({
      user_id: userId,
      first_name: body.firstName || body.first_name,
      last_name: body.lastName || body.last_name,
      email: body.email,
      phone: body.phone,
      net_income: body.netIncome || body.net_income,
      amount,
      tenure,
      status: 'pending',
    });

    return NextResponse.json({ message: 'Application received' });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAllUsers, updateUser } from '../../../../lib/data';

const JWT_SECRET = process.env.JWT_SECRET || 'cloudfund_dev_secret';

function isAdminFromRequest(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/cloudfund_admin=([^;]+)/);
    if (!match) return false;
    const token = decodeURIComponent(match[1]);
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return Boolean(payload && payload.admin);
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (!isAdminFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await getAllUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  if (!isAdminFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const id = body.id;
  const status = body.status;
  const balance = body.balance;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  if (status === undefined && balance === undefined) {
    return NextResponse.json({ error: 'Missing status or balance' }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {};
  if (status !== undefined) {
    updatePayload.status = status;
  }

  if (balance !== undefined) {
    const parsedBalance = Number(balance);
    if (Number.isNaN(parsedBalance)) {
      return NextResponse.json({ error: 'Invalid balance value' }, { status: 400 });
    }
    updatePayload.balance = parsedBalance;
  }

  await updateUser(id, updatePayload);
  return NextResponse.json({ message: 'Updated' });
}

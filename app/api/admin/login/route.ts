import { NextResponse } from 'next/server';
import { createAdminToken } from '../../../../lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password || '');

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin_dev_secret';
  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createAdminToken('admin');
  const response = NextResponse.json({ message: 'Authenticated' });
  response.cookies.set({ name: 'cloudfund_admin', value: token, httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  return response;
}

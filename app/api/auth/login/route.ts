import { NextResponse } from 'next/server';
import { createAuthToken } from '../../../../lib/auth';
import { loginUser } from '../../../../lib/data';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const user = await loginUser(email, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = createAuthToken(user.id);
  const response = NextResponse.json({ message: 'Authenticated' });
  response.cookies.set({
    name: 'cloudfund_token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

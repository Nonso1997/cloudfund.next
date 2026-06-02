import { NextResponse } from 'next/server';
import { createAuthToken } from '../../../../lib/auth';
import { registerUser } from '../../../../lib/data';

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  const password = String(body.password || '');

  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json({ error: 'Name, email and password are required. Password must be at least 6 characters.' }, { status: 400 });
  }

  let user;
  try {
    user = await registerUser({ name, email, phone, password });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create account. Please try again.' }, { status: 400 });
  }

  const token = createAuthToken(user.id);
  const response = NextResponse.json({ message: 'Registration successful. Redirecting to dashboard.' });
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

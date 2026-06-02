import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { getUserById } from './data';
import type { User } from './types';

const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? '' : 'cloudfund_dev_secret');

export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get('cloudfund_token')?.value;
  if (!token || !JWT_SECRET) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { sub: string };
    const userId = payload.sub;
    if (!userId) return null;

    return getUserById(userId);
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  if (user.status !== 'active') {
    redirect('/account-pending');
  }

  return user as User;
}

export function createAuthToken(userId: string | number) {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  return jwt.sign({ sub: String(userId) }, JWT_SECRET as string, {
    expiresIn: '7d',
  });
}

export function createAdminToken(adminId: string | number) {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  return jwt.sign({ sub: String(adminId), admin: true }, JWT_SECRET as string, {
    expiresIn: '7d',
  });
}

export async function getCurrentAdmin() {
  const token = cookies().get('cloudfund_admin')?.value;
  if (!token || !JWT_SECRET) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { sub?: string; admin?: boolean };
    if (!payload || !payload.admin) return null;
    return { id: payload.sub } as { id: string };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}

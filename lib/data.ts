import bcrypt from 'bcryptjs';
import { firebaseApiKey, firebaseAuth, firestore, isFirebaseEnabled } from './firebase';
import { supabaseServer } from './supabase';
import type { Package, Transaction, User } from './types';

const defaultPackages: Package[] = [
  { id: 1, name: 'Starter', amount: 100, monthly_return: 8, max_trade: 1, support_level: 'Basic' },
  { id: 2, name: 'Standard', amount: 500, monthly_return: 12, max_trade: 3, support_level: 'Priority' },
  { id: 3, name: 'Premium', amount: 1500, monthly_return: 18, max_trade: 5, support_level: 'Dedicated' },
];

function cleanUser(data: FirebaseFirestore.DocumentData | User): User {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    balance: Number(data.balance ?? 0),
    status: data.status ?? 'active',
    package_id: data.package_id ?? null,
  };
}

function cleanPackage(data: FirebaseFirestore.DocumentData | Package): Package {
  return {
    id: Number(data.id),
    name: data.name,
    amount: Number(data.amount),
    monthly_return: Number(data.monthly_return),
    max_trade: Number(data.max_trade),
    support_level: data.support_level,
  };
}

function cleanTransaction(data: FirebaseFirestore.DocumentData | Transaction): Transaction {
  return {
    id: data.id,
    user_id: data.user_id,
    type: data.type,
    amount: Number(data.amount),
    status: data.status,
    created_at: data.created_at,
  };
}

async function ensureFirebasePackages() {
  if (!firestore) return;

  const db = firestore;
  const snapshot = await firestore.collection('packages').limit(1).get();
  if (!snapshot.empty) return;

  const batch = db.batch();
  defaultPackages.forEach((pkg) => {
    batch.set(db.collection('packages').doc(String(pkg.id)), {
      ...pkg,
      created_at: new Date().toISOString(),
    });
  });
  await batch.commit();
}

export async function getUserById(userId: string | number): Promise<User | null> {
  if (isFirebaseEnabled && firestore) {
    const doc = await firestore.collection('users').doc(String(userId)).get();
    return doc.exists ? cleanUser({ id: doc.id, ...doc.data() }) : null;
  }

  const { data, error } = await (supabaseServer as any).from('users').select('*').eq('id', userId).single();
  return error || !data ? null : cleanUser(data);
}

export async function registerUser(input: { name: string; email: string; phone?: string; password: string }) {
  if (isFirebaseEnabled && firebaseAuth && firestore) {
    await ensureFirebasePackages();
    const authUser = await firebaseAuth.createUser({
      email: input.email,
      password: input.password,
      displayName: input.name,
    });
    const user: User = {
      id: authUser.uid,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      balance: 0,
      status: 'pending',
      package_id: null,
    };
    await firestore.collection('users').doc(authUser.uid).set({
      ...user,
      created_at: new Date().toISOString(),
    });
    return user;
  }

  const { data: existingUser } = await (supabaseServer as any).from('users').select('id').eq('email', input.email).single();
  if (existingUser) {
    throw new Error('An account with that email already exists.');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const { error: insertError } = await (supabaseServer as any).from('users').insert([
    { name: input.name, email: input.email, phone: input.phone, password_hash: passwordHash, balance: 0.0, status: 'pending' },
  ]);

  if (insertError) {
    throw new Error('Unable to create account. Please try again.');
  }

  const { data: user, error } = await (supabaseServer as any).from('users').select('*').eq('email', input.email).single();
  if (error || !user) {
    throw new Error('Unable to verify your new account. Please try logging in.');
  }

  return cleanUser(user);
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  if (isFirebaseEnabled && firestore && firebaseApiKey) {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { localId?: string };
    return data.localId ? getUserById(data.localId) : null;
  }

  const { data: user, error } = await (supabaseServer as any).from('users').select('*').eq('email', email).single();
  if (error || !user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  return isValid ? cleanUser(user) : null;
}

export async function getPackages(): Promise<Package[]> {
  if (isFirebaseEnabled && firestore) {
    await ensureFirebasePackages();
    const snapshot = await firestore.collection('packages').orderBy('monthly_return', 'desc').get();
    return snapshot.docs.map((doc) => cleanPackage({ id: doc.id, ...doc.data() }));
  }

  const { data } = await (supabaseServer as any).from('packages').select('*').order('monthly_return', { ascending: false });
  return (data ?? []).map(cleanPackage);
}

export async function getPackageById(packageId: number): Promise<Package | null> {
  if (isFirebaseEnabled && firestore) {
    await ensureFirebasePackages();
    const doc = await firestore.collection('packages').doc(String(packageId)).get();
    return doc.exists ? cleanPackage({ id: doc.id, ...doc.data() }) : null;
  }

  const { data, error } = await (supabaseServer as any).from('packages').select('*').eq('id', packageId).single();
  return error || !data ? null : cleanPackage(data);
}

export async function getTransactionsForUser(userId: string | number): Promise<Transaction[]> {
  if (isFirebaseEnabled && firestore) {
    const snapshot = await firestore
      .collection('transactions')
      .where('user_id', '==', String(userId))
      .orderBy('created_at', 'desc')
      .get();
    return snapshot.docs.map((doc) => cleanTransaction({ id: doc.id, ...doc.data() }));
  }

  const { data } = await (supabaseServer as any)
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data ?? []).map(cleanTransaction);
}

export async function createTransaction(input: Omit<Transaction, 'id' | 'created_at'>) {
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('transactions').add({
      ...input,
      user_id: String(input.user_id),
      created_at: new Date().toISOString(),
    });
    return;
  }

  await (supabaseServer as any).from('transactions').insert([input]);
}

export async function createLoanApplication(input: Omit<import('./types').Loan, 'id' | 'created_at' | 'updated_at'>) {
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('loans').add({ ...input, created_at: new Date().toISOString() });
    return;
  }

  await (supabaseServer as any).from('loans').insert([input]);
}

export async function getLoanApplications(): Promise<import('./types').Loan[]> {
  if (isFirebaseEnabled && firestore) {
    const snapshot = await firestore.collection('loans').orderBy('created_at', 'desc').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
  }

  const { data } = await (supabaseServer as any).from('loans').select('*').order('created_at', { ascending: false });
  return (data ?? []);
}

export async function updateLoanApplication(loanId: string | number, values: Partial<import('./types').Loan>) {
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('loans').doc(String(loanId)).update({ ...values, updated_at: new Date().toISOString() });
    return;
  }

  await (supabaseServer as any).from('loans').update(values).eq('id', loanId);
}

export async function updateUser(userId: string | number, values: Partial<User>) {
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('users').doc(String(userId)).update(values);
    return;
  }

  await (supabaseServer as any).from('users').update(values).eq('id', userId);
}

export async function getAllUsers(): Promise<User[]> {
  if (isFirebaseEnabled && firestore) {
    const snapshot = await firestore.collection('users').orderBy('created_at', 'desc').get();
    return snapshot.docs.map((doc) => cleanUser({ id: doc.id, ...doc.data() }));
  }

  const { data } = await (supabaseServer as any).from('users').select('*').order('created_at', { ascending: false });
  return (data ?? []).map(cleanUser);
}

export async function getUserDashboardData(userId: string | number) {
  const [user, transactions] = await Promise.all([getUserById(userId), getTransactionsForUser(userId)]);
  return { user, transactions };
}

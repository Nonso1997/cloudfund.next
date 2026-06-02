import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { getPackageById, getUserDashboardData, updateUser } from '../../../../lib/data';

async function buildResponse(userId: string | number) {
  const { user, transactions } = await getUserDashboardData(userId);
  return NextResponse.json({ user, transactions: transactions ?? [], message: 'Your investment plan has been updated.' });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const packageId = Number(body.packageId ?? 0);
  if (!packageId) {
    return NextResponse.json({ error: 'Invalid plan selection.' }, { status: 400 });
  }

  const packageData = await getPackageById(packageId);
  if (!packageData) {
    return NextResponse.json({ error: 'Unable to update package. Please try again.' }, { status: 400 });
  }

  try {
    await updateUser(user.id, { package_id: packageId });
  } catch {
    return NextResponse.json({ error: 'Unable to update package. Please try again.' }, { status: 500 });
  }

  return buildResponse(user.id);
}

import { NextResponse } from 'next/server';
import { getPackages } from '../../../lib/data';

export async function GET() {
  try {
    const packages = await getPackages();
    return NextResponse.json({ packages });
  } catch {
    return NextResponse.json({ error: 'Failed to load packages.' }, { status: 500 });
  }
}

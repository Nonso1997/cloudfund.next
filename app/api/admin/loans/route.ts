import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getLoanApplications, updateLoanApplication, createTransaction, updateUser, getUserById } from '../../../../lib/data';
import { sendEmail } from '../../../../lib/mailer';

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

  const loans = await getLoanApplications();
  return NextResponse.json({ loans });
}

export async function POST(request: Request) {
  if (!isAdminFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const id = body.id;
  const status = body.status;

  if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

  // Update loan status
  await updateLoanApplication(id, { status, updated_at: new Date().toISOString() } as any);

  // send notification email after updating
  const loan = (await getLoanApplications()).find((l) => String(l.id) === String(id));
  const recipient = loan?.email || (loan?.user_id ? (await getUserById(loan.user_id))?.email : null);
  if (recipient) {
    try {
      if (status === 'approved') {
        await sendEmail(
          recipient,
          'Loan Application Approved',
          `Your loan application for $${Number(loan?.amount ?? 0).toFixed(2)} has been approved. Funds have been credited to your account.`,
        );
      } else if (status === 'rejected') {
        await sendEmail(
          recipient,
          'Loan Application Rejected',
          `Your loan application for $${Number(loan?.amount ?? 0).toFixed(2)} has been rejected. Please contact support for more information.`,
        );
      }
    } catch (e) {
      // swallow email errors but log
      // eslint-disable-next-line no-console
      console.log('[email] error', e);
    }
  }

  // If approved, create transaction and credit user
  if (status === 'approved') {
    const loan = (await getLoanApplications()).find((l) => String(l.id) === String(id));
    if (loan) {
      await createTransaction({ user_id: loan.user_id, type: 'loan', amount: Number(loan.amount), status: 'completed' });
      const user = await getUserById(loan.user_id);
      const current = user ? Number(user.balance ?? 0) : 0;
      await updateUser(loan.user_id, { balance: current + Number(loan.amount) });
    }
  }

  return NextResponse.json({ message: 'Updated' });
}

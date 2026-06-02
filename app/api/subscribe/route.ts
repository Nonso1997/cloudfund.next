import { NextResponse } from 'next/server';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || '').trim().toLowerCase();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.SUBSCRIBE_TO_EMAIL;
  const from = process.env.SUBSCRIBE_FROM_EMAIL || 'Cloudfund <onboarding@resend.dev>';

  if (!apiKey || !recipient) {
    return NextResponse.json(
      { error: 'Email notifications are not configured yet. Set RESEND_API_KEY and SUBSCRIBE_TO_EMAIL.' },
      { status: 500 }
    );
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      subject: 'New Cloudfund subscriber',
      text: `A visitor subscribed with this email address: ${email}`,
      html: `<p>A visitor subscribed with this email address:</p><p><strong>${email}</strong></p>`,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Unable to send the email notification right now.' }, { status: 502 });
  }

  return NextResponse.json({ message: 'Thanks. Your email has been sent.' });
}

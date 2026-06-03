import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.EMAIL_FROM || `no-reply@localhost`;

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransport() {
  if (transport) return transport;
  if (!host || !port || !user || !pass) {
    transport = null;
    return null;
  }
  transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transport;
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const t = getTransport();
  if (!t) {
    // no SMTP configured — fallback to logging
    // eslint-disable-next-line no-console
    console.log('[email] SMTP not configured. Skipping email to', to, { subject, text });
    return;
  }

  await t.sendMail({ from, to, subject, text, html });
}

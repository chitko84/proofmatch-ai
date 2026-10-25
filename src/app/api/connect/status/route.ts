import { NextResponse } from 'next/server';
import { getInvitation, sharedConnectReady } from '@/lib/connect-store';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(request: Request) {
  if (!sharedConnectReady()) return NextResponse.json({ error: 'Shared replies are not connected.' }, { status: 503 });
  const token = new URL(request.url).searchParams.get('token') || '';
  try {
    const invitation = await getInvitation(token);
    if (!invitation) return NextResponse.json({ error: 'This invitation is not available or has expired.' }, { status: 404 });
    const bot = process.env.TELEGRAM_BOT_USERNAME;
    const telegramUrl = bot && process.env.TELEGRAM_BOT_TOKEN && /^[A-Za-z0-9_]{5,32}$/.test(bot) ? `https://t.me/${bot}?start=${invitation.token}` : null;
    return NextResponse.json({ invitation, telegramUrl }, { headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
  } catch { return NextResponse.json({ error: 'Please try again in a moment.' }, { status: 503 }); }
}

import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { checkCandidateRole } from '@/lib/connect';
import { saveInvitation, sharedConnectReady } from '@/lib/connect-store';
export const runtime = 'nodejs'; export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (process.env.DEMO_ACCESS_CODE && request.headers.get('x-demo-access-code') !== process.env.DEMO_ACCESS_CODE)
    return NextResponse.json({ error: 'Please enter the correct demo access code.' }, { status: 401 });
  try {
    const body = await request.json() as { candidateId?: string; roleId?: string };
    const { candidate, role } = checkCandidateRole(body.candidateId, body.roleId);
    const token = randomBytes(18).toString('base64url');
    const invitation = { token, candidateId: candidate.id, roleId: role.id, createdAt: new Date().toISOString(), reply: null };
    // Shared invitations are genuinely multi-device ONLY with server-side storage.
    const shared = sharedConnectReady();
    if (shared && !process.env.DEMO_ACCESS_CODE) return NextResponse.json({error: 'Please set DEMO_ACCESS_CODE before using shared invitations.'},{status:503});
    if (shared) await saveInvitation(invitation);
    const bot = process.env.TELEGRAM_BOT_USERNAME;
    const useBot = Boolean(shared && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_WEBHOOK_SECRET && bot && /^[A-Za-z0-9_]{5,32}$/.test(bot));
    const origin = new URL(request.url).origin;
    return NextResponse.json({ invitation, mode: shared ? 'shared' : 'browser-demo',
      url: `${origin}/passport?${shared ? `token=${token}` : `candidate=${candidate.id}&role=${role.id}&demo=${token}`}`,
      telegramUrl: useBot ? `https://t.me/${bot}?start=${token}` : null,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Could not prepare the invitation. Please check your choices and connection.' }, { status: 400 }); }
}

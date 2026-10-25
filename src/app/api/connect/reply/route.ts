import { NextResponse } from 'next/server';
import { getInvitation, saveInvitation, sharedConnectReady } from '@/lib/connect-store';
import { validateCandidateReply } from '@/lib/connect';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function POST(request: Request) {
  if (!sharedConnectReady()) return NextResponse.json({ error: 'This is a browser-only demo. Save your reply in the demo page.' }, { status: 503 });
  try {
    if (Number(request.headers.get('content-length')||0)>1600) return NextResponse.json({error:'Please send a shorter note.'},{status:413});
    const input = await request.json() as Record<string,unknown>;
    const token = typeof input.token === 'string' ? input.token : '';
    const invitation = await getInvitation(token);
    if (!invitation) return NextResponse.json({ error: 'This invitation has expired or is unavailable.' }, { status: 404 });
    const reply = validateCandidateReply(input, 'passport');
    await saveInvitation({ ...invitation, reply });
    return NextResponse.json({ ok:true, reply }, { headers: { 'Cache-Control':'no-store' } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error?error.message:'Please try again.' }, {status:400}); }
}

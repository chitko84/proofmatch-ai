import { NextResponse } from 'next/server';
import { candidates, roles } from '@/lib/data';

/** Public read-only health check. Does not reveal environment values or secrets. */
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      app: 'proofmatch-ai',
      release: 'phase-4-rc1',
      dataset: 'fictional-demo',
      candidateCount: candidates.length,
      roleCount: roles.length,
      ai: process.env.GEMINI_API_KEY ? 'configured-not-live-verified' : 'not-configured',
      matching: 'deterministic-evidence-comparison',
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

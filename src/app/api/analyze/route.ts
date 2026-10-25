import { NextResponse } from 'next/server';
import { buildLiveResult, validateLiveInput } from '@/lib/live-analysis';
import { extractWithGemini, GeminiUnavailable } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: Request) {
  const accessCode = process.env.DEMO_ACCESS_CODE;
  if (accessCode && request.headers.get('x-demo-access-code') !== accessCode) {
    return NextResponse.json({ error: 'Enter the correct demo access code before using live AI.' }, { status: 401 });
  }
  if (Number(request.headers.get('content-length') || 0) > 35000) {
    return NextResponse.json({ error: 'The submitted text is too long.' }, { status: 413 });
  }
  try {
    const input = validateLiveInput(await request.json());
    const { raw, model } = await extractWithGemini(input);
    const result = buildLiveResult(input, raw, model);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof GeminiUnavailable) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Please send a valid request.' }, { status: 400 });
    if (error instanceof Error && (error.message.startsWith('Please ') || error.message.startsWith('CV text') || error.message.startsWith('Project text'))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Analysis failed. Please check the text and try again.' }, { status: 502 });
  }
}

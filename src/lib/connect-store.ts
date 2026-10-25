/** Optional shared storage using Upstash Redis REST. No npm packages needed.
 * Without configuration, Connect runs in an honest browser-only fictional demo mode.
 */
import type { Invitation } from './connect.ts';
import { validateInvitation } from './connect.ts';

export function sharedConnectReady(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
export async function sharedRedisCommand(parts: Array<string | number>): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Shared replies are not connected yet.');
  const response = await fetch(url, {
    method: 'POST', cache: 'no-store',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(parts),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Could not reach the shared demo store.');
  const body = await response.json() as { result?: unknown; error?: string };
  if (body.error) throw new Error('Shared demo storage is unavailable.');
  return body.result;
}
const keyFor = (token: string) => `proofmatch:connect:${token}`;
export async function saveInvitation(invitation: Invitation) {
  if (!validateInvitation(invitation)) throw new Error('Invalid sample invitation.');
  await sharedRedisCommand(['SET', keyFor(invitation.token), JSON.stringify(invitation), 'EX', 604800]);
}
export async function getInvitation(token: string): Promise<Invitation | null> {
  if (!/^[A-Za-z0-9_-]{16,80}$/.test(token)) return null;
  const stored = await sharedRedisCommand(['GET', keyFor(token)]);
  if (typeof stored !== 'string') return null;
  try { return validateInvitation(JSON.parse(stored) as unknown); } catch { return null; }
}

/** Check connectivity without showing secrets or creating any candidate records. */
export async function testSharedConnect(): Promise<boolean> {
  return (await sharedRedisCommand(['PING'])) === 'PONG';
}

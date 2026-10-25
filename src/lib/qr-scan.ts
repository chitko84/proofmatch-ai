/** Interpret QR text as a ProofMatch invitation only. Never open arbitrary external QR destinations. */
import { candidates, roles } from './data.ts';
export type ParsedInvitationLink = { url: string; label: string; mode: 'shared'|'fictional'|'telegram'|'meeting' };
export function parseInvitationQr(raw: string, baseUrl: string, trustedBotName = ''): ParsedInvitationLink {
  let scanned: URL;
  try { scanned = new URL(raw.trim(), baseUrl); } catch { throw new Error('This is not a valid invitation link.'); }
  const base = new URL(baseUrl);
  if(scanned.protocol==='https:' && scanned.hostname==='t.me' && trustedBotName){
    const name=trustedBotName.replace(/^@/,'');
    const token=scanned.searchParams.get('start');
    if(scanned.pathname.toLowerCase()===`/${name.toLowerCase()}` && token && /^[A-Za-z0-9_-]{16,64}$/.test(token)){
      return {url:`https://t.me/${encodeURIComponent(name)}?start=${encodeURIComponent(token)}`,label:`Open real Telegram bot @${name}`,mode:'telegram'};
    }
  }
  if (!['http:','https:'].includes(scanned.protocol) || scanned.origin !== base.origin)
    throw new Error('For your safety, scan a ProofMatch invitation from this website.');
  // LiveRoom invitation links use exact local IDs and never open outside this website.
  const room = /^\/invite\/(meet-[A-Za-z0-9_-]{8,85})$/.exec(scanned.pathname);
  if (room) {
    const safeUrl = new URL(`${base.origin}/invite/${room[1]}`);
    for(const key of ['demo','candidate','role','at','mins']){const value=scanned.searchParams.get(key);if(value)safeUrl.searchParams.set(key,value.slice(0,70));}
    return {url:safeUrl.toString(),label:'Scheduled ProofMatch meeting invitation (fictional demo)',mode:'meeting'};
  }
  if (scanned.pathname !== '/passport') throw new Error('This QR code does not open a ProofMatch invitation.');
  const token = scanned.searchParams.get('token');
  if (token) {
    if (!/^[A-Za-z0-9_-]{16,80}$/.test(token)) throw new Error('This invitation code is incomplete.');
    return { url: `${base.origin}/passport?token=${encodeURIComponent(token)}`, label: 'Private opportunity invitation', mode: 'shared' };
  }
  const demoToken = scanned.searchParams.get('demo');
  if (demoToken && !/^[A-Za-z0-9_-]{16,80}$/.test(demoToken)) throw new Error('This example invitation code is incomplete.');
  const candidateId = scanned.searchParams.get('candidate');
  const roleId = scanned.searchParams.get('role');
  const candidate = candidates.find(c => c.id === candidateId);
  const role = roles.find(r => r.id === roleId);
  if (!candidate || !role) throw new Error('This sample person or job is not available.');
  return {url: `${base.origin}/passport?candidate=${encodeURIComponent(candidate.id)}&role=${encodeURIComponent(role.id)}${demoToken ? `&demo=${encodeURIComponent(demoToken)}` : ""}`,
    label: `${candidate.alias} · ${role.title} (fictional example)`, mode:'fictional'};
}
export function demoInvitationUrl(origin: string) {
  return `${new URL(origin).origin}/passport?candidate=C01&role=qa`;
}

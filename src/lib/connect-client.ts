import { CONNECT_LOCAL_KEY, type Invitation, validateInvitation } from './connect.ts';
export function readLocalInvitations(): Invitation[] {
  if(typeof window==='undefined')return [];
  try {const raw=JSON.parse(window.localStorage.getItem(CONNECT_LOCAL_KEY)||'[]') as unknown;
    if(!Array.isArray(raw))return [];
    return raw.slice(-20).flatMap(x=>{const found=validateInvitation(x);return found?[found]:[]});
  }catch{return []}
}
export function saveLocalInvitation(record:Invitation) {
  if(typeof window==='undefined')return;
  const next=[...readLocalInvitations().filter(r=>r.token!==record.token),record].slice(-20);
  window.localStorage.setItem(CONNECT_LOCAL_KEY,JSON.stringify(next));
  window.dispatchEvent(new Event('proofmatch-connect-update'));
}

/** An exact local invitation link. Fictional data can open on phones, but replies only sync within the same browser. */
export function browserPassportUrl(origin:string, invitation:Invitation):string {
  return `${new URL(origin).origin}/passport?candidate=${encodeURIComponent(invitation.candidateId)}&role=${encodeURIComponent(invitation.roleId)}&demo=${encodeURIComponent(invitation.token)}`;
}

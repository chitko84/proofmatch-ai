/** Browser-local product workspace. No cross-organization accounts or external delivery exists here. */
import {COMPANIES,type Company,type Opportunity,OPPORTUNITIES} from './career-catalog.ts';
import {TALENT_CANDIDATES,type TalentCandidate} from './talent-ecosystem.ts';
export type PartnerConnection={id:string;firstId:string;secondId:string;status:'pending'|'accepted'|'declined';createdAt:string};
export type TalentReferral={id:string;fromCompanyId:string;toCompanyId:string;candidateId:string;opportunityId:string;note:string;consent:'pending'|'approved'|'declined';status:'permission_requested'|'ready_to_send'|'sent'|'reviewed'|'closed';createdAt:string;sentAt?:string};
export type CompanyWorkspace={activeCompanyId:string;customCompanies:Company[];customCandidates:TalentCandidate[];customJobs:Opportunity[];connections:PartnerConnection[];referrals:TalentReferral[];recruiterNotes:Record<string,string>;savedCandidates:string[];view:'recruiter'|'candidate'};
const referenceDate='2026-11-01T10:00:00.000Z';
export const COMPANY_NETWORK_STORAGE='proofmatch-company-network-v1';
export const initialCompanyWorkspace=():CompanyWorkspace=>({activeCompanyId:'org-01',customCompanies:[],customCandidates:[],customJobs:[],connections:[
 {id:'connection-established-1',firstId:'org-01',secondId:'org-02',status:'accepted',createdAt:referenceDate},
 {id:'connection-established-2',firstId:'org-01',secondId:'org-03',status:'accepted',createdAt:referenceDate},
 {id:'connection-established-3',firstId:'org-01',secondId:'org-07',status:'accepted',createdAt:referenceDate}
 ],referrals:[],recruiterNotes:{},savedCandidates:[],view:'recruiter'});
export function companyDirectory(workspace:CompanyWorkspace){return [...COMPANIES,...workspace.customCompanies.filter(c=>!COMPANIES.some(existing=>existing.id===c.id))]}
export function allNetworkJobs(data:CompanyWorkspace){return [...OPPORTUNITIES,...data.customJobs]}
export function partnerStatus(data:CompanyWorkspace,a:string,b:string){if(a===b)return 'same';return data.connections.find(c=>(c.firstId===a&&c.secondId===b)||(c.firstId===b&&c.secondId===a))?.status||'none'}
export function connectedCompanyIds(data:CompanyWorkspace,id:string){return data.connections.filter(c=>c.status==='accepted'&&(c.firstId===id||c.secondId===id)).map(c=>c.firstId===id?c.secondId:c.firstId)}
export function connectCompanies(data:CompanyWorkspace,from:string,to:string):CompanyWorkspace{
 if(!from||!to||from===to||partnerStatus(data,from,to)!=='none'||!companyDirectory(data).some(c=>c.id===from)||!companyDirectory(data).some(c=>c.id===to))return data;
 return {...data,connections:[...data.connections,{id:`connection-${from}-${to}`,firstId:from,secondId:to,status:'pending',createdAt:new Date().toISOString()}]};
}
export function decideConnection(data:CompanyWorkspace,connectionId:string,decision:'accepted'|'declined',actingCompanyId:string){
 return {...data,connections:data.connections.map(c=>c.id===connectionId&&c.secondId===actingCompanyId?{...c,status:decision}:c)};
}
export function requestReferral(data:CompanyWorkspace,candidateId:string,toCompanyId:string,opportunityId:string,note:string):CompanyWorkspace{
 const from=data.activeCompanyId;
 if(data.view!=='recruiter'||partnerStatus(data,from,toCompanyId)!=='accepted'||![...TALENT_CANDIDATES,...data.customCandidates].some(c=>c.id===candidateId)||!allNetworkJobs(data).some(j=>j.id===opportunityId&&j.companyId===toCompanyId))return data;
 if(data.referrals.some(r=>r.candidateId===candidateId&&r.opportunityId===opportunityId&&r.status!=='closed'))return data;
 return {...data,referrals:[{id:`referral-${Date.now()}-${data.referrals.length}`,fromCompanyId:from,toCompanyId:toCompanyId,candidateId,opportunityId,note:note.slice(0,600),consent:'pending',status:'permission_requested',createdAt:new Date().toISOString()},...data.referrals]};
}
export function decideReferralConsent(data:CompanyWorkspace,referralId:string,decision:'approved'|'declined'):CompanyWorkspace{
 if(data.view!=='candidate')return data;
 return {...data,referrals:data.referrals.map(r=>r.id===referralId&&r.status==='permission_requested'?{...r,consent:decision,status:decision==='approved'?'ready_to_send' as const:'closed' as const}:r)};
}
export function sendReferral(data:CompanyWorkspace,referralId:string):CompanyWorkspace{
 if(data.view!=='recruiter')return data;
 return {...data,referrals:data.referrals.map(r=>r.id===referralId&&r.fromCompanyId===data.activeCompanyId&&r.consent==='approved'&&r.status==='ready_to_send'&&partnerStatus(data,r.fromCompanyId,r.toCompanyId)==='accepted'?{...r,status:'sent' as const,sentAt:new Date().toISOString()}:r)};
}
export function reviewReferral(data:CompanyWorkspace,referralId:string):CompanyWorkspace{
 if(data.view!=='recruiter')return data;
 return {...data,referrals:data.referrals.map(r=>r.id===referralId&&r.toCompanyId===data.activeCompanyId&&r.consent==='approved'&&r.status==='sent'?{...r,status:'reviewed' as const}:r)};
}
export function loadCompanyWorkspace():CompanyWorkspace{
 const fresh=initialCompanyWorkspace();if(typeof window==='undefined')return fresh;
 try{const raw=window.localStorage.getItem(COMPANY_NETWORK_STORAGE);if(!raw)return fresh;const part=JSON.parse(raw) as Partial<CompanyWorkspace>;
 return {...fresh,...part,customCompanies:Array.isArray(part.customCompanies)?part.customCompanies.slice(0,30):[],customCandidates:Array.isArray(part.customCandidates)?part.customCandidates.slice(0,250):[],customJobs:Array.isArray(part.customJobs)?part.customJobs.slice(0,200):[],connections:Array.isArray(part.connections)?part.connections.slice(0,500):fresh.connections,referrals:Array.isArray(part.referrals)?part.referrals.slice(0,200):[],recruiterNotes:part.recruiterNotes&&typeof part.recruiterNotes==='object'?part.recruiterNotes:{},savedCandidates:Array.isArray(part.savedCandidates)?part.savedCandidates:[],view:part.view==='candidate'?'candidate':'recruiter'};
 }catch{return fresh}
}
export function saveCompanyWorkspace(data:CompanyWorkspace){if(typeof window==='undefined')return false;try{localStorage.setItem(COMPANY_NETWORK_STORAGE,JSON.stringify(data));window.dispatchEvent(new Event('proofmatch-company-updated'));return true}catch{return false}}

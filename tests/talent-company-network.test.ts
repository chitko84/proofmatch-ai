import test from 'node:test';
import assert from 'node:assert/strict';
import {CAREER_SECTORS,COMPANIES,OPPORTUNITIES,ROLE_CATALOG} from '../src/lib/career-catalog.ts';
import {TALENT_CANDIDATES,assessTalentForJob,bestCompanyAlternatives,parseTalentSearch,searchTalent} from '../src/lib/talent-ecosystem.ts';
import {SEED_POSTS,NETWORK_PEOPLE} from '../src/lib/network-store.ts';
import {initialCompanyWorkspace,connectedCompanyIds,partnerStatus,connectCompanies,decideConnection,requestReferral,decideReferralConsent,sendReferral,reviewReferral,companyDirectory,allNetworkJobs} from '../src/lib/company-network.ts';
import {lookupTranslation} from '../src/lib/i18n.ts';

test('cross-industry network uses stable complete and connected records',()=>{
 assert.equal(TALENT_CANDIDATES.length,1200);
 assert.equal(COMPANIES.length,200);
 assert.equal(OPPORTUNITIES.length,800);
 assert.equal(SEED_POSTS.length,500);
 assert.ok(CAREER_SECTORS.length>=26);
 assert.ok(ROLE_CATALOG.length>=109);
 assert.equal(new Set(TALENT_CANDIDATES.map(x=>x.id)).size,1200);
 assert.equal(new Set(TALENT_CANDIDATES.map(x=>x.name)).size,1200);
 assert.equal(new Set(COMPANIES.map(x=>x.id)).size,200);
 assert.equal(new Set(OPPORTUNITIES.map(x=>x.id)).size,800);
 const companyIds=new Set(COMPANIES.map(c=>c.id));
 for(const job of OPPORTUNITIES)assert.ok(companyIds.has(job.companyId));
 for(const person of TALENT_CANDIDATES){assert.ok(person.evidence.length>0);assert.ok(OPPORTUNITIES.some(j=>j.id===person.appliedJobId));assert.ok(CAREER_SECTORS.includes(person.sector as typeof CAREER_SECTORS[number]));}
 assert.ok(TALENT_CANDIDATES.filter(c=>c.sector!=='Technology').length>1000);
 assert.ok(SEED_POSTS.filter(p=>p.authorId.startsWith('org-author-')).length>400);
 assert.ok(SEED_POSTS.every(p=>NETWORK_PEOPLE.some(person=>person.id===p.authorId)));
});
test('AI Talent Radar extracts user requirements and returns traceable results',()=>{
 const parsed=parseTalentSearch('Find a Business Analyst in Kuala Lumpur with data analysis and communication, at least 3 years, hybrid');
 assert.equal(parsed.role,'Business Analyst');
 assert.equal(parsed.location,'Kuala Lumpur');
 assert.equal(parsed.minimumYears,3);
 assert.equal(parsed.mode,'Hybrid');
 const results=searchTalent('Find a Business Analyst in Kuala Lumpur with data analysis and communication',20);
 assert.equal(results.length,20);
 assert.ok(results[0].score>=results[1].score);
 assert.ok(results[0].reasons.length>0);
 assert.ok(results.every(r=>r.score>=0&&r.score<=100));
});
test('matching treats claims differently from illustrative portfolio examples',()=>{
 const c=TALENT_CANDIDATES.find(c=>c.sector==='Business & Management')!;
 const job=OPPORTUNITIES.find(j=>j.title===c.title)!;
 const fit=assessTalentForJob(c,job);
 assert.ok(fit.matched>0);
 assert.ok(fit.requirements.some(r=>r.status==='supported'));
 assert.ok(fit.requirements.some(r=>r.status==='claimed'));
 assert.ok(fit.score>0&&fit.score<=100);
 const partners=bestCompanyAlternatives(c,job.companyId,job.id,4);
 assert.ok(partners.length<=4&&partners.every(r=>r.job.companyId===job.companyId));
});
test('partner connection requires both parties and permissions before a referral is forwarded',()=>{
 let s=initialCompanyWorkspace();
 assert.equal(partnerStatus(s,'org-01','org-02'),'accepted');
 assert.ok(connectedCompanyIds(s,'org-01').includes('org-02'));
 const job=OPPORTUNITIES.find(j=>j.companyId==='org-02')!;
 const candidate=TALENT_CANDIDATES.find(c=>c.sector===job.sector)!;
 s=requestReferral(s,candidate.id,'org-02',job.id,'Check candidate evidence');
 assert.equal(s.referrals.length,1);
 assert.equal(s.referrals[0].consent,'pending');
 s=sendReferral(s,s.referrals[0].id);
 assert.equal(s.referrals[0].status,'permission_requested');
 s=decideReferralConsent(s,s.referrals[0].id,'approved');
 assert.equal(s.referrals[0].consent,'pending','recruiters cannot impersonate candidates to approve consent');
 s={...s,view:'candidate'};
 s=decideReferralConsent(s,s.referrals[0].id,'approved');
 assert.equal(s.referrals[0].status,'ready_to_send');
 s=sendReferral(s,s.referrals[0].id);
 assert.equal(s.referrals[0].status,'ready_to_send','candidate perspective cannot forward');
 s={...s,view:'recruiter'};
 s=sendReferral(s,s.referrals[0].id);
 assert.equal(s.referrals[0].status,'sent');
 s={...s,activeCompanyId:'org-02'};
 s=reviewReferral(s,s.referrals[0].id);
 assert.equal(s.referrals[0].status,'reviewed');
});
test('unconnected employers cannot request private referrals',()=>{
 let s=initialCompanyWorkspace();
 const candidate=TALENT_CANDIDATES[0];
 const job=OPPORTUNITIES.find(j=>j.companyId==='org-06')!;
 assert.equal(partnerStatus(s,'org-01','org-06'),'none');
 s=requestReferral(s,candidate.id,'org-06',job.id,'Should not work');
 assert.equal(s.referrals.length,0);
 s=connectCompanies(s,'org-01','org-06');
 assert.equal(partnerStatus(s,'org-01','org-06'),'pending');
 s=requestReferral(s,candidate.id,'org-06',job.id,'Still should not work');
 assert.equal(s.referrals.length,0);
 s=decideConnection(s,'connection-org-01-org-06','accepted','org-01');
 assert.equal(partnerStatus(s,'org-01','org-06'),'pending','only receiving employer may accept');
 s=decideConnection(s,'connection-org-01-org-06','accepted','org-06');
 assert.equal(partnerStatus(s,'org-01','org-06'),'accepted');
 s=requestReferral(s,candidate.id,'org-06',job.id,'Can request permission now');
 assert.equal(s.referrals.length,1);
 s={...s,view:'candidate'};
 s=decideReferralConsent(s,s.referrals[0].id,'declined');
 assert.equal(s.referrals[0].status,'closed');
 s={...s,view:'recruiter'};
 s=sendReferral(s,s.referrals[0].id);
 assert.equal(s.referrals[0].status,'closed');
});
test('custom company, candidate and vacancy can share one persistent workspace model',()=>{
 const original=initialCompanyWorkspace();
 const customCompany={...COMPANIES[0],id:'org-local-1',name:'Local Employer'};
 const customJob={...OPPORTUNITIES[0],id:'job-local-1',companyId:customCompany.id};
 const customCandidate={...TALENT_CANDIDATES[0],id:'talent-local-1'};
 const expanded={...original,customCompanies:[customCompany],customJobs:[customJob],customCandidates:[customCandidate]};
 assert.ok(companyDirectory(expanded).some(c=>c.id===customCompany.id));
 assert.ok(allNetworkJobs(expanded).some(j=>j.id===customJob.id));
});
test('new industries, careers and recruiter interactions are localized offline',()=>{
 for(const locale of ['ms','ta','zh'] as const){
  for(const phrase of ['Talent Intelligence','AI Talent Radar','Company Connections','Referral Center','Request candidate permission','Approve sharing','Fill with sample data','Banking & Insurance','Risk & Compliance Analyst']){
   const translation=lookupTranslation(phrase,locale);assert.ok(translation&&translation!==phrase,`${locale}: ${phrase}`);
  }
 }
});

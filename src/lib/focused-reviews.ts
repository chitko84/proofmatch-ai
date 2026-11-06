export type FocusedReview={candidateId:string;jobId:string;status:'Shortlisted'|'Interview invited'|'Under review'|'Declined';note:string;date:string};
const KEY='proofmatch-focused-reviews-v1';
export const sampleReviews:FocusedReview[]=[
 {candidateId:'talent-0001',jobId:'',status:'Shortlisted',note:'Strong transferable skills; confirm preferred work arrangement.',date:'2026-11-03'},
 {candidateId:'talent-0002',jobId:'',status:'Interview invited',note:'Discuss portfolio and collaboration experience.',date:'2026-11-04'},
 {candidateId:'talent-0003',jobId:'',status:'Under review',note:'Check additional evidence for the alternative role.',date:'2026-11-05'},
 {candidateId:'talent-0004',jobId:'',status:'Declined',note:'Requirements did not align at this time.',date:'2026-11-05'},
 {candidateId:'talent-0005',jobId:'',status:'Shortlisted',note:'Promising experience and career goals.',date:'2026-11-06'}
];
export function readFocusedReviews():FocusedReview[]{if(typeof window==='undefined')return sampleReviews;try{const raw=localStorage.getItem(KEY);if(raw===null)return sampleReviews;const parsed=JSON.parse(raw);return Array.isArray(parsed)?parsed.filter(x=>typeof x.candidateId==='string'&&typeof x.status==='string').slice(0,300):sampleReviews}catch{return sampleReviews}}
export function writeFocusedReview(review:FocusedReview){if(typeof window==='undefined')return;try{const items=readFocusedReviews();const next=[review,...items.filter(x=>!(x.candidateId===review.candidateId&&x.jobId===review.jobId))];localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new Event('proofmatch-focused-review-updated'))}catch{}}

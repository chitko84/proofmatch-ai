/** Fictional presentation examples. Never creates genuine HR actions or external messages. */
import {readReviews,writeReviews} from './reviews.ts';
import {readReplies,validateReply,writeReplies} from './phase3.ts';
import {readLocalInvitations,saveLocalInvitation} from './connect-client.ts';
import type {Invitation} from './connect.ts';
import {createReadyDemoMeeting,readMeetings,saveMeeting} from './liveroom.ts';

export const PRESENTATION_SAMPLE_ID = 'demo-presentation-fairshot-C01-qa';
export const PRESENTATION_INVITE_TOKEN = 'demo-presentation-C01-qa-2026';
export const PRESENTATION_WAIT_TOKEN = 'demo-presentation-C05-qa-2026';

export function presentationSamples(now:string): {invites:Invitation[];reply:ReturnType<typeof validateReply>} {
 const date = !Number.isNaN(Date.parse(now)) ? now : '2026-10-21T12:00:00.000Z';
 return {
  invites:[
   {token:PRESENTATION_INVITE_TOKEN,candidateId:'C01',roleId:'qa',createdAt:date,reply:{interest:'interested',workMode:'hybrid',note:'Fictional presentation reply: I would like to discuss the QA Automation role, its salary range and the team’s working arrangements.',source:'passport',repliedAt:date}},
   {token:PRESENTATION_WAIT_TOKEN,candidateId:'C05',roleId:'qa',createdAt:date,reply:null},
  ],
  reply:validateReply({id:PRESENTATION_SAMPLE_ID,candidateId:'C01',skillId:'api_testing',note:'Fictional work-sample answer: I would reproduce the duplicate order, try a request again using the same identifier, check that only one order is created, and save the API response and logs for HR to discuss.',createdAt:date,origin:'fairshot',taskId:'qa-api'}),
 };
}

/** One-click, repeatable setup. Does not erase previously saved user actions. */
export function preparePresentationExamples(now=new Date().toISOString()) {
 if(typeof window==='undefined')return {reviews:0,replies:0,invitations:0,meetings:0};
 const samples=presentationSamples(now);
 const reviews=readReviews();
 const newReviews={...reviews};
 if(!newReviews['C01:qa'])newReviews['C01:qa']='review';
 if(!newReviews['C02:frontend'])newReviews['C02:frontend']='clarification';
 writeReviews(newReviews);
 const replies=readReplies();
 const nextReplies=replies.some(x=>x.id===samples.reply.id)?replies:[...replies,samples.reply].slice(-30);
 writeReplies(nextReplies);
 const existing=readLocalInvitations();
 for(const record of samples.invites)if(!existing.some(x=>x.token===record.token))saveLocalInvitation(record);
 if(!readMeetings().some(m=>m.id==='meet-proofmatch-showcase'))saveMeeting(createReadyDemoMeeting());
 return {reviews:Object.keys(newReviews).length,replies:nextReplies.length,invitations:readLocalInvitations().length,meetings:readMeetings().length};
}

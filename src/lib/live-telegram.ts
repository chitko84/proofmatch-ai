/** Real delivery for fictional ProofMatch LiveRoom invitations. No phone numbers are used. */
import type {DemoMeeting} from './liveroom.ts';
import {candidates,roles} from './data.ts';

export function demoTelegramPairingUrl(bot:string,code:string):string {
  if(!/^[A-Za-z0-9_]{5,32}$/.test(bot)|| !/^[A-Za-z0-9_-]{8,40}$/.test(code))throw Error('Check the bot name and pairing code.');
  return `https://t.me/${bot}?start=link_${code}`;
}
export function telegramMeetingText(m:DemoMeeting,meetingUrl:string):string {
  const candidate=candidates.find(c=>c.id===m.candidateId);
  const role=roles.find(r=>r.id===m.roleId);
  if(!candidate||!role)throw Error('Choose a candidate and an open job.');
  if(!/^https:\/\//.test(meetingUrl))throw Error('The invitation needs a public HTTPS website.');
  const [date,time]=m.scheduledLocal.split('T');
  // datetime-local input is interpreted as Malaysia local time, never server-local time.
  const [y,mo,d]=date.split('-');
  let hours=Number(time.slice(0,2));const minutes=time.slice(3,5);const period=hours>=12?'PM':'AM';hours=hours%12||12;
  return `📨 ProofMatch AI — Meeting invitation\n\nHi ${candidate.alias}!\n\nThe recruitment team would like to discuss another open opportunity with you.\n\n💼 Role: ${role.title}\n📅 Date: ${d}/${mo}/${y}\n🕒 Time: ${hours}:${minutes} ${period} (Malaysia time, UTC+8)\n⌛ Duration: ${m.durationMinutes} minutes\n📍 Location: ProofMatch LiveRoom\n\nOpen your private invitation to accept, decline, or suggest another time:\n${meetingUrl}\n\nThis is a demonstration using fictional candidate and job details—not an actual job offer.`;
}
export function validSendMeeting(m:DemoMeeting):boolean {
  if(!candidates.some(c=>c.id===m.candidateId)||!roles.some(r=>r.id===m.roleId)||![15,20,30,45,60].includes(m.durationMinutes))return false;
  const when=Date.parse(`${m.scheduledLocal}:00+08:00`);
  return Number.isFinite(when)&&when>Date.now()+60_000&&when<Date.now()+365*86400_000;
}

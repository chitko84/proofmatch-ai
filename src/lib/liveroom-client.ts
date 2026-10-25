'use client';
import {useCallback,useEffect,useState} from 'react';
import {LIVE_ROOM_EVENT,readMeeting,readMeetings,saveMeeting,type DemoMeeting,makeCalendarFile} from './liveroom';
export function useMeetingsSync(){
 const [meetings,setMeetings]=useState<DemoMeeting[]>([]);
 const refresh=useCallback(()=>setMeetings(readMeetings()),[]);
 useEffect(()=>{refresh();window.addEventListener('storage',refresh);window.addEventListener(LIVE_ROOM_EVENT,refresh);const timer=window.setInterval(refresh,3000);return()=>{window.removeEventListener('storage',refresh);window.removeEventListener(LIVE_ROOM_EVENT,refresh);window.clearInterval(timer)}},[refresh]);
 return {meetings,refresh};
}
export function downloadCalendar(record:DemoMeeting,roleTitle:string){
 const content=makeCalendarFile(record,`ProofMatch demo discussion — ${roleTitle}`);
 const blob=new Blob([content],{type:'text/calendar;charset=utf-8'});
 const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=`ProofMatch-${record.id}.ics`;a.click();window.setTimeout(()=>URL.revokeObjectURL(href),1500);
}
export function saveOrError(record:DemoMeeting,setNotice:(value:string)=>void):boolean{
 if(saveMeeting(record)){setNotice('Saved in this browser. Open another tab to see the update.');return true;}
 setNotice('Browser storage is blocked. Please allow site storage or try a normal browser window.');return false;
}
export function meetingFromList(id:string){return readMeeting(id)}

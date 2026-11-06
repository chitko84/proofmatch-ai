'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {createWorkspace,loadWorkspace,saveWorkspace,type WorkspaceState} from './network-store';
export function useNetworkWorkspace(){
 const [workspace,setWorkspace]=useState<WorkspaceState>(createWorkspace);
 const current=useRef<WorkspaceState>(workspace);
 const [ready,setReady]=useState(false);
 const [error,setError]=useState('');
 useEffect(()=>{const data=loadWorkspace();current.current=data;setWorkspace(data);setReady(true);const sync=()=>{const newer=loadWorkspace();current.current=newer;setWorkspace(newer)};window.addEventListener('storage',sync);window.addEventListener('proofmatch-workspace-updated',sync);return()=>{window.removeEventListener('storage',sync);window.removeEventListener('proofmatch-workspace-updated',sync)}},[]);
 const update=useCallback((change:(current:WorkspaceState)=>WorkspaceState)=>{
  const next=change(current.current);current.current=next;setWorkspace(next);
  if(!saveWorkspace(next))setError('Your browser storage is full or unavailable. Try reducing large attachments.');else setError('');
 },[]);
 return {workspace,update,ready,error,setError};
}

'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {initialCompanyWorkspace,loadCompanyWorkspace,saveCompanyWorkspace,type CompanyWorkspace} from './company-network.ts';
export function useCompanyNetwork(){
 const [state,setState]=useState<CompanyWorkspace>(initialCompanyWorkspace);
 const reference=useRef<CompanyWorkspace>(state);
 const [ready,setReady]=useState(false);
 const [error,setError]=useState('');
 useEffect(()=>{function refresh(){const value=loadCompanyWorkspace();reference.current=value;setState(value)}refresh();setReady(true);window.addEventListener('storage',refresh);window.addEventListener('proofmatch-company-updated',refresh);return()=>{window.removeEventListener('storage',refresh);window.removeEventListener('proofmatch-company-updated',refresh)}},[]);
 const update=useCallback((fn:(current:CompanyWorkspace)=>CompanyWorkspace)=>{const next=fn(reference.current);reference.current=next;setState(next);setError(saveCompanyWorkspace(next)?'':'Unable to save these changes in browser storage.')},[]);
 return {state,update,ready,error};
}

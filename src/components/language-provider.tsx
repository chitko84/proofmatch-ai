'use client';

import {usePathname} from 'next/navigation';
import {Check,ChevronDown,Globe2,Languages} from 'lucide-react';
import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {LOCALES,LOCALE_STORAGE_KEY,isLocale,localeInfo,lookupTranslation,type Locale} from '@/lib/i18n';
import {STATIC_UI_PHRASES} from '@/lib/i18n-ui-phrases';

const LanguageContext=createContext<{locale:Locale;setLocale:(value:Locale)=>void}|null>(null);
export function useLanguage(){const state=useContext(LanguageContext);if(!state)throw new Error('Language provider is missing');return state}

export function LanguageProvider({children}:{children:ReactNode}){
 const [locale,setLocaleState]=useState<Locale>('en');
 const setLocale=useCallback((next:Locale)=>{setLocaleState(next);try{localStorage.setItem(LOCALE_STORAGE_KEY,next)}catch{}},[]);
 useEffect(()=>{
  try{const existing=localStorage.getItem(LOCALE_STORAGE_KEY);if(isLocale(existing))setLocaleState(existing)}catch{}
  const onStorage=(event:StorageEvent)=>{if(event.key===LOCALE_STORAGE_KEY&&isLocale(event.newValue))setLocaleState(event.newValue)};
  window.addEventListener('storage',onStorage);return ()=>window.removeEventListener('storage',onStorage);
 },[]);
 useEffect(()=>{document.documentElement.lang=localeInfo(locale).htmlLang},[locale]);
 const value=useMemo(()=>({locale,setLocale}),[locale,setLocale]);
 return <LanguageContext.Provider value={value}><AutomaticPageTranslation/>{children}<StandaloneLanguageSwitcher/></LanguageContext.Provider>;
}

/** Explicitly translates application-generated content such as interview questions and feedback.
 * It deliberately does NOT translate candidate-written answers, private messages, or uploaded evidence.
 * Callers provide only the content they intend to translate using the server-side AI translation service.
 */
const contentTranslations=new Map<string,string>();
export function useTranslatedStrings(strings:readonly string[]){
 const {locale}=useLanguage();
 const [revision,setRevision]=useState(0);
 const signature=JSON.stringify(strings.filter(s=>typeof s==='string'&&s.trim()).map(s=>s.slice(0,850)));
 useEffect(()=>{
  if(locale==='en')return;
  let active=true;
  const values=Array.from(new Set((JSON.parse(signature) as string[]).filter(s=>s.length>=2&&s.length<=850)));
  const missing=values.filter(s=>lookupTranslation(s,locale)===null&&!contentTranslations.has(`${locale}\u0001${s}`)&&!(locale==='zh'&&/[\u3400-\u9fff]/.test(s))&&!(locale==='ta'&&/[\u0b80-\u0bff]/.test(s))&&!(locale==='my'&&/[\u1000-\u109f]/.test(s)));
  async function run(){
   for(let start=0;start<missing.length&&active;){
    const batch:string[]=[];let chars=0;
    while(start<missing.length&&batch.length<18&&chars+missing[start].length<=3300){
     const item=missing[start++];batch.push(item);chars+=item.length;
    }
    if(!batch.length){start++;continue}
    try{
     const response=await fetch('/api/translate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale,texts:batch})});
     if(!response.ok)break;
     const result=await response.json() as {translations?:string[]};
     if(!Array.isArray(result.translations)||result.translations.length!==batch.length)break;
     result.translations.forEach((value,index)=>{
      if(typeof value==='string'&&value.trim())contentTranslations.set(`${locale}\u0001${batch[index]}`,value);
     });
     if(active)setRevision(previous=>previous+1);
    }catch{break}
   }
  }
  void run();return()=>{active=false};
 },[locale,signature]);
 return useCallback((text:string):string=>{
  if(locale==='en')return text;
  return lookupTranslation(text,locale)??contentTranslations.get(`${locale}\u0001${text}`)??text;
 },[locale,revision]);
}

/** Translate immediate UI actions such as native confirmation dialogs synchronously.
 * Browser confirm/alert text cannot be reached by the document translation observer. */
export function useInterfaceText(){
 const {locale}=useLanguage();
 return useCallback((source:string)=>lookupTranslation(source,locale)??contentTranslations.get(`${locale}\u0001${source}`)??source,[locale]);
}

type TextRecord={source:string;displayed:string};
const SKIP='script,style,svg,noscript,pre,code,kbd,samp,[contenteditable="true"],[data-no-translate],[data-private-content],[translate="no"],.nw-message-text,.nw-chat-last,.ci-transcript-interim';
const ATTRIBUTES=['placeholder','aria-label','aria-description','aria-placeholder','aria-roledescription','title','alt','data-tooltip'] as const;
const TRANSLATION_CACHE_KEY='proofmatch-translations-v4';
const MAX_LOCAL_CACHE=2800;
const MAX_TEXT_LENGTH=850;

/**
 * Localizes rendered interface text throughout public and workspace routes.
 * React application state, input values, IDs, and submitted messages are never translated or rewritten.
 * Private workspace data is not sent to the cloud: only phrases known to originate in the source UI.
 */
export function AutomaticPageTranslation(){
 const {locale}=useLanguage();const pathname=usePathname();
 const sources=useRef(new WeakMap<Text,TextRecord>());
 const attrSources=useRef(new WeakMap<Element,Map<string,TextRecord>>());
 const cache=useRef(new Map<string,string>());
 const initialized=useRef(false);
 const sourceTitles=useRef(new Map<string,string>());
 const previousLocale=useRef<Locale>('en');
 useEffect(()=>{
  if(initialized.current)return;initialized.current=true;
  try{
   const stored=JSON.parse(localStorage.getItem(TRANSLATION_CACHE_KEY)||'[]') as unknown;
   if(Array.isArray(stored))for(const entry of stored){
    if(Array.isArray(entry)&&typeof entry[0]==='string'&&typeof entry[1]==='string'&&entry[0].length<1000&&entry[1].length<2300)cache.current.set(entry[0],entry[1]);
   }
  }catch{}
 },[]);
 useEffect(()=>{
  let active=true,observer:MutationObserver|undefined,scheduled=0,flushTimer=0,persistTimer=0;
  let unavailable=false,working=false;
  const pending=new Set<string>(),inflight=new Set<string>(),failed=new Set<string>();
  const publicInformationPage=pathname==='/'||pathname==='/demo/guide'||pathname==='/demo/career'||pathname==='/demo/opportunities'||pathname==='/demo/network/community'||pathname==='/demo/candidate'||pathname==='/demo/news'||pathname==='/demo/resume-clinic'||pathname.startsWith('/demo/network/articles');
  const UI_CONTROLS='button,nav,label,summary,option,[role="button"],[role="tab"],[role="menuitem"],[role="option"]';
  function canProcess(node:Node):boolean{
   const element=node.nodeType===Node.ELEMENT_NODE?node as Element:node.parentElement;
   return !!element&&!element.closest(SKIP)&&!(node.nodeType===Node.TEXT_NODE&&element.closest('textarea,input'));
  }
  function isTranslatable(text:string):boolean{
   const s=text.trim();return s.length>=2&&s.length<=MAX_TEXT_LENGTH&&/[A-Za-z]/.test(s)&&
    !/^(?:[\d\s.:/%+¥$₹RM-]+|https?:\/\/\S+|www\.\S+|\S+@\S+)$/.test(s)&&
    !/^[a-z\d_./-]{2,}@[a-z\d_.-]+$/i.test(s);
  }
  function schedulePersist(){
   if(persistTimer)window.clearTimeout(persistTimer);
   persistTimer=window.setTimeout(()=>{
    persistTimer=0;
    try{localStorage.setItem(TRANSLATION_CACHE_KEY,JSON.stringify(Array.from(cache.current.entries()).slice(-MAX_LOCAL_CACHE)))}catch{}
   },900);
  }
  function canCloudTranslate(source:string,node:Node){
   // Translate every authored interface string on all routes, including workspace routes.
   // Never silently upload private messages, CV excerpts, typed answers or applicant data.
   const element=node.nodeType===Node.ELEMENT_NODE?node as Element:node.parentElement;
   if(!element||element.closest(SKIP))return false;
   if(STATIC_UI_PHRASES.has(source.trim()))return true;
   // Normal controls are part of the application UI, not free-form applicant evidence.
   if(element.closest(UI_CONTROLS)&&source.length<=160&&!/(?:https?:\/\/|@)/.test(source))return true;
   // Public editorial and seeded professional content may be localized automatically.
   return publicInformationPage;
  }
  function translated(source:string,node:Node):string{
   if(locale==='en')return source;
   const curated=lookupTranslation(source,locale);if(curated!==null)return curated;
   const result=cache.current.get(`${locale}\u0001${source}`);
   if(result)return result;
   if(!unavailable&&!failed.has(source)&&!inflight.has(source)&&isTranslatable(source)&&canCloudTranslate(source,node)){
    pending.add(source);scheduleFlush();
   }
   return source;
  }
  function applyText(node:Text){
   if(!active||!node.isConnected||!canProcess(node))return;
   const current=node.nodeValue||'';if(!current.trim())return;
   const prior=sources.current.get(node);
   const source=prior&&(current===prior.displayed||current===prior.source)?prior.source:current;
   if(!isTranslatable(source))return;
   // Preserve option values so a localized select continues to filter with the original stable ID.
   if(node.parentElement?.tagName==='OPTION'){
    const option=node.parentElement as HTMLOptionElement;
    if(!option.hasAttribute('value'))option.setAttribute('value',source.trim());
   }
   const output=translated(source,node);
   sources.current.set(node,{source,displayed:output});
   if(current!==output)node.nodeValue=output;
  }
  function applyAttributes(element:Element){
   if(!active||!element.isConnected||!canProcess(element))return;
   let map=attrSources.current.get(element);if(!map){map=new Map();attrSources.current.set(element,map)}
   for(const attr of ATTRIBUTES){
    const current=element.getAttribute(attr);if(!current)continue;
    const prior=map.get(attr);
    const source=prior&&(current===prior.displayed||current===prior.source)?prior.source:current;
    if(!isTranslatable(source))continue;
    const output=translated(source,element);
    map.set(attr,{source,displayed:output});
    if(current!==output)element.setAttribute(attr,output);
   }
   // Input values are user state and must not be translated. The labels of button-style inputs are UI copy.
   if(element instanceof HTMLInputElement&&['button','submit','reset'].includes(element.type)){
    const current=element.value;
    if(!current||!isTranslatable(current))return;
    const prior=map.get('value');
    const source=prior&&(current===prior.displayed||current===prior.source)?prior.source:current;
    const output=translated(source,element);
    map.set('value',{source,displayed:output});
    if(element.value!==output)element.value=output;
   }
  }
  function scan(root:Node){
   if(!active||!root.isConnected)return;
   if(root.nodeType===Node.TEXT_NODE){applyText(root as Text);return}
   if(root.nodeType!==Node.ELEMENT_NODE)return;
   const el=root as Element;if(!canProcess(el))return;
   applyAttributes(el);
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{
    acceptNode(node){return canProcess(node)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}
   });
   let item:Node|null;
   while((item=walker.nextNode())){
    if(item.nodeType===Node.TEXT_NODE)applyText(item as Text);
    else applyAttributes(item as Element);
   }
  }
  function scheduleFlush(){
   if(flushTimer||unavailable||!active||working)return;
   flushTimer=window.setTimeout(()=>{flushTimer=0;void flush()},240);
  }
  async function flush(){
   if(!pending.size||!active||unavailable||locale==='en'||working)return;
   working=true;
   const batch:string[]=[];let characters=0;
   for(const value of pending){
    if(batch.length>=18||characters+value.length>3300)break;
    pending.delete(value);batch.push(value);characters+=value.length;
   }
   batch.forEach(value=>inflight.add(value));
   const abort=new AbortController();const deadline=window.setTimeout(()=>abort.abort(),22000);
   try{
    const response=await fetch('/api/translate',{
     method:'POST',headers:{'Content-Type':'application/json'},
     body:JSON.stringify({locale,texts:batch}),cache:'no-store',signal:abort.signal
    });
    if(!response.ok){
     if([429,502,503].includes(response.status))unavailable=true;
     batch.forEach(value=>failed.add(value));return;
    }
    const result:unknown=await response.json();
    const translations=(result as {translations?:unknown})?.translations;
    if(!Array.isArray(translations)||translations.length!==batch.length){batch.forEach(value=>failed.add(value));return}
    let changed=false;
    batch.forEach((source,index)=>{
     const value=translations[index];
     if(typeof value==='string'&&value.trim()&&value!==source){
      cache.current.delete(`${locale}\u0001${source}`);
      cache.current.set(`${locale}\u0001${source}`,value);changed=true;
     }else failed.add(source);
    });
    if(cache.current.size>MAX_LOCAL_CACHE){
     for(const key of Array.from(cache.current.keys()).slice(0,cache.current.size-MAX_LOCAL_CACHE))cache.current.delete(key);
    }
    if(changed){schedulePersist();if(active){scan(document.body);localizeTitle()}}
   }catch{batch.forEach(value=>failed.add(value));unavailable=true}
   finally{
    window.clearTimeout(deadline);working=false;batch.forEach(value=>inflight.delete(value));
    if(pending.size&&!unavailable&&active)scheduleFlush();
   }
  }
  // Most pitch sessions start in English. React already renders the original English copy;
  // avoid scanning and observing the entire DOM on each English route transition.
  const priorLocale=previousLocale.current;
  previousLocale.current=locale;
  if(locale==='en'&&priorLocale==='en')return;
  scan(document.body);
  // Keep the browser tab title localized too, without modifying routes or metadata IDs.
  if(!sourceTitles.current.has(pathname))sourceTitles.current.set(pathname,document.title);
  const titleSource=sourceTitles.current.get(pathname)||document.title;
  function localizeTitle(){const source=titleSource;const output=lookupTranslation(source,locale)||cache.current.get(`${locale}\u0001${source}`);document.title=output||source}
  localizeTitle();
  // Returning from a translated language needs one restoration pass, then React will
  // maintain English UI without a global MutationObserver on every click and update.
  if(locale==='en')return;
  const pendingNodes=new Set<Node>();
  observer=new MutationObserver(records=>{
   if(!active)return;
   for(const record of records){
    if(record.type==='characterData'||record.type==='attributes')pendingNodes.add(record.target);
    else if(record.type==='childList')for(const node of Array.from(record.addedNodes))pendingNodes.add(node);
   }
   if(!pendingNodes.size||scheduled)return;
   scheduled=window.requestAnimationFrame(()=>{
    scheduled=0;
    const changed=Array.from(pendingNodes);pendingNodes.clear();
    const roots=changed.filter(node=>node.isConnected&&!changed.some(other=>other!==node&&other.contains(node)));
    for(const node of roots)scan(node);
   });
  });
  observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:[...ATTRIBUTES,'value']});
  return()=>{
   active=false;observer?.disconnect();
   if(scheduled)window.cancelAnimationFrame(scheduled);
   if(flushTimer)window.clearTimeout(flushTimer);
   if(persistTimer)window.clearTimeout(persistTimer);
  };
 },[locale,pathname]);
 return null;
}

export function LanguageSwitcher({compact=false}:{compact?:boolean}){
 const {locale,setLocale}=useLanguage();
 const localeText=(en:string,ms:string,ta:string,zh:string,my:string)=>({en,ms,ta,zh,my})[locale];
 const [open,setOpen]=useState(false);const root=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{
  if(!open)return;
  const onPointer=(event:PointerEvent)=>{if(root.current&&!root.current.contains(event.target as Node))setOpen(false)};
  const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};
  window.addEventListener('pointerdown',onPointer);window.addEventListener('keydown',onKey);
  return ()=>{window.removeEventListener('pointerdown',onPointer);window.removeEventListener('keydown',onKey)};
 },[open]);
 return <div className={`pm-language ${compact?'pm-language-compact':''}`} ref={root} data-no-translate="true">
  <button type="button" className="pm-language-trigger" onClick={()=>setOpen(x=>!x)} aria-haspopup="listbox" aria-expanded={open} aria-label={`${localeText("Change language, current language", "Tukar bahasa, bahasa semasa", "மொழியை மாற்று, தற்போதைய மொழி", "切换语言，当前语言", "ဘာသာစကား ပြောင်းရန်၊ လက်ရှိဘာသာစကား")} ${localeInfo(locale).nativeName}`}>
   <Globe2 size={17}/><span>{locale==='en'?'EN':locale==='ms'?'BM':locale==='ta'?'தமிழ்':locale==='my'?'မြန်မာ':'中文'}</span><ChevronDown size={14} className={open?'pm-rotate':''}/>
  </button>
  {open&&<div className="pm-language-popover" role="group" aria-label={localeText("Language settings", "Tetapan bahasa", "மொழி அமைப்புகள்", "语言设置", "ဘာသာစကား ဆက်တင်များ")}>
   <div className="pm-language-heading"><span className="pm-language-icon"><Languages size={20}/></span><div><strong>{locale==='ms'?'Pilih bahasa':locale==='ta'?'மொழியைத் தேர்ந்தெடுக்கவும்':locale==='zh'?'选择语言':locale==='my'?'ဘာသာစကား ရွေးချယ်ရန်':'Choose language'}</strong><small>{locale==='ms'?'Terjemahan automatik':locale==='ta'?'தானியங்கி மொழிபெயர்ப்பு':locale==='zh'?'自动翻译':locale==='my'?'အလိုအလျောက် ဘာသာပြန်ခြင်း':'Automatic translation'}</small></div></div>
   <div role="listbox" aria-label={localeText("Website language", "Bahasa laman web", "இணையதள மொழி", "网站语言", "ဝက်ဘ်ဆိုက် ဘာသာစကား")} className="pm-language-options">
    {LOCALES.map(l=><button type="button" role="option" aria-selected={locale===l.code} className={locale===l.code?'pm-language-selected':''} key={l.code} onClick={()=>{setLocale(l.code);setOpen(false)}}><span>{l.nativeName}<small>{l.label}</small></span>{locale===l.code&&<Check size={17}/>}</button>)}
   </div>
   <p className="pm-language-footnote">{locale==='ms'?'Nama jenama dan istilah teknikal tertentu kekal asal.':locale==='ta'?'பிராண்டு பெயர்களும் சில தொழில்நுட்பச் சொற்களும் அப்படியே இருக்கும்.':locale==='zh'?'品牌名称和部分专业术语保持原样。':locale==='my'?'အမှတ်တံဆိပ်အမည်နှင့် နည်းပညာဆိုင်ရာ စကားလုံးအချို့ကို မူလအတိုင်း ထားရှိပါသည်။':'Brand names and some technical terms stay unchanged.'}</p>
  </div>}
 </div>;
}

/** Offers the same switcher on standalone passport, invite and meeting links. */
function StandaloneLanguageSwitcher(){
 const pathname=usePathname();
 if(pathname==='/'||pathname.startsWith('/demo'))return null;
 return <div className="pm-language-standalone"><LanguageSwitcher compact/></div>;
}

'use client';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,CalendarClock,UserRound,BriefcaseBusiness} from 'lucide-react';
import {useLanguage} from './language-provider';
import {LANDING_HERO_COPY} from '@/lib/i18n-landing';

/** React-driven localization handles split display lines reliably on first paint after language selection. */
export function LandingHeroCopy(){
  const {locale}=useLanguage();
  const copy=LANDING_HERO_COPY[locale];
  return <div className="hero-copy" data-no-translate="true">
    <div className="eyebrow-pill"><span className="eyebrow-spark"/> {copy.eyebrow}</div>
    <h1>{copy.lineOne}<br/>{copy.lineTwo} <span>{copy.highlight}</span></h1>
    <p>{copy.description}</p>
    <div className="hero-cta-row">
      <Link href="/demo/guide" className="button button-jade button-large">{copy.explore} <ArrowUpRight size={20}/></Link>
      <a href="#how-it-works" className="button button-soft button-large">{copy.seeHow}</a>
    </div>
    <div className="hero-role-entry" role="group" aria-label={locale==='en'?'Choose your workspace':locale==='ms'?'Pilih ruang kerja anda':locale==='ta'?'உங்கள் பணியிடத்தைத் தேர்ந்தெடுக்கவும்':locale==='my'?'သင့်လုပ်ငန်းခွင်ကို ရွေးချယ်ပါ':'选择工作区'}>
      <Link href="/demo/candidate" className="hero-role-entry-link candidate"><UserRound size={19}/><span>{({en:'Candidate View',ms:'Paparan Calon',zh:'求职者视图',ta:'வேட்பாளர் பார்வை',my:'အလုပ်လျှောက်ထားသူ မြင်ကွင်း'})[locale]}</span><ArrowUpRight size={16}/></Link>
      <Link href="/demo" className="hero-role-entry-link recruiter"><BriefcaseBusiness size={19}/><span>{({en:'HR View',ms:'Paparan HR',zh:'招聘方视图',ta:'HR பார்வை',my:'HR မြင်ကွင်း'})[locale]}</span><ArrowUpRight size={16}/></Link>
    </div>
    <Link href="/demo/meetings" className="subtle-link" style={{marginTop:18,display:'inline-flex'}}><CalendarClock size={16}/>{copy.meeting} <ArrowRight size={15}/></Link>
    <div className="hero-hint"><span className="hero-hint-dots"><i/><i/><i/></span>{copy.hint}</div>
  </div>;
}

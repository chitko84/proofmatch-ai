import { Suspense } from 'react';
import PassportClient from './passport-client';
export default function PassportPage(){return <Suspense fallback={<main className="passport-shell"><p>Opening your opportunity…</p></main>}><PassportClient/></Suspense>}

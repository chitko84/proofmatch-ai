import Link from 'next/link';
import { ScanSearch } from 'lucide-react';
export function Brand({inverse=false, compact=false}: {inverse?:boolean, compact?:boolean}) {
  return <Link href="/" className={`brand-lockup ${inverse?'brand-inverse':''}`} aria-label="ProofMatch AI home">
    <span className="brand-symbol"><ScanSearch size={22} strokeWidth={2.4}/></span>
    {!compact && <span className="brand-type">proofmatch<span className="brand-ai">.ai</span></span>}
  </Link>;
}

import {NextRequest,NextResponse} from 'next/server';
import {NEWS_CATEGORIES,newsRssUrl,parseCareerNewsRss,type NewsCategory} from '@/lib/career-news';
export const runtime='nodejs';
const cacheHeaders={'Cache-Control':'public, s-maxage=900, stale-while-revalidate=3600','X-Content-Type-Options':'nosniff'};
export async function GET(request:NextRequest){
 const requested=request.nextUrl.searchParams.get('category')||'All';
 const category:NewsCategory=NEWS_CATEGORIES.includes(requested as NewsCategory)?requested as NewsCategory:'All';
 try{
  // Fixed, server-controlled source URL: clients cannot cause arbitrary outbound fetches.
  const forcedRefresh=request.nextUrl.searchParams.get('refresh')==='1';
  const result=await fetch(newsRssUrl(category),{
   headers:{'Accept':'application/rss+xml, application/xml, text/xml','User-Agent':'ProofMatchCareerNews/1.0'},
   ...(forcedRefresh?{cache:'no-store' as const}:{next:{revalidate:900}}),
   signal:AbortSignal.timeout(7000)
  });
  if(!result.ok)throw new Error('The news source is temporarily unavailable.');
  const xml=(await result.text()).slice(0,1_200_000);
  if(!xml.includes('<rss')&&!xml.includes('<item'))throw new Error('Unexpected news response.');
  const items=parseCareerNewsRss(xml,category);
  return NextResponse.json({items,source:'Google News RSS',fetchedAt:new Date().toISOString(),category},{headers:forcedRefresh?{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}:cacheHeaders});
 }catch{
  return NextResponse.json({items:[],source:'Google News RSS',fetchedAt:null,category,error:'Live headlines are temporarily unavailable. Try refreshing or browse career guides and company updates below.'},{status:503,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }
}

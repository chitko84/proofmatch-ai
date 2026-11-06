/** Parse external news-feed items only. Publication timestamps, publishers and links are supplied by the feed.
 * Never generate or backdate articles to make a feed appear current. */
export type NewsCategory='All'|'Hiring'|'Career Skills'|'Future of Work'|'Malaysia';
export type CareerNewsItem={id:string;title:string;publisher:string;publishedAt:string;url:string;description:string;category:NewsCategory};
export const NEWS_CATEGORIES:NewsCategory[]=['All','Hiring','Career Skills','Future of Work','Malaysia'];
export const NEWS_QUERIES:Record<NewsCategory,string>={
 'All':'(Malaysia jobs hiring recruitment employment careers) when:14d',
 'Hiring':'(Malaysia hiring jobs vacancies recruitment expansion) when:30d',
 'Career Skills':'(skills upskilling graduate careers resumes interviews) Malaysia when:30d',
 'Future of Work':'(AI workforce employment talent automation careers) when:30d',
 'Malaysia':'(Malaysia labour market employment job vacancies) when:30d',
};
/** Google News encodes an HTML anchor inside RSS description XML entities.
 * Decode entities before removing markup; never display feed HTML or tracking URLs as article summaries.
 * We only render plain text. No HTML is ever injected into the document. */
function decodeEntities(input:string):string{
 return input.replace(/&#(x[0-9a-fA-F]+|\d+);/g,(_,n:string)=>{
  const code=n.toLowerCase().startsWith('x')?parseInt(n.slice(1),16):parseInt(n,10);
  return code>0&&code<=0x10ffff?String.fromCodePoint(code):'';
 }).replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/gi,(_,n:string)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ', '#39':"'"} as Record<string,string>)[n.toLowerCase()]||'');
}
function unwrapXml(value:string){return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')}
function expandedEntities(value:string){let text=unwrapXml(value);for(let i=0;i<3;i++){const next=decodeEntities(text);if(next===text)break;text=next}return text}
export function decodeXmlText(input:string):string{
 return expandedEntities(input)
  .replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)\s*>/gi,' ')
  .replace(/<[^>]*>/g,' ')
  .replace(/\s+/g,' ').trim();
}
function rawTag(item:string,name:string){const m=item.match(new RegExp(`<${name}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${name}>`,'i'));return m?m[1]:''}
function tag(item:string,name:string){return decodeXmlText(rawTag(item,name))}
function cleanNewsTitle(title:string,publisher:string){
 const suffix=` - ${publisher}`;
 return title.toLowerCase().endsWith(suffix.toLowerCase())?title.slice(0,-suffix.length).trim():title;
}
/** Google News descriptions are usually headline links with publisher attribution, not editorial article excerpts. */
export function cleanNewsDescription(raw:string):string{
 const expanded=expandedEntities(raw);
 // The anchored Google News RSS description is not a summary. We already show title and publisher above.
 if(/<a\s[^>]*href\s*=/i.test(expanded))return '';
 return decodeXmlText(expanded)
  .replace(/https?:\/\/[^\s<>"']+/gi,'')
  .replace(/(?:&lt;|&gt;|<|>)[^\s]*/gi,'')
  .replace(/\s+/g,' ').trim().slice(0,260);
}
export function parseCareerNewsRss(xml:string,category:NewsCategory='All'):CareerNewsItem[]{
 const out:CareerNewsItem[]=[];const seen=new Set<string>();
 for(const match of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)){
  const item=match[1],publisher=tag(item,'source')||'News source',title=cleanNewsTitle(tag(item,'title').slice(0,230),publisher),url=tag(item,'link'),date=new Date(tag(item,'pubDate'));
  if(!title||!/^https:\/\//i.test(url)||!Number.isFinite(date.getTime())||seen.has(title.toLowerCase()))continue;
  // Reject feed items with invalid or implausibly future publication dates.
  if(date.getTime()>Date.now()+24*3600*1000)continue;
  seen.add(title.toLowerCase());
  out.push({id:`news-${out.length}-${date.getTime()}`,title,publisher,publishedAt:date.toISOString(),url,description:cleanNewsDescription(rawTag(item,'description')),category});
 }
 return out.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,24);
}

/** Stock editorial illustrations: real workplace photography, never the photographed event itself.
 * Curated Unsplash photos already used within ProofMatch's opportunity directory. */
export const CAREER_NEWS_PHOTOS={
 workplace:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=960&q=76&fit=crop',
 team:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=960&q=76&fit=crop',
 meeting:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=960&q=76&fit=crop',
 growth:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=960&q=76&fit=crop',
 people:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=960&q=76&fit=crop',
} as const;
export function newsPhotoFor(item:Pick<CareerNewsItem,'title'|'publisher'|'category'>):string{
 const text=`${item.title} ${item.publisher} ${item.category}`.toLowerCase();
 if(/health|hospital|medical|nurse|patient|clinic|care/.test(text))return CAREER_NEWS_PHOTOS.people;
 if(/educat|student|school|university|graduate|learning|training|skill/.test(text))return CAREER_NEWS_PHOTOS.growth;
 if(/airport|transport|logist|supply|manufactur|flight|worker/.test(text))return CAREER_NEWS_PHOTOS.workplace;
 if(/hiring|recruit|jobs|employment|workforce|staff|vacanc/.test(text))return CAREER_NEWS_PHOTOS.team;
 if(/business|finance|bank|trade|leadership|econom/.test(text))return CAREER_NEWS_PHOTOS.meeting;
 return CAREER_NEWS_PHOTOS.workplace;
}
export function newsRssUrl(category:NewsCategory){const q=NEWS_QUERIES[category];return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-MY&gl=MY&ceid=MY:en`;}

/** Date-stamped, source-linked public reference reports, shown separately from the live feed. */
export const OFFICIAL_LABOUR_REPORTS:CareerNewsItem[]=[
 {id:'dosm-employment-2026q2',title:'Malaysia recorded 195,700 job vacancies in Q2 2026',publisher:'Department of Statistics Malaysia',publishedAt:'2026-08-13T08:00:00.000Z',url:'https://www.dosm.gov.my/portal-main/release-content/employment-statistics-q22026',description:'Official Q2 Employment Statistics report on jobs, filled positions, vacancies and jobs created.',category:'Malaysia'},
 {id:'dosm-labour-market-2026q2',title:'Malaysia Labour Market Review — Second Quarter 2026',publisher:'Department of Statistics Malaysia',publishedAt:'2026-08-27T08:00:00.000Z',url:'https://www.dosm.gov.my/portal-main/release-content/labour-market-review-lmr-q22026',description:'Quarterly analysis of labour force participation, employment, vacancies and productivity.',category:'Malaysia'},
 {id:'bernama-july-2026',title:'Malaysia’s unemployment rate remained at 3.0% in July 2026',publisher:'BERNAMA',publishedAt:'2026-09-11T09:11:00.000Z',url:'https://www.bernama.com/en/news.php?id=2605959',description:'A September report on the Department of Statistics Malaysia July labour force figures.',category:'Malaysia'}
];

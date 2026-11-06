export default function WorkspaceLoading(){
 return <main className="workspace-page" aria-live="polite" aria-busy="true" style={{padding:'24px 12px',maxWidth:1280}}>
  <div style={{height:15,width:150,borderRadius:8,background:'#d8eae4',marginBottom:20}}/>
  <div style={{height:42,width:'min(440px,80%)',borderRadius:10,background:'#dcebe6',marginBottom:16}}/>
  <div style={{height:18,width:'min(620px,95%)',borderRadius:8,background:'#e7f1eb',marginBottom:26}}/>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
   {Array.from({length:3},(_,i)=><div key={i} style={{height:170,borderRadius:16,background:'#f0f7f3',border:'1px solid #dfebe4'}}/>)}
  </div><p style={{fontSize:12,color:'#66817a',marginTop:18}}>Opening your workspace…</p>
 </main>
}

/** Generate the safe public UI vocabulary from authored app source.
 * Run after npm ci: `node scripts/build-i18n-phrases.mjs`.
 * Unlike arbitrary DOM text, these strings are safe for the configured translation endpoint:
 * they originate in source code rather than customer-submitted evidence or messages.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const ts=require('typescript');

const root=path.resolve('src');
const output=path.join(root,'lib/i18n-ui-phrases.ts');
const attrs=new Set(['placeholder','aria-label','aria-description','aria-valuetext','title','alt','label']);
const values=new Set();
function add(input){
 if(typeof input!=='string')return;
 const text=input.replace(/\s+/g,' ').trim();
 if(text.length<2||text.length>850||!/[A-Za-z]/.test(text)||/^(?:https?:\/\/|www\.|\/|\.|#|[\w-]+\.[\w-]{2,})/i.test(text))return;
 if(/^(?:[\w\d-]+(?:\s+[\w\d-]+){0,2})$/.test(text)&&!text.includes(' ')){
  if(/^[-\w\d]{10,}$/.test(text))return; // class tokens and IDs
 }
 if(/^(?:on|aria|data|class|style|stroke|fill|rounded|bg-|text-|hover|border|gap-|flex|grid|w-|h-|px-|py-|mt-|mb-|p-|m-)[\w-]+$/i.test(text))return;
 if(/(?:currentColor|scrollIntoView|addEventListener|application\/|image\/|localStorage|sessionStorage)/.test(text))return;
 if(/[<>={}\\]/.test(text)&&text.length<18)return;
 values.add(text);
}
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(ent=>ent.isDirectory()?files(path.join(dir,ent.name)):/\.(tsx|jsx)$/.test(ent.name)?[path.join(dir,ent.name)]:[])}
for(const file of files(root)){
 const ast=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function expression(node){
  if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))add(node.text);
  else if(ts.isConditionalExpression(node)){expression(node.whenTrue);expression(node.whenFalse)}
  else if(ts.isParenthesizedExpression(node))expression(node.expression);
  else if(ts.isBinaryExpression(node)&&[ts.SyntaxKind.BarBarToken,ts.SyntaxKind.QuestionQuestionToken].includes(node.operatorToken.kind)){
   expression(node.left);expression(node.right)
  }
 }
 function walk(node){
  if(ts.isJsxText(node)){add(node.text);return}
  if(ts.isJsxAttribute(node)&&attrs.has(node.name.text)&&node.initializer&&ts.isStringLiteral(node.initializer))add(node.initializer.text);
  if(ts.isJsxExpression(node)&&node.expression)expression(node.expression);
  if(ts.isCallExpression(node)&&/(?:^|\.)(?:confirm|alert|prompt|setError|setNotice|setMessage|setShareNotice|setLocalError|setPostError)$/.test(node.expression.getText(ast)))node.arguments.forEach(expression);
  ts.forEachChild(node,walk)
 }
 walk(ast);
}
// Built-in professional posts, seeded conversations and career descriptions are authored content,
// not messages entered by visitors. Allow the translation API to localize them on any route.
const seededProperties=new Set(['role','title','sector','category','subject','body','text','description','summary','overview','requirements','responsibilities','detail','skills','location','focus']);
for(const source of ['network-store.ts','career-catalog.ts']){
 const file=path.join(root,'lib',source);
 const ast=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 const walk=node=>{
  if(ts.isPropertyAssignment(node)){
   const key=node.name.getText(ast).replace(/^['"]|['"]$/g,'');
   if(seededProperties.has(key)&&(ts.isStringLiteral(node.initializer)||ts.isNoSubstitutionTemplateLiteral(node.initializer)))add(node.initializer.text);
  }
  ts.forEachChild(node,walk);
 };
 walk(ast);
}
// Short text from authored UI and built-in example cards is additional safe source content.
const legacy=fs.readFileSync(output,'utf8');
for(const match of legacy.matchAll(/^\s*"((?:\\.|[^"\\])*)",?\s*$/gm)){
 try{add(JSON.parse(`"${match[1]}"`))}catch{}
}
const header=`/** Generated from authored UI strings by scripts/build-i18n-phrases.mjs.\n * Do not add applicant-written or private chat content to this vocabulary.\n * It authorizes translation of app-created text, not a guarantee of offline translations.\n */\n`;
const sorted=[...values].sort((a,b)=>a.localeCompare(b,'en'));
fs.writeFileSync(output,header+'export const STATIC_UI_PHRASES: ReadonlySet<string> = new Set('+JSON.stringify(sorted,null,2)+');\n');
console.log(`Generated ${sorted.length} authored UI strings in ${path.relative(process.cwd(),output)}`);

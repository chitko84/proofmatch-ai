import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test.skip('Getting Started cards have distinct stable React keys even when destinations repeat',()=>{
  const source=readFileSync('src/app/demo/guide/page.tsx','utf8');
  assert.match(source,/key=\{`\$\{item\.url\}:\$\{item\.action\}`\}/);
  assert.doesNotMatch(source,/key=\{item\.url\}/);
  const entries=[...source.matchAll(/url:'([^']+)',action:'([^']+)'/g)].map((match)=>({url:match[1],action:match[2]}));
  assert.ok(entries.length>=10,'Guide should retain all existing getting-started links');
  const keys=entries.map(({url,action})=>`${url}:${action}`);
  assert.equal(new Set(keys).size,keys.length,'Guide card identifiers must remain unique');
  assert.ok(entries.filter(({url})=>url==='/demo/talent').length>=2,'Different talent actions may share the same route');
});

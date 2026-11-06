import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=(file:string)=>readFileSync(new URL(file,import.meta.url),'utf8');

test('FAST 3D preset skips detailed shader calculations before light probes',()=>{
 const render=source('../src/components/premium-world-webgl.ts');
 assert.match(render,/uniform float uDetail;/);
 assert.match(render,/if\(uDetail<\.5\)\{/);
 assert.ok(render.indexOf('if(uDetail<.5)')<render.indexOf('vec3 key1='));
 assert.match(render,/graphicsMode==='quality'\?2:graphicsMode==='performance'\?0:1/);
 assert.match(render,/gl\.uniform1f\(this\.uniforms\.uDetail/);
});

test('HIGH 3D preset adds screen bounce and viewport shading without loading assets',()=>{
 const render=source('../src/components/premium-world-webgl.ts');
 assert.match(render,/if\(uDetail>1\.5\)\{/);
 assert.match(render,/screenPool/);
 assert.match(render,/uViewport/);
 assert.match(render,/graphicsMode:'auto'\|'quality'\|'performance'/);
 assert.doesNotMatch(render,/fetch\(|new Image\(/);
});

test('3D focus UI updates only on station changes, not every render frame',()=>{
 const component=source('../src/components/interactive-career-world.tsx');
 assert.match(component,/nearbyStationId\.current!==stationId/);
 assert.match(component,/renderer\.render\(followCamera,now,w,h,Math\.max\(\.75,maxDpr\*quality\),avatar,graphicsMode\)/);
});

test('site-wide fast clicks avoid hover prefetch storms and smooth-scroll delays',()=>{
 const shell=source('../src/components/workspace-shell.tsx');
 const styles=source('../src/app/globals.css');
 const jobs=source('../src/app/demo/opportunities/page.tsx');
 assert.match(shell,/navigationInFlight\.current/);
 assert.match(shell,/now-warmGate\.current<180/);
 assert.match(styles,/html\{scroll-behavior:auto\}/);
 assert.match(jobs,/const companyIndex=useMemo\(\(\)=>new Map\(COMPANIES/);
 assert.match(jobs,/companyIndex\.get\(id\)/);
});

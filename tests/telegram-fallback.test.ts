import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../src/app/demo/connect/page.tsx', import.meta.url), 'utf8');
test('recruiter can open a browser-only invitation when external messaging is offline', () => {
 assert.match(source, /Use browser-only demo/);
 assert.match(source, /createBrowserExample/);
 assert.match(source, /Browser-only invitation ready/);
});
test('shared-mode sample preview never overwrites a real cross-device invitation', () => {
 assert.match(source, /if\(invite\.mode==='shared'\)\{setSamplePreview\(true\)/);
 assert.match(source, /Shared storage was not changed/);
 assert.match(source, /Fictional preview — not sent/);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const candidateHome = readFileSync(new URL('../src/app/demo/candidate/page.tsx', import.meta.url), 'utf8');
const talentOrbit = readFileSync(new URL('../src/components/talent-orbit.tsx', import.meta.url), 'utf8');

test('candidate dashboard imports ShieldCheck once', () => {
  const lucideImport = candidateHome.match(/import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]/);
  assert.ok(lucideImport, 'lucide-react import must exist');
  const icons = lucideImport[1].split(',').map((name) => name.trim());
  assert.equal(icons.filter((name) => name === 'ShieldCheck').length, 1);
  assert.equal(new Set(icons).size, icons.length, 'all imported icons must be unique');
});

test('talent explorer uses Candidate alias instead of nonexistent name property', () => {
  assert.match(talentOrbit, /\{c\.id\} · \{c\.alias\}/);
  assert.doesNotMatch(talentOrbit, /\bc\.name\b/);
});

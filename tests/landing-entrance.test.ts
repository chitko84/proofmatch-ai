import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

test('public landing page mounts the automatic entrance, not an entry CTA wrapper', () => {
  const page = read('../src/app/page.tsx');
  assert.match(page, /<LandingDoorIntro\s*\/>/);
  assert.match(page, /<PublicNav\s*\/>/);
  assert.ok(page.indexOf('<LandingDoorIntro/>') < page.indexOf('<PublicNav/>'));
});

test('automatic entrance supports skip, replay, and reduced motion', () => {
  const intro = read('../src/components/landing-door-intro.tsx');
  const css = read('../src/app/globals.css');
  assert.match(intro, /setTimeout\(\(\) => setOpening\(true\), 820\)/);
  assert.match(intro, /Skip intro/);
  assert.match(intro, /Replay entrance/);
  assert.match(intro, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.landing-door-intro\.is-opening \.landing-door-left/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{\.landing-door-intro\{display:none/);
});

test('Next development logo disabled and custom ProofMatch tab icon exists', () => {
  const config = read('../next.config.mjs');
  const svg = read('../src/app/icon.svg');
  assert.match(config, /devIndicators:\s*false/);
  assert.match(config, /poweredByHeader:\s*false/);
  assert.match(svg, /<svg /);
  assert.match(svg, /#102C38/);
});

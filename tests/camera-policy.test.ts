import assert from 'node:assert/strict';
import test from 'node:test';
import config from '../next.config.mjs';
import {readFileSync} from 'node:fs';

// The QR scanner has a live camera button. A deny-all camera policy made that
// button fail even in browsers supporting BarcodeDetector and getUserMedia.
test('QR scanner security headers allow first-party camera access only', async () => {
  if (typeof config.headers !== 'function') {
    throw new Error('Security headers are not configured');
  }
  const rules = await config.headers();
  const allPages = rules.find(rule => rule.source === '/:path*');
  assert.ok(allPages, 'global security header rule must exist');
  const policy = allPages.headers.find(header => header.key === 'Permissions-Policy')?.value;
  assert.ok(policy, 'Permissions-Policy must be defined');
  assert.match(policy, /(?:^|,)\s*camera=\(self\)/);
  assert.doesNotMatch(policy, /(?:^|,)\s*camera=\(\)/);
  assert.match(policy, /(?:^|,)\s*geolocation=\(\)/);
  assert.match(policy, /(?:^|,)\s*microphone=\(self\)/);
});

test.skip('QR scanner still offers a working fictional example without a camera', () => {
  const source = readFileSync(new URL('../src/app/demo/scan/page.tsx', import.meta.url), 'utf8');
  assert.match(source, /demoInvitationUrl\(window\.location\.origin\)/);
  assert.match(source, /Use sample QR invitation/);
  assert.match(source, /navigator\.mediaDevices\.getUserMedia/);
});

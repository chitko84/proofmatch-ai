import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'ProofMatch AI | Great talent deserves to be seen', template: '%s | ProofMatch AI' },
  description: 'Explore overlooked candidate-to-job matches, see the supporting evidence, and make informed human decisions. Fictional-data prototype for AIFM 2026.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}

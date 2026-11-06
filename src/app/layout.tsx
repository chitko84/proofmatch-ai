import type { Metadata, Viewport } from 'next';
import './globals.css';
import {LanguageProvider} from '@/components/language-provider';

export const metadata: Metadata = {
  title: { default: 'ProofMatch AI | Great talent deserves to be seen', template: '%s | ProofMatch AI' },
  description: 'Explore overlooked candidate-to-job matches, see the supporting evidence, and make informed human decisions. Evidence-led career exploration, interview practice, opportunity discovery and networking.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body><LanguageProvider>{children}</LanguageProvider></body></html>;
}

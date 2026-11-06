/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Hide the Next.js development badge ("N") in the browser.
  devIndicators: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), geolocation=(), microphone=(self)' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        // Tiny local comic covers should be reusable across page visits.
        // The embedded third-party flipbook itself is never cached here.
        source: '/comics/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=86400' }],
      },
    ];
  },
};

export default nextConfig;

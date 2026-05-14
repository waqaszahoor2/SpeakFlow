/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export when building for Android, let Vercel use default (serverless)
  ...(process.env.CAPACITOR_BUILD === '1' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

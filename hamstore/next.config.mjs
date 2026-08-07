/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
}

/* A relative `assetPrefix` would make the export open by double-clicking
   index.html, but next/font refuses one — it needs a leading slash or an
   absolute URL. So the export is served, not opened: any static host, or
   `npx serve out` locally. The single-file build in the artifact is the one
   that opens straight off the filesystem. */

export default nextConfig

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* The repo root also has a lockfile (the Vite pages live there). Pin tracing
     to this app so Next doesn't infer the parent directory as the workspace. */
  outputFileTracingRoot: __dirname,
}

export default nextConfig

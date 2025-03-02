/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
    },
    images: {
        domains: [process.env.BACKEND_BASE_URL, 'localhost'],
    },
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    output: 'standalone',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
};

export default nextConfig;

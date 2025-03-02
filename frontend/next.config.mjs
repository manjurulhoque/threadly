/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_BASE_URL: 'http://localhost:8080',
        NEXTAUTH_SECRET: 'my-secret'
    },
    images: {
        domains: ['localhost'],
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

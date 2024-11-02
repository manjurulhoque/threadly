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
    }
};

export default nextConfig;

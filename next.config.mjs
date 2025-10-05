/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    eslint: {
        // Allow production builds to successfully complete even if
        // there are ESLint errors. CI still runs a separate lint step.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;

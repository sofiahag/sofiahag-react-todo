/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
            fs: false,
            };
        }
        return config;
    },
};

module.exports = {
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: '/',
            },
        ];
    },
};

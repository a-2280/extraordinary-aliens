/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/sanity/lib/imageLoader.js',
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' }
    ]
  }
};

export default nextConfig;

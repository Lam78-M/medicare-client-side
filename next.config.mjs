/** @type {import('next').NextConfig} */
const nextConfig = {
  /* রিয়্যাক্ট কম্পাইলার একটিভ করা হলো */
  reactCompiler: true,

  /* আনস্প্ল্যাশ থেকে ইমেজ লোড করার পারমিশন দেওয়া হলো */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
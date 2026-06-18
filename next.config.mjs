/** @type {import('next').NextConfig} */
const nextConfig = {
  /* রিয়্যাক্ট কম্পাইলার একটিভ করা হলো */
  reactCompiler: true,

  /* ইন্টারনেটের যেকোনো লিংক থেকে ইমেজ লোড করার গ্লোবাল পারমিশন */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 🚀 এই ডাবল স্টার মানে পৃথিবীর যেকোনো HTTPS ডোমেইনের ইমেজ এখানে সাপোর্ট করবে!
      },
      {
        protocol: 'http',
        hostname: '**', // সেফটির জন্য HTTP লিংকগুলোর জন্যও ওপেন করে দেওয়া হলো
      },
    ],
  },
};

export default nextConfig;
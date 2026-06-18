import { HeroBanner } from "@/components/HeroBanner";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ব্যানার কম্পোনেন্ট এখানে বসলো */}
         <HeroBanner></HeroBanner>
     
      
      {/* এর নিচে পরবর্তীতে আমাদের স্ট্যাটিস্টিক্স ও ফিচারড ডক্টর সেকশনগুলো আসবে */}
    </main>
  );
}
import { HeroBanner } from "@/components/HeroBanner";
import Specializations from "@/components/Specializations";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F5F5]">
      {/* ব্যানার কম্পোনেন্ট এখানে বসলো */}
         <HeroBanner></HeroBanner>
         <Specializations></Specializations>
      
      {/* এর নিচে পরবর্তীতে আমাদের স্ট্যাটিস্টিক্স ও ফিচারড ডক্টর সেকশনগুলো আসবে */}
    </main>
  );
}
import Specializations from "@/components/Specializations";
import HomePage from "./homepage/page";
import WhyChooseUs from "@/components/WhyChooseUs";
import PlatformStats from "@/components/PlatFormStats";


export default function Home() {
  return (
  <div>
    <main>
 <HomePage></HomePage>
 <Specializations></Specializations>
 <PlatformStats></PlatformStats>
 <WhyChooseUs></WhyChooseUs>
    </main>
  </div>
  );
}

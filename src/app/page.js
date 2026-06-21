import Specializations from "@/components/Specializations";
import HomePage from "./homepage/page";
import WhyChooseUs from "@/components/WhyChooseUs";
import PlatformStats from "@/components/PlatFormStats";
import DoctorStats from "@/components/dashboard/DoctorStats";
import FeaturedDoctors from "@/components/FeaturedDoctors";




export default function Home() {
  return (
  <div>
    <main>
 <HomePage></HomePage>
 <Specializations></Specializations>
 <FeaturedDoctors></FeaturedDoctors>
 <PlatformStats></PlatformStats>
 <WhyChooseUs></WhyChooseUs>

    </main>
  </div>
  );
}

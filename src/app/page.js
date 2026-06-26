import Specializations from "@/components/Specializations";
import HomePage from "./homepage/page";
import WhyChooseUs from "@/components/WhyChooseUs";
import PlatformStats from "@/components/PlatFormStats";

import FeaturedDoctors from "@/components/FeaturedDoctors";
import PatientReviewState from "@/components/PatientReviewState";
import Achievements from "@/components/Achievements";




export default function Home() {
  return (
  <div>
    <main>
 <HomePage></HomePage>
 <Specializations></Specializations>
 <FeaturedDoctors></FeaturedDoctors>

 <PlatformStats></PlatformStats>
 <PatientReviewState></PatientReviewState>
  <Achievements></Achievements>
 <WhyChooseUs></WhyChooseUs>


    </main>
  </div>
  );
}

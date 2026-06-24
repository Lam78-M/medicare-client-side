import Specializations from "@/components/Specializations";


export const metadata = {
  title: "Medical Specializations | MediCare Connect",
  description: "Explore our wide range of specialized medical departments.",
};

export default function SpecializationsPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F5]">

      <div className="bg-[#021A54] text-white py-16 px-6 text-center border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[#FF85BB]/5 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-[#FF85BB] text-xs uppercase font-extrabold tracking-widest bg-[#FFCEE3]/10 px-4 py-1.5 rounded-full border border-[#FF85BB]/20">
            Departments
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Our Medical <span className="text-[#FF85BB]">Specialties</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Find the right care for your loved ones by browsing through our specialized clinical departments led by top experts.
          </p>
        </div>
      </div>


      <div className="py-8">
        <Specializations></Specializations>
      </div>
    </main>
  );
}
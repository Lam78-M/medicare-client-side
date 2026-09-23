import { Activity, Heart, Droplets, MoonStar, Salad, Sparkles, TimerReset, TrendingUp, Dumbbell, ShieldCheck, ArrowRight } from "lucide-react";

const wellnessOverview = [
  { label: "BMI", value: "22.4", hint: "Healthy range" },
  { label: "Daily calories", value: "2,100 kcal", hint: "Estimated target" },
  { label: "Water intake", value: "2.1L", hint: "Today" },
  { label: "Activity", value: "72 min", hint: "Movement goal" },
];

const exerciseCards = [
  {
    name: "Cardio Boost",
    description: "Short, energetic sessions that elevate your heart rate and improve endurance.",
    level: "Beginner to Intermediate",
    benefits: "Heart health, stamina, stress relief",
    icon: Activity,
  },
  {
    name: "Strength Circuit",
    description: "Simple resistance exercises that build muscle strength and support daily movement.",
    level: "Intermediate",
    benefits: "Muscle tone, metabolism, posture",
    icon: Dumbbell,
  },
  {
    name: "Flexibility Flow",
    description: "Gentle stretching and mobility work to improve range of motion and comfort.",
    level: "All levels",
    benefits: "Mobility, recovery, relaxation",
    icon: Sparkles,
  },
  {
    name: "Core Stability",
    description: "Focused movement to strengthen the midsection and support balance and posture.",
    level: "Beginner",
    benefits: "Balance, posture, core control",
    icon: Heart,
  },
  {
    name: "Full-Body Routine",
    description: "A balanced workout plan that combines cardio, strength, and mobility elements.",
    level: "All levels",
    benefits: "Efficiency, full-body energy, consistency",
    icon: TrendingUp,
  },
  {
    name: "Beginner Start",
    description: "Low-impact activities designed to introduce movement habits in a safe way.",
    level: "Beginner",
    benefits: "Confidence, consistency, gentle progress",
    icon: ShieldCheck,
  },
];

const ageGroups = [
  {
    group: "Children",
    focus: "Play-based movement, coordination, and fun routines",
    duration: "30–45 min, 3–5 days a week",
    accent: "from-pink-100 to-rose-100",
  },
  {
    group: "Teenagers",
    focus: "Active play, strength training with supervision, and regular movement breaks",
    duration: "45–60 min, 3–4 days a week",
    accent: "from-indigo-100 to-blue-100",
  },
  {
    group: "Young adults",
    focus: "Cardio, strength, and habit building for long-term wellness",
    duration: "30–50 min, 4–5 days a week",
    accent: "from-emerald-100 to-teal-100",
  },
  {
    group: "Adults",
    focus: "Balanced routines that support energy, posture, and stress management",
    duration: "30–45 min, most days",
    accent: "from-violet-100 to-purple-100",
  },
  {
    group: "Older adults",
    focus: "Gentle mobility, balance work, and low-impact movement for confidence and comfort",
    duration: "20–30 min, daily or several times weekly",
    accent: "from-amber-100 to-orange-100",
  },
];

const wellnessTips = [
  { title: "Stay active", text: "Aim for regular movement throughout the day, even short walks help.", icon: Activity },
  { title: "Hydrate well", text: "Keep water nearby and sip consistently, especially during exercise or heat.", icon: Droplets },
  { title: "Sleep better", text: "Build a calming wind-down routine and aim for consistent sleep hours.", icon: MoonStar },
  { title: "Eat balanced meals", text: "Include protein, fiber, healthy fats, and colorful produce in your meals.", icon: Salad },
  { title: "Move gently", text: "Mix high-energy activity with recovery and rest to support long-term wellness.", icon: TimerReset },
];

export default function WellnessPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[28px] bg-[#021A54] p-6 text-white shadow-[0_30px_70px_rgba(2,26,84,0.18)] md:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center rounded-full border border-[#FF85BB]/50 bg-[#FF85BB]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#FFCEE3]">
                Wellness hub
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Build a healthier routine that feels sustainable.
              </h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-300">Wellness score</span>
              <span className="mt-2 block text-3xl font-black text-[#FFCEE3]">82%</span>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#FF85BB]">Overview</p>
              <h2 className="text-2xl font-black text-[#021A54] md:text-3xl">Your wellness snapshot</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {wellnessOverview.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                <div className="mt-4 text-3xl font-black text-[#021A54]">{item.value}</div>
                <p className="mt-1 text-sm text-slate-500">{item.hint}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#FF85BB]">Exercise</p>
              <h2 className="text-2xl font-black text-[#021A54] md:text-3xl">Recommended movement plans</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {exerciseCards.map(({ name, description, level, benefits, icon: Icon }) => (
              <article key={name} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFCEE3] text-[#021A54]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                    {level}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#021A54]">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>

                <div className="mt-5 rounded-2xl bg-[#f7f9ff] p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Benefits</p>
                  <p className="mt-2 text-sm font-medium text-[#021A54]">{benefits}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#FF85BB]">Guide</p>
            <h2 className="text-2xl font-black text-[#021A54] md:text-3xl">Age-based exercise guidance</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
            {ageGroups.map(({ group, focus, duration, accent }) => (
              <div key={group} className={`rounded-[24px] border border-slate-200 bg-gradient-to-br ${accent} p-4 shadow-sm`}>
                <div className="mb-4 inline-flex rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700">
                  {group}
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{focus}</p>
                <div className="mt-5 rounded-2xl bg-white/80 p-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {duration}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#FF85BB]">Habits</p>
            <h2 className="text-2xl font-black text-[#021A54] md:text-3xl">Simple wellness tips</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {wellnessTips.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFCEE3] text-[#021A54]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-[#021A54]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#FFCEE3] bg-gradient-to-r from-[#FFF7FB] to-[#F5F7FF] p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF85BB]">Next step</p>
              <h3 className="mt-1 text-2xl font-black text-[#021A54]">Keep your progress steady and realistic.</h3>
            </div>
            <a
              href="/dashboard/patient"
              className="inline-flex items-center gap-2 rounded-xl bg-[#021A54] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b2f7a]"
            >
              Return to dashboard
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

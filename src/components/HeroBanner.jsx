"use client";
import { ArrowRight, CalendarCheck2, HeartPulse, ShieldCheck, Star, Stethoscope } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const trustItems = [
  { label: "Verified Specialists", value: "250+" },
  { label: "Patient Satisfaction", value: "4.9/5" },
  { label: "Online Consults", value: "24/7" },
];

export function HeroBanner() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#021A54] shadow-[0_30px_80px_rgba(2,26,84,0.25)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,133,187,0.24),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(255,206,227,0.2),transparent_30%)]" />
        <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-[#FF85BB]/20 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-[#FFCEE3]/10 blur-3xl" />

        <div className="relative grid items-center gap-10 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-16 lg:py-16">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF85BB]/40 bg-[#FFCEE3]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFCEE3]">
              <ShieldCheck className="h-4 w-4" />
              Trusted digital care
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
                Feel better,
                <span className="block text-[#FF85BB]">faster with care</span>
                that fits your life.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                Connect with experienced doctors, manage appointments, and stay on top of your health goals from one streamlined care platform.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF85BB] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF85BB]/25 transition hover:-translate-y-0.5 hover:bg-[#ff6da8]"
              >
                Book appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/wellness"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore wellness hub
              </Link>
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {trustItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-black text-white">{item.value}</div>
                  <div className="mt-1 text-xs text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm">
              <div className="overflow-hidden rounded-[24px]">
                <Image
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=900"
                  alt="Doctor consulting with patient"
                  width={640}
                  height={760}
                  className="h-[440px] w-full object-cover"
                  priority
                />
              </div>

              <div className="absolute -left-4 bottom-8 w-52 rounded-2xl border border-white/10 bg-[#021A54]/90 p-4 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFCEE3] text-[#021A54]">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-slate-300">Care plan</div>
                    <div className="font-bold text-white">Personalized</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 top-6 w-44 rounded-2xl border border-white/10 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-2 text-[#021A54]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFCEE3]">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Top-rated</div>
                    <div className="font-black text-[#021A54]">4.9 Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: Stethoscope, title: "Expert doctors", text: "Book from specialists across primary care and wellness." },
          { icon: CalendarCheck2, title: "Smart scheduling", text: "Coordinate checkups and follow-ups without delays." },
          { icon: ShieldCheck, title: "Secure records", text: "A trusted workflow built for better long-term health management." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFCEE3] text-[#021A54]">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-[#021A54]">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { Users, UserCheck, Activity, Star, ShieldCheck, Sparkles } from 'lucide-react';

export default function Achievements() {
  const stats = [
    { value: '250+', label: 'Verified doctors', tone: 'dark', icon: UserCheck },
    { value: '50K+', label: 'Active patients', tone: 'light', icon: Users },
    { value: '98.7%', label: 'Satisfaction rate', tone: 'dark', icon: Sparkles },
    { value: '24/7', label: 'Support access', tone: 'light', icon: ShieldCheck },
  ];

  return (
    <section className="bg-[#F8FAFF] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full border border-[#FF85BB]/30 bg-[#FFCEE3] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#021A54]">
            Our impact
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#021A54] sm:text-4xl md:text-5xl">
            Achievements that reflect <span className="text-[#FF85BB]">trusted care</span>
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((item, index) => {
            const Icon = item.icon;
            const isDark = item.tone === 'dark';

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className={`${isDark ? 'bg-[#021A54] text-white' : 'bg-[#FFCEE3] text-[#021A54]'} rounded-[30px] p-6 shadow-[0_18px_35px_rgba(2,26,84,0.09)]`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white/40'}`}>
                    <Icon size={22} className={isDark ? 'text-[#FF85BB]' : 'text-[#021A54]'} />
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${isDark ? 'bg-[#FFCEE3] text-[#021A54]' : 'bg-[#021A54] text-white'}`}>
                    Live
                  </span>
                </div>

                <div className="text-4xl font-black sm:text-5xl">{item.value}</div>
                <div className={`mt-2 text-xs font-bold uppercase tracking-[0.18em] ${isDark ? 'text-slate-300' : 'text-[#021A54]/70'}`}>
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
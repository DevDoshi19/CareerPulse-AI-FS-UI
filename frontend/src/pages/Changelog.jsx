import { motion } from 'framer-motion';
import { fadeUp } from '../components/UIComponents';
import SoftAurora from '../components/SoftAurora';

export default function Changelog() {
  const versions = [
    { version: 'v2.0.0', date: 'March 2026', features: ['Complete UI overhaul to Finpay aesthetic', 'Dark Mode support', 'ChatGPT-style Career Coach interface', 'Bento-grid Home page'] },
    { version: 'v1.1.0', date: 'February 2026', features: ['Added PDF generation for Resume Builder', 'Improved ATS keyword matching algorithm', 'Added stream support for Career Coach'] },
    { version: 'v1.0.0', date: 'January 2026', features: ['Initial launch', 'Basic Resume rewriting', 'Basic ATS analysis'] },
  ];

  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 z-0 hidden dark:block opacity-60">
        <SoftAurora color1="#061b27" color2="#000000" speed={0.4} />
      </div>

      <div className="max-w-[800px] mx-auto px-8 pt-24 pb-32 relative z-10">
        <motion.div initial="hidden" animate="visible">
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-accent mb-6">
              Resources / Changelog
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={0.5} className="text-[40px] md:text-[48px] font-extrabold text-teal-900 dark:text-white tracking-[-0.03em] leading-tight transition-colors">
            What's new in CareerForge.
          </motion.h1>
          <motion.p variants={fadeUp} custom={1} className="text-[16px] text-slate-500 dark:text-slate-400 mt-6 max-w-[500px] leading-relaxed transition-colors">
            Follow our journey as we continuously improve our AI models and user experience.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 space-y-12 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800"
        >
          {versions.map((ver, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white dark:border-slate-950 bg-teal-900 dark:bg-teal-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-white dark:bg-slate-950" />
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-xl p-6 transition-colors shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-teal-900 dark:text-white text-[15px]">{ver.version}</span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{ver.date}</span>
                </div>
                <ul className="list-disc pl-4 space-y-2 text-[13px] text-slate-600 dark:text-slate-400">
                  {ver.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { fadeUp } from '../components/UIComponents';

export default function Changelog() {
  const versions = [
    { version: 'v2.0.0', date: 'March 2026', features: ['Complete UI overhaul to Finpay aesthetic', 'Dark Mode support', 'ChatGPT-style Career Coach interface', 'Bento-grid Home page'] },
    { version: 'v1.1.0', date: 'February 2026', features: ['Added PDF generation for Resume Builder', 'Improved ATS keyword matching algorithm', 'Added stream support for Career Coach'] },
    { version: 'v1.0.0', date: 'January 2026', features: ['Initial launch', 'Basic Resume rewriting', 'Basic ATS analysis'] },
  ];

  return (
    <div className="flex-1 relative overflow-hidden">

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
          className="mt-16 w-full relative h-full"
        >
          {/* Strict Centered Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>

          <div className="space-y-16 lg:space-y-24">
            {versions.map((ver, i) => {
              const isEven = i % 2 === 0;
              return (
              <div key={i} className="relative w-full flex items-center min-w-0">
                
                {/* Absolute Centered Dot (Rule 1 Fix) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 bg-teal-900 dark:bg-teal-500 z-10 flex items-center justify-center shadow-sm"></div>
                
                {/* Card Layout: Alternating spacing preventing overflow (Rule 2 Fix) */}
                <div className={`w-[calc(50%-24px)] md:w-[calc(50%-48px)] min-w-0 ${isEven ? 'mr-auto' : 'ml-auto'}`}>
                  <div className="w-full bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm min-w-0 overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <span className="font-bold text-teal-900 dark:text-white text-[15px] truncate">{ver.version}</span>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{ver.date}</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-[13px] text-slate-600 dark:text-slate-400">
                      {ver.features.map((f, j) => <li key={j} className="break-words">{f}</li>)}
                    </ul>
                  </div>
                </div>

              </div>
            )})}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { fadeUp } from '../components/UIComponents';
import SoftAurora from '../components/SoftAurora';

export default function Guides() {
  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 z-0 hidden dark:block opacity-60">
        <SoftAurora color1="#061b27" color2="#000000" speed={0.4} />
      </div>

      <div className="max-w-[1200px] mx-auto px-8 pt-24 pb-20 relative z-10">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl">
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-accent mb-6">
              Resources / Guides
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={0.5} className="text-[40px] md:text-[48px] font-extrabold text-teal-900 dark:text-white tracking-[-0.03em] leading-tight transition-colors">
            Step-by-step guides to master CareerForge AI.
          </motion.h1>
          <motion.p variants={fadeUp} custom={1} className="text-[16px] text-slate-500 dark:text-slate-400 mt-6 max-w-[500px] leading-relaxed transition-colors">
            Comprehensive tutorials to help you get the most out of our AI Resume Builder, ATS Scanner, and Career Coach.
          </motion.p>
        </motion.div>

        {/* Guides List Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 space-y-4"
        >
          {['Getting Started with Resume Builder', 'Understanding your ATS Score', 'Prompt Engineering for Career Coach'].map((title, i) => (
            <div key={i} className="flex items-center gap-6 bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-xl p-6 transition-all hover:border-teal-900 dark:hover:border-teal-500 cursor-pointer">
              <div className="w-16 h-16 rounded-lg bg-teal-50 dark:bg-neutral-900 flex items-center justify-center text-teal-900 dark:text-white font-bold text-xl">
                {i + 1}
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-teal-900 dark:text-white">{title}</h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">A detailed 5-minute read.</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

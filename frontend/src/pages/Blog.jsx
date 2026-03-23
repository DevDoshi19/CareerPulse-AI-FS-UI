import { motion } from 'framer-motion';
import { fadeUp } from '../components/UIComponents';
import SoftAurora from '../components/SoftAurora';

export default function Blog() {
  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 z-0 hidden dark:block opacity-60">
        <SoftAurora color1="#061b27" color2="#000000" speed={0.4} />
      </div>

      <div className="max-w-[1200px] mx-auto px-8 pt-24 pb-20 relative z-10">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl">
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-accent mb-6">
              Resources / Blog
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={0.5} className="text-[40px] md:text-[48px] font-extrabold text-teal-900 dark:text-white tracking-[-0.03em] leading-tight transition-colors">
            Insights on AI, careers, and the future of work.
          </motion.h1>
          <motion.p variants={fadeUp} custom={1} className="text-[16px] text-slate-500 dark:text-slate-400 mt-6 max-w-[500px] leading-relaxed transition-colors">
            Stay up to date with the latest strategies for leveraging artificial intelligence to accelerate your career growth.
          </motion.p>
        </motion.div>

        {/* Placeholder for content grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {['How to write an AI-proof resume', 'Mastering the ATS score', 'Interview prep with Career Coach'].map((title, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors">
              <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-lg mb-5 animate-pulse" />
              <p className="text-[11px] font-semibold text-accent mb-2">Category</p>
              <h3 className="text-[16px] font-bold text-teal-900 dark:text-white leading-tight mb-2">{title}</h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">Read the full article to learn more about this strategy...</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

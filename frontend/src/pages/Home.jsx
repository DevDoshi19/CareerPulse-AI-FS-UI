import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeUp, ArrowUpRight } from '../components/UIComponents';
import LineWaves from '../components/LineWaves';
import FlowingMenu from '../components/FlowingMenu';

const ease = [0.22, 1, 0.36, 1];

function AnimatedSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ y: 30, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const bentoGridRef = useRef(null);
  
  const flowingMenuItems = [
    { link: '/resume', text: 'Resume Builder', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop' },
    { link: '/ats', text: 'ATS Scanner', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop' },
    { link: '/chat', text: 'Career Coach', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop' },
    { link: '/blog', text: 'Resources', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=600&auto=format&fit=crop' }
  ];

  return (
    <div className="flex-1 overflow-hidden relative selection:bg-slate-900 selection:text-white dark:selection:bg-teal-500 dark:selection:text-slate-950">
      
      {/* ─── Hero Section (Massive Impact) ─── */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-32 px-6">
        {/* Interactive WebGL Background */}
        <div className="absolute inset-0 z-0 hidden dark:block opacity-60">
          <LineWaves color1="#06b6d4" color2="#000000" color3="#0B2838" speed={0.4} warpIntensity={1.2} />
        </div>
        <div className="absolute inset-0 z-0 block dark:hidden opacity-30">
          <LineWaves color1="#22d3ee" color2="#ffffff" color3="#f1f5f9" speed={0.4} warpIntensity={0.8} />
        </div>

        <div className="max-w-[900px] mx-auto text-center relative z-10 pointer-events-none">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
            <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
              CareerForge AI 2.0 is live
            </span>
          </motion.div>

          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUp} custom={0.2}
            className="text-[56px] md:text-[80px] font-extrabold text-slate-950 dark:text-white leading-[1.05] tracking-[-0.04em] mb-8"
          >
            Elevate your career with <span className="text-violet-900 dark:text-slate-500">AI-powered</span> precision.
          </motion.h1>

          <motion.p 
            initial="hidden" animate="visible" variants={fadeUp} custom={0.3}
            className="text-[18px] md:text-[20px] text-slate-600 dark:text-slate-400 max-w-[600px] mx-auto leading-relaxed mb-12"
          >
            Build ATS-optimized resumes, get real-time match scores, and prep for interviews with your personal AI Career Coach.
          </motion.p>
          
          {/* Hero CTAs */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp} custom={0.4}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
          >
            <Link 
              to="/resume"
              className="btn-hover w-full sm:w-auto px-8 py-4 rounded-full bg-teal-900 dark:bg-teal-500 text-white dark:text-white text-[15px] font-bold"
            >
              Start Building Free
            </Link>
            <Link 
              to="/chat"
              className="btn-hover w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-[15px] font-bold hover:bg-slate-50 dark:hover:bg-[#1E293B]"
            >
              Talk to Career Coach
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Bento Grid Section (Replaces the 3 Boxes) ─── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 py-24 md:py-32 bento-section">
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 auto-rows-[340px]" ref={bentoGridRef}>
            
            {/* Bento 1: Large Resume Card (2/3 width) */}
            <div className="md:col-span-2 relative group block h-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-10 transition-transform duration-300 hover:-translate-y-1 overflow-hidden">
              <Link to="/resume" className="absolute inset-0 z-20" />
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center shadow-sm group-hover:bg-teal-900 group-hover:text-white dark:group-hover:bg-[#22C55E] dark:group-hover:text-slate-950 transition-all duration-300 z-10">
                <ArrowUpRight className="w-5 h-5 text-current" />
              </div>
              
              <div className="relative z-10 flex flex-col items-start gap-2 max-w-[60%]">
                <h3 className="text-[28px] font-bold text-slate-950 dark:text-white">Live Resume Editor</h3>
                <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">Watch AI instantly format and optimize your experience into a professional PDF.</p>
              </div>
              
              {/* Visual Mockup inside card constrained cleanly */}
              <div className="absolute -bottom-16 -right-16 w-[400px] h-[280px] bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-4 rotate-[-4deg] group-hover:rotate-0 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-500 flex flex-col gap-2 z-10 pointer-events-none shadow-xl">
                <div className="w-[40%] h-4 bg-slate-200 dark:bg-[#1E293B] rounded-sm" />
                <div className="w-[80%] h-3 bg-slate-100 dark:bg-slate-950 rounded-sm mt-2" />
                <div className="w-[70%] h-3 bg-slate-100 dark:bg-slate-950 rounded-sm" />
                <div className="w-[85%] h-3 bg-slate-100 dark:bg-slate-950 rounded-sm" />
              </div>
            </div>

            {/* Bento 2: Small Score Gauge (1/3 width) */}
            <div className="md:col-span-1 relative group block h-full rounded-2xl bg-gray-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 transition-transform duration-300 hover:-translate-y-1 overflow-hidden">
              <Link to="/ats" className="absolute inset-0 z-20" />
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-slate-400 transition-all duration-300 group-hover:bg-teal-900 group-hover:text-white dark:group-hover:bg-[#22C55E] dark:group-hover:text-slate-950 z-10">
                <ArrowUpRight className="w-5 h-5 text-current" />
              </div>
              
              <div className="relative z-10 flex flex-col items-start gap-2">
                <h3 className="text-[28px] font-bold text-gray-900 dark:text-white">ATS Score</h3>
                <p className="text-[15px] font-medium text-gray-700 dark:text-slate-300 leading-relaxed max-w-[200px]">Beat the robots with precise keyword matching.</p>
              </div>
              
              {/* Real SVG Circular Progress Ring */}
              <div className="absolute bottom-6 right-6 z-10 flex flex-col items-center pointer-events-none">
                <svg className="w-[90px] h-[90px]" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="42" fill="none" className="stroke-gray-200 dark:stroke-[#1E293B]" strokeWidth="6" />
                  {/* Progress arc — 92% of circumference (2π×42 ≈ 263.9) → dashoffset = 263.9 × (1 - 0.92) ≈ 21.1 */}
                  <circle cx="50" cy="50" r="42" fill="none" className="stroke-teal-600 dark:stroke-[#22C55E]" strokeWidth="6" strokeLinecap="round" strokeDasharray="263.9" strokeDashoffset="21.1" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[22px] font-extrabold text-gray-900 dark:text-white">92%</span>
              </div>
            </div>

            {/* Bento 3: Small Chat (1/3 width) */}
            <div className="md:col-span-1 relative group block h-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 transition-transform duration-300 hover:-translate-y-1 overflow-hidden">
              <Link to="/chat" className="absolute inset-0 z-20" />
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center shadow-sm group-hover:bg-teal-900 group-hover:text-white dark:group-hover:bg-[#22C55E] dark:group-hover:text-slate-950 transition-all duration-300 z-10">
                <ArrowUpRight className="w-5 h-5 text-current" />
              </div>
              
              <div className="relative z-10 flex flex-col items-start gap-2">
                <h3 className="text-[28px] font-bold text-slate-950 dark:text-white">AI Coach</h3>
                <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-[200px]">Nail your next interview with simulated Q&A.</p>
              </div>
              
              <div className="absolute bottom-8 left-8 right-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-10 pointer-events-none shadow-md">
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-[#334155]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-[#334155]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-[#334155]" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider ml-2">Coach is typing...</span>
                </div>
              </div>
            </div>

            {/* Bento 4: Wide Stats (2/3 width) */}
            <div className="md:col-span-2 relative h-full flex items-center justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 transition-transform duration-300 hover:-translate-y-1">
              <div className="relative z-10 w-full flex flex-col md:flex-row items-start justify-between gap-8 md:gap-0 font-bold text-slate-950 dark:text-white">
                <div>
                  <div className="text-[48px] md:text-[64px] tracking-tighter leading-none mb-2">180K<span className="text-teal-500 dark:text-teal-400">+</span></div>
                  <div className="text-[15px] font-medium text-slate-500 dark:text-slate-400">Resumes Generated</div>
                </div>
                <div>
                  <div className="text-[48px] md:text-[64px] tracking-tighter leading-none mb-2">24%</div>
                  <div className="text-[15px] font-medium text-slate-500 dark:text-slate-400">Higher Interview Rate</div>
                </div>
                <div>
                  <div className="text-[48px] md:text-[64px] tracking-tighter leading-none mb-2">10<span className="text-teal-500 dark:text-teal-400">+</span></div>
                  <div className="text-[15px] font-medium text-slate-500 dark:text-slate-400">Advanced AI Models</div>
                </div>
              </div>
            </div>

          </div>
        </AnimatedSection>
      </section>

      {/* ─── Immersive 3D Flowing Menu ─── */}
      <section className="w-full py-10 relative z-10">
        <AnimatedSection>
          <div className="px-6 mb-8 max-w-[1200px] mx-auto">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-accent mb-2">Explore Platform</h2>
            <h3 className="text-[32px] md:text-[40px] font-extrabold text-slate-950 dark:text-white leading-tight">Interactive Toolkit</h3>
          </div>
          <FlowingMenu items={flowingMenuItems} />
        </AnimatedSection>
      </section>

      {/* ─── Ready to start CTA (Footer Top) ─── */}
      <section className="w-full bg-slate-950 dark:bg-slate-900 border-t border-slate-800 py-32 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-[40px] md:text-[56px] font-extrabold text-white tracking-[-0.03em] leading-tight mb-8">
              Ready to secure your next big role?
            </h2>
            <Link 
              to="/resume"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white dark:bg-teal-500 text-slate-950 dark:text-white text-[15px] font-bold hover:-translate-y-[2px] hover:shadow-lg transition-all duration-300"
            >
              Start for free <ArrowUpRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}

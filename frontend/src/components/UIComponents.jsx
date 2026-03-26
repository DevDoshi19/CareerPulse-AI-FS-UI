import { motion } from 'framer-motion';

/* ── Premium ease for all animations ── */
const ease = [0.22, 1, 0.36, 1];

/**
 * Animated score indicator — clean, minimal circle.
 */
export function ScoreRing({ score, size = 130 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 75) return '#0D9488';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth="5" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={getColor()} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease, delay: 0.3 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[28px] font-bold text-teal-900 tracking-[-0.02em]">
          {score}
        </span>
      </div>
      <span className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">ATS Score</span>
    </div>
  );
}

/**
 * Minimal loading spinner.
 */
export function LoadingState({ message = 'Processing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-5">
      <motion.div
        className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-teal-900"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-[13px] text-slate-500 font-medium">{message}</p>
    </div>
  );
}

/**
 * Empty placeholder.
 */
export function EmptyState({ icon, title, message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col items-center justify-center py-20 gap-3 text-center"
    >
      <span className="text-4xl opacity-30">{icon}</span>
      <h3 className="text-[15px] font-semibold text-teal-900">{title}</h3>
      <p className="text-[13px] text-slate-400 max-w-[240px]">{message}</p>
    </motion.div>
  );
}

/**
 * Card wrapper — Finpay style.
 */
export function Card({ children, className = '', dark = false, ...props }) {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-xl
        border 
        transition-all duration-300
        ${
          dark
            ? 'bg-slate-900 border-slate-800 text-white shadow-lg'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Arrow icon (↗) — used on cards.
 */
export function ArrowUpRight({ className = '' }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

/**
 * Standard fade-up animation config.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease },
  }),
};

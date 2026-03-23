import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-[#0F172A] transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="text-center"
      >
        <span className="text-6xl mb-6 block opacity-20">🧭</span>
        <h1 className="text-[32px] font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-[15px] text-gray-500 dark:text-[#94A3B8] mb-8 max-w-[300px] mx-auto">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-teal-900 dark:bg-[#22C55E] text-white dark:text-[#020617] font-bold hover:scale-[1.02] transition-transform shadow-sm"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}

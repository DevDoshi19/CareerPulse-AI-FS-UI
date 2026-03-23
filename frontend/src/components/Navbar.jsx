import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Handle scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Handle theme logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/resume', label: 'Resume Builder' },
    { path: '/ats', label: 'ATS Score' },
    { path: '/chat', label: 'Career Coach' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_2px_rgba(255,255,255,0.04)] border-b border-slate-100 dark:border-slate-800'
          : 'bg-transparent'
      }`}
      id="main-navbar"
    >
      <div className="max-w-[1200px] mx-auto px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-teal-900 dark:bg-teal-500 flex items-center justify-center transition-colors">
            <span className="text-white dark:text-slate-950 text-sm font-bold">C</span>
          </div>
          <span className="text-[17px] font-bold text-teal-900 dark:text-white tracking-[-0.02em] transition-colors">
            CareerForge
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-teal-900 bg-slate-50 dark:text-white dark:bg-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-teal-900 hover:bg-slate-50 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* CTA */}
          <Link
            to="/resume"
            className="bg-teal-900 dark:bg-teal-500 text-white dark:text-slate-950 text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-800 dark:hover:bg-teal-400 transition-all duration-200 hover:scale-[1.02]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

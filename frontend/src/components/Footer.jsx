import { Link } from 'react-router-dom';

export default function Footer() {
  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Resume Builder', to: '/resume' },
        { label: 'ATS Scanner', to: '/ats' },
        { label: 'Career Coach', to: '/chat' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'GitHub', href: 'https://github.com/devdoshi19' },
        { label: 'Contact', href: 'mailto:contact@careerforge.ai' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', to: '/blog' },
        { label: 'Guides', to: '/guides' },
        { label: 'Changelog', to: '/changelog' },
      ],
    },
  ];

  return (
    <footer className="mt-auto bg-white border-t border-slate-100" id="footer">
      <div className="max-w-[1200px] mx-auto px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-900 flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className="text-[17px] font-bold text-teal-900 tracking-[-0.02em]">
                CareerForge
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-[260px] leading-relaxed">
              AI-powered career tools to help you build resumes, score against job descriptions, and ace interviews.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold text-teal-900 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="text-[13px] text-slate-500 hover:text-teal-900 transition-colors duration-200">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} target={link.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-[13px] text-slate-500 hover:text-teal-900 transition-colors duration-200">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[12px] text-slate-400">
            ©CareerForge 2025. All Rights Reserved.
          </p>
          <p className="text-[12px] text-slate-400">
            Powered by Google Gemini · Built by Dev Doshi
          </p>
        </div>
      </div>
    </footer>
  );
}

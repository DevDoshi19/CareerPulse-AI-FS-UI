import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rewriteResume, downloadPDF } from '../services/api';
import { LoadingState, Card, ArrowUpRight, fadeUp } from '../components/UIComponents';

const ease = [0.22, 1, 0.36, 1];

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    profile_name: '', email: '', phone: '', github: '', education: '',
    job_desc: '', summary: '', skills: '', experience: '', projects: '',
    achievements: '', other_info: '',
    template_choice: 'Modern (Bold Header)', theme_color: '#0B2838',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const update = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.profile_name.trim() || !form.skills.trim()) {
      setError('Name and Skills are required.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await rewriteResume(form);
      if (res.success) setResult(res);
      else setError(res.error || 'Generation failed.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result?.pdf_base64) downloadPDF(result.pdf_base64, `${form.profile_name}_Resume.pdf`);
  };

  const inputCls = "w-full min-w-0 p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-900 transition-shadow";
  const btnCls = "w-full min-w-0 py-4 bg-teal-900 dark:bg-teal-500 text-white dark:text-white rounded-xl font-bold hover:bg-teal-800 dark:hover:bg-teal-400 transition-colors btn-hover mt-4";
  const textareaCls = `${inputCls} resize-none min-h-[80px]`;
  const labelCls = 'block text-[11px] font-semibold text-slate-500 uppercase tracking-[0.06em] mb-1.5';

  return (
    <div className="flex-1">
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">Step 1 of 3</span>
          <h1 className="text-[32px] font-bold text-teal-900 tracking-[-0.02em] mt-2">Resume Builder</h1>
          <p className="text-[14px] text-slate-500 mt-1">Transform rough notes into a polished, professional resume.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-10">
          {/* ── FORM (3 cols) ── */}
          <motion.div
            className="lg:col-span-3 min-w-0 flex-1 w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <Card className="p-7">
              <form onSubmit={handleSubmit}>
                {/* Design row */}
                <div className="flex items-end gap-4 pb-6 border-b border-slate-100">
                  <div className="flex-1">
                    <label className={labelCls}>Template</label>
                    <select className={inputCls} value={form.template_choice} onChange={update('template_choice')} id="template-select">
                      <option>Modern (Bold Header)</option>
                      <option>Classic (Minimal)</option>
                    </select>
                  </div>
                  <div className="w-16">
                    <label className={labelCls}>Color</label>
                    <input type="color" value={form.theme_color} onChange={update('theme_color')} className="w-full h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 p-1 cursor-pointer bg-transparent" id="color-picker" />
                  </div>
                </div>

                {/* Profile */}
                <div className="pt-6 pb-6 border-b border-slate-100">
                  <h3 className="text-[14px] font-bold text-teal-900 dark:text-white mb-4">Profile Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Full Name *</label><input className={inputCls} placeholder="Dev Doshi" value={form.profile_name} onChange={update('profile_name')} id="input-name" /></div>
                    <div><label className={labelCls}>Email</label><input className={inputCls} placeholder="aryanpandya@gmail.com" value={form.email} onChange={update('email')} id="input-email" /></div>
                    <div><label className={labelCls}>Phone</label><input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} id="input-phone" /></div>
                    <div><label className={labelCls}>LinkedIn / GitHub</label><input className={inputCls} placeholder="https://github.com/DevDoshi19" value={form.github} onChange={update('github')} id="input-github" /></div>
                  </div>
                  <div className="mt-3">
                    <label className={labelCls}>Education</label>
                    <textarea className={textareaCls} rows={2} placeholder="B.Tech AIDS, CVMU (2023-2027)" value={form.education} onChange={update('education')} id="input-education" />
                  </div>
                </div>

                {/* Target */}
                <div className="pt-6 pb-6 border-b border-slate-100">
                  <h3 className="text-[14px] font-bold text-teal-900 dark:text-white mb-4">Target Role</h3>
                  <label className={labelCls}>Job Description</label>
                  <textarea className={textareaCls} rows={3} placeholder="Paste the JD here — AI optimizes keywords." value={form.job_desc} onChange={update('job_desc')} id="input-jd" />
                </div>

                {/* Experience */}
                <div className="pt-6">
                  <h3 className="text-[14px] font-bold text-teal-900 dark:text-white mb-4">Experience & Skills</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Summary</label><textarea className={textareaCls} rows={3} placeholder="Rough draft about yourself..." value={form.summary} onChange={update('summary')} id="input-summary" /></div>
                    <div><label className={labelCls}>Projects</label><textarea className={textareaCls} rows={3} placeholder="Movie Recommender: Used Python..." value={form.projects} onChange={update('projects')} id="input-projects" /></div>
                    <div><label className={labelCls}>Skills * (comma separated)</label><textarea className={textareaCls} rows={2} placeholder="Python, Java, React..." value={form.skills} onChange={update('skills')} id="input-skills" /></div>
                    <div><label className={labelCls}>Work Experience</label><textarea className={textareaCls} rows={2} placeholder="Intern at TechCorp..." value={form.experience} onChange={update('experience')} id="input-experience" /></div>
                    <div><label className={labelCls}>Achievements</label><textarea className={textareaCls} rows={2} placeholder="AWS Certified..." value={form.achievements} onChange={update('achievements')} id="input-achievements" /></div>
                    <div><label className={labelCls}>Other</label><textarea className={textareaCls} rows={2} placeholder="English, Hindi | Chess" value={form.other_info} onChange={update('other_info')} id="input-other" /></div>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 text-[13px] text-error bg-error-soft px-4 py-3 rounded-xl">
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={loading} className="w-full mt-7 bg-teal-900 hover:bg-teal-800 text-white font-semibold text-[13px] py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer" id="btn-generate">
                  {loading ? 'Generating...' : 'Generate Resume'}
                </button>
              </form>
            </Card>
          </motion.div>

          {/* ── RESULT (2 cols) ── */}
          <motion.div
            className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start min-w-0 w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <Card className="p-7">
              {loading && <LoadingState message="AI is drafting your resume..." />}

              <AnimatePresence>
                {result && result.success && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease }}>
                    <div className="text-[13px] text-accent bg-accent-light px-4 py-3 rounded-xl mb-5 font-semibold">
                      ✓ Resume generated successfully
                    </div>

                    <button onClick={handleDownload} className="w-full bg-teal-900 hover:bg-teal-800 text-white font-semibold text-[13px] py-3 rounded-xl transition-all duration-300 mb-6 flex items-center justify-center gap-2 cursor-pointer" id="btn-download">
                      Download PDF <ArrowUpRight className="text-teal-400" />
                    </button>

                    <div className="space-y-5">
                      <SectionPreview title="Summary" content={result.data.summary} />
                      <SectionPreview title="Skills">
                        <div className="flex flex-wrap gap-1.5">
                          {result.data.skills.map((s, i) => <span key={i} className="text-[11px] font-semibold text-accent bg-accent-light px-2.5 py-1 rounded-full">{s}</span>)}
                        </div>
                      </SectionPreview>
                      <SectionPreview title="Projects">
                        <ul className="list-disc pl-4 space-y-1 text-[13px] text-slate-600">{result.data.projects.map((p, i) => <li key={i}>{p}</li>)}</ul>
                      </SectionPreview>
                      <SectionPreview title="Experience">
                        <ul className="list-disc pl-4 space-y-1 text-[13px] text-slate-600">{result.data.experience.map((e, i) => <li key={i}>{e}</li>)}</ul>
                      </SectionPreview>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!loading && !result && (
                <div className="text-center py-16">
                  <span className="text-4xl opacity-20">📄</span>
                  <h3 className="text-[14px] font-bold text-teal-900 mt-3">Resume Preview</h3>
                  <p className="text-[12px] text-slate-400 mt-1.5 max-w-[200px] mx-auto">Fill in the form and click Generate.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SectionPreview({ title, content, children }) {
  return (
    <div>
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1.5">{title}</h4>
      {content ? <p className="text-[13px] text-slate-600 leading-relaxed">{content}</p> : children}
    </div>
  );
}

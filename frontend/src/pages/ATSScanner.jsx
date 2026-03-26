import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getATSScore, getATSScorePDF } from '../services/api';
import { ScoreRing, LoadingState, Card, ArrowUpRight, fadeUp } from '../components/UIComponents';

const ease = [0.22, 1, 0.36, 1];

export default function ATSScanner() {
  const [inputMethod, setInputMethod] = useState('text');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) { setError('Please paste a Job Description.'); return; }
    if (inputMethod === 'text' && !resumeText.trim()) { setError('Please provide resume text.'); return; }
    if (inputMethod === 'pdf' && !file) { setError('Please upload a PDF.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = inputMethod === 'pdf'
        ? await getATSScorePDF(file, jobDescription)
        : await getATSScore({ resumeText, jobDescription });
      if (res.success) setResult(res.data);
      else setError(res.error || 'Analysis failed.');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-900 transition-shadow";
  const labelCls = "block text-sm font-semibold text-slate-700 dark:text-slate-400 mb-1.5 uppercase tracking-wider";

  return (
    <div className="flex-1">
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">Step 2 of 3</span>
          <h1 className="text-[32px] font-bold text-teal-900 tracking-[-0.02em] mt-2">ATS Scanner</h1>
          <p className="text-[14px] text-slate-500 mt-1">Score your resume against any job description.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* ── INPUT ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }}>
            <Card className="p-7">
              <h3 className="text-[14px] font-bold text-teal-900 dark:text-white mb-4">Job Description</h3>
              <textarea className={`${inputCls} min-h-[120px]`} rows={5} placeholder="Paste the target JD here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} id="ats-jd" />

              <div className="h-px bg-slate-100 my-6" />

              <h3 className="text-[14px] font-bold text-teal-900 dark:text-white mb-3">Your Resume</h3>

              <div className="flex gap-2 mb-4">
                {['text', 'pdf'].map((m) => (
                  <button key={m} type="button" onClick={() => setInputMethod(m)}
                    className={`flex-1 py-3 text-[14px] font-bold rounded-lg transition-colors btn-hover ${
                      inputMethod === m
                        ? 'bg-teal-900 dark:bg-teal-500 text-white dark:text-white'
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-300 hover:bg-slate-200'
                    }`} id={`btn-${m}-mode`}>
                    {m === 'text' ? 'Paste Text' : 'Upload PDF'}
                  </button>
                ))}
              </div>

              {inputMethod === 'text' ? (
                <textarea className={`${inputCls} min-h-[140px]`} rows={6} placeholder="Paste resume text..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} id="ats-resume-text" />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors">
                  <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
                  <svg className="w-8 h-8 text-slate-300 dark:text-[#334155] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
                  </svg>
                  <span className="text-[13px] text-slate-400 dark:text-slate-400">{file ? file.name : 'Click to upload PDF'}</span>
                </label>
              )}

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 text-[13px] text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 px-4 py-3 rounded-xl overflow-hidden">{error}</motion.div>
                )}
              </AnimatePresence>

              <button onClick={handleAnalyze} disabled={loading} className="w-full mt-6 bg-teal-900 dark:bg-teal-500 hover:bg-teal-800 dark:hover:bg-teal-400 text-white dark:text-white font-semibold text-[13px] py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer btn-hover" id="btn-analyze">
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </Card>
          </motion.div>

          {/* ── RESULTS ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease }}>
            {loading && <Card className="p-7"><LoadingState message="Analyzing keywords and match..." /></Card>}

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
                  <Card className="p-7">
                    {/* Verdict */}
                    <div className={`text-[13px] font-semibold px-4 py-3 rounded-xl mb-7 ${
                      result.is_hirable ? 'bg-accent-light text-accent' : 'bg-error-soft text-error'
                    }`}>
                      {result.is_hirable ? `Strong match for ${result.recommended_role}` : 'Profile needs improvement for this role'}
                    </div>

                    {/* Score */}
                    <div className="flex justify-center mb-8">
                      <ScoreRing score={result.ats_score} size={140} />
                    </div>

                    {/* Metrics */}
                    <div className={`grid gap-3 mb-7 ${result.is_hirable ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      <MetricCard label="Best Role" value={result.recommended_role} />
                      <MetricCard label="Readiness" value={result.placement_readiness} />
                      {result.is_hirable && <MetricCard label="Est. Salary" value={result.salary_estimation} />}
                    </div>

                    <div className="h-px bg-slate-100 my-6" />

                    {/* Missing */}
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2.5">Missing Skills</h4>
                    {result.missing_keywords.length > 0 ? (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 mb-6 overflow-hidden">
                        <div className="flex flex-wrap gap-2">
                          {result.missing_keywords.map((kw, i) => (
                            <span key={i} className="text-[12px] font-semibold text-red-600 dark:text-red-400 bg-white dark:bg-red-950 px-3 py-1.5 rounded-lg shadow-sm border border-red-100 dark:border-red-900/50">{kw}</span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-4 mb-6 overflow-hidden">
                        <p className="text-[13px] text-green-700 dark:text-green-400 font-medium m-0 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                          All keywords matched perfectly!
                        </p>
                      </div>
                    )}

                    {/* Tips */}
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2.5">Recommendations</h4>
                    <div className="space-y-2">
                      {result.improvement_tips.map((tip, i) => (
                        <div key={i} className="text-[13px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">{tip}</div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {!loading && !result && (
              <Card className="p-7">
                <div className="text-center py-16 flex flex-col items-center">
                  {/* Animated radar SVG */}
                  <div className="relative w-16 h-16 mb-4">
                    <svg className="w-16 h-16 text-teal-900/20 dark:text-teal-400/20" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
                      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="1" />
                      <circle cx="32" cy="32" r="3" fill="currentColor" className="animate-pulse" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-teal-500/30 dark:border-teal-500/30 animate-ping" />
                    </div>
                  </div>
                  <h3 className="text-[14px] font-bold text-gray-900 dark:text-white mt-1">Analysis Report</h3>
                  <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1.5 max-w-[220px] mx-auto">Paste a JD and resume to see results.</p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 text-center border border-gray-100 dark:border-slate-800 card-hover">
      <p className="text-[14px] font-bold text-gray-900 dark:text-white truncate">{value}</p>
      <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-[0.08em] mt-1">{label}</p>
    </div>
  );
}

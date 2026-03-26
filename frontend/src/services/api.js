/**
 * CareerForge AI — API Service Layer
 * Central module for all backend calls.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail || `Request failed (${res.status})`);
    }

    return res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Cannot connect to the server. Is the backend running on port 8000?');
    }
    throw err;
  }
}

/**
 * POST /resume/rewrite
 * Returns { success, data, pdf_base64, error }
 */
export async function rewriteResume(formData) {
  return request('/resume/rewrite', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

/**
 * POST /ats/score
 * Returns { success, data, error }
 */
export async function getATSScore({ resumeText, jobDescription }) {
  return request('/ats/score', {
    method: 'POST',
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  });
}

/**
 * POST /ats/score-pdf
 * Upload a PDF and job description.
 */
export async function getATSScorePDF(file, jobDescription) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  const url = `${API_BASE}/ats/score-pdf`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `Request failed (${res.status})`);
  }

  return res.json();
}

/**
 * POST /career/chat
 * Returns { success, response, error }
 */
export async function chatWithAI({ query, chatHistory }) {
  return request('/career/chat', {
    method: 'POST',
    body: JSON.stringify({
      query,
      chat_history: chatHistory,
    }),
  });
}

/**
 * POST /career/chat/stream
 * Returns a ReadableStream for streaming responses.
 */
export async function chatWithAIStream({ query, chatHistory }) {
  const url = `${API_BASE}/career/chat/stream`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      chat_history: chatHistory,
    }),
  });

  if (!res.ok) {
    throw new Error(`Stream request failed (${res.status})`);
  }

  return res.body;
}

/**
 * POST /career/upload
 * Uploads a document (PDF/TXT) to LangGraph/Pinecone for deep RAG analysis.
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE}/career/upload`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `Upload failed (${res.status})`);
  }

  return res.json();
}

/**
 * Download a base64-encoded PDF.
 */
export function downloadPDF(base64Data, filename) {
  const byteChars = atob(base64Data);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

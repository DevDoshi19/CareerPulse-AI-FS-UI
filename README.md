# 🚀 CareerForge AI — Full-Stack Web Platform

AI-powered Resume Builder, ATS Scanner, and Career Coach. Built with **FastAPI** (Python) + **React** (Vite).

## Architecture

```
project-root/
├── backend/              # FastAPI Python API
│   ├── app/
│   │   ├── main.py       # Entry point
│   │   ├── routes/       # resume, ats, chat
│   │   ├── services/     # ai_service, pdf_service
│   │   ├── models/       # Pydantic schemas
│   │   └── core/         # Config & API keys
│   ├── requirements.txt
│   └── .env
│
├── frontend/             # React (Vite)
│   ├── src/
│   │   ├── pages/        # Home, ResumeBuilder, ATSScanner, CareerChat
│   │   ├── components/   # Navbar, Footer, UIComponents
│   │   ├── services/     # api.js
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/rewrite` | Generate AI resume + PDF |
| POST | `/ats/score` | Analyze resume text vs JD |
| POST | `/ats/score-pdf` | Upload PDF resume + analyze |
| POST | `/career/chat` | Chat with AI coach |
| POST | `/career/chat/stream` | Streaming chat response |
| GET | `/health` | Health check |

## Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt

# Copy your API keys
cp .env.example .env
# Edit .env with your GEMINI_KEY_* values

# Start server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Environment Variables

Create `backend/.env` with:

```env
GEMINI_KEY_1=your_api_key_here
GEMINI_KEY_2=your_api_key_here
```

Optional frontend env (`frontend/.env`):

```env
VITE_API_URL=http://localhost:8000
```

## Deployment

### Backend (Render / Railway)
- Set root directory to `backend/`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add `GEMINI_KEY_*` environment variables

### Frontend (Vercel / Netlify)
- Set root directory to `frontend/`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your deployed backend URL

## Privacy

- No login system
- No database
- No user data storage
- No tracking scripts

## License

MIT © 2025 Dev Doshi

"""
FastAPI Application Entry Point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import resume, ats, chat

app = FastAPI(
    title="CareerForge AI API",
    description="AI-powered Resume Builder, ATS Scanner, and Career Coach",
    version="1.0.0",
)

import os

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Include Routers ─────────────────────────────────────────────────────────
app.include_router(resume.router)
app.include_router(ats.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {
        "app": "CareerForge AI",
        "version": "1.0.0",
        "endpoints": [
            "POST /resume/rewrite",
            "POST /ats/score",
            "POST /ats/score-pdf",
            "POST /career/chat",
            "POST /career/chat/stream",
        ],
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

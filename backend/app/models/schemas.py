"""
Pydantic request/response schemas for all API endpoints.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


# ─── Resume Endpoint ──────────────────────────────────────────────────────────

class ResumeRequest(BaseModel):
    profile_name: str = Field(..., min_length=1, description="Full name")
    email: Optional[str] = ""
    phone: Optional[str] = ""
    github: Optional[str] = ""
    education: Optional[str] = ""
    job_desc: Optional[str] = ""
    summary: Optional[str] = ""
    skills: str = Field(..., min_length=1, description="Comma-separated skills")
    experience: Optional[str] = ""
    projects: Optional[str] = ""
    achievements: Optional[str] = ""
    other_info: Optional[str] = ""
    template_choice: Optional[str] = "Modern (Bold Header)"
    theme_color: Optional[str] = "#1A237E"


class ResumeResponseData(BaseModel):
    profile_name: str
    summary: str
    skills: List[str]
    projects: List[str]
    experience: List[str]
    education: str
    other_information: str
    achievements: List[str]


class ResumeResponse(BaseModel):
    success: bool
    data: Optional[ResumeResponseData] = None
    pdf_base64: Optional[str] = None
    error: Optional[str] = None


# ─── ATS Endpoint ─────────────────────────────────────────────────────────────

class ATSRequest(BaseModel):
    resume_text: str = Field(..., min_length=1, description="Resume content as plain text")
    job_description: str = Field(..., min_length=1, description="Target job description")


class ATSResponseData(BaseModel):
    ats_score: int
    recommended_role: str
    missing_keywords: List[str]
    placement_readiness: str
    is_hirable: bool
    salary_estimation: str
    improvement_tips: List[str]


class ATSResponse(BaseModel):
    success: bool
    data: Optional[ATSResponseData] = None
    error: Optional[str] = None


# ─── Chat Endpoint ────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str = Field(..., description="'human' or 'ai'")
    content: str


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, description="User's question")
    chat_history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None

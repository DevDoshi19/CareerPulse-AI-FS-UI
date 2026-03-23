"""
ATS Scanner API routes.
Wraps analyze_resume_with_ai() from the original LangChain_model.py.
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from PyPDF2 import PdfReader
import io

from app.models.schemas import ATSRequest, ATSResponse, ATSResponseData
from app.services.ai_service import analyze_resume_with_ai

router = APIRouter(prefix="/ats", tags=["ATS Scanner"])


@router.post("/score", response_model=ATSResponse)
async def score_resume(request: ATSRequest):
    """
    Analyze resume text against a job description.
    Returns ATS score, missing keywords, salary estimation, etc.
    """
    try:
        analysis = analyze_resume_with_ai(request.resume_text, request.job_description)

        return ATSResponse(
            success=True,
            data=ATSResponseData(
                ats_score=analysis.ats_score,
                recommended_role=analysis.recommended_role,
                missing_keywords=analysis.missing_keywords,
                placement_readiness=analysis.placement_readiness,
                is_hirable=analysis.is_hirable,
                salary_estimation=analysis.salary_estimation,
                improvement_tips=analysis.improvement_tips,
            ),
        )

    except Exception as e:
        return ATSResponse(success=False, error=str(e))


@router.post("/score-pdf", response_model=ATSResponse)
async def score_resume_pdf(
    file: UploadFile = File(...),
    job_description: str = Form(...),
):
    """
    Upload a PDF resume and analyze it against a job description.
    Extracts text from the PDF first, then runs the same analysis.
    """
    try:
        # Extract text from uploaded PDF
        contents = await file.read()
        reader = PdfReader(io.BytesIO(contents))
        resume_text = ""
        for page in reader.pages:
            resume_text += page.extract_text()

        if not resume_text.strip():
            return ATSResponse(success=False, error="Could not extract text from PDF. Please paste your resume text instead.")

        analysis = analyze_resume_with_ai(resume_text, job_description)

        return ATSResponse(
            success=True,
            data=ATSResponseData(
                ats_score=analysis.ats_score,
                recommended_role=analysis.recommended_role,
                missing_keywords=analysis.missing_keywords,
                placement_readiness=analysis.placement_readiness,
                is_hirable=analysis.is_hirable,
                salary_estimation=analysis.salary_estimation,
                improvement_tips=analysis.improvement_tips,
            ),
        )

    except Exception as e:
        return ATSResponse(success=False, error=str(e))

"""
Resume API routes.
Wraps generate_resume_data() and PDF generation from the original Streamlit app.
"""
import base64
from fastapi import APIRouter, HTTPException
from app.models.schemas import ResumeRequest, ResumeResponse, ResumeResponseData
from app.services.ai_service import generate_resume_data
from app.services.pdf_service import PDF, hex_to_rgb

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/rewrite", response_model=ResumeResponse)
async def rewrite_resume(request: ResumeRequest):
    """
    Generate an AI-rewritten resume and return both structured data and PDF.
    This wraps the exact same logic from pages/1_Resume_Builder.py.
    """
    try:
        # 1. Call the AI brain (unchanged)
        ai_data = generate_resume_data(
            request.profile_name,
            request.summary,
            request.skills,
            request.projects,
            request.experience,
            request.education,
            request.other_info,
            request.achievements,
            request.job_desc,
        )

        # 2. Generate PDF (unchanged logic from 1_Resume_Builder.py)
        rgb_color = hex_to_rgb(request.theme_color)
        pdf = PDF(brand_color=rgb_color)
        pdf.add_page()

        contact_info = f"{request.email}  |  {request.phone}  |  {request.github}"

        if request.template_choice == "Modern (Bold Header)":
            pdf.add_modern_header(ai_data.profile_name, contact_info)
        else:
            pdf.add_classic_header(ai_data.profile_name, contact_info)

        sections = [
            ("Professional Summary", ai_data.summary, "text"),
            ("Technical Skills", ", ".join(ai_data.skills), "text"),
            ("Work Experience", ai_data.experience, "bullets"),
            ("Key Projects", ai_data.projects, "bullets"),
            ("Education", ai_data.education, "text"),
        ]

        for title, content, style in sections:
            pdf.section_title(title)
            if style == "text":
                pdf.section_body(content)
            else:
                pdf.bullet_points(content)

        if ai_data.achievements:
            pdf.section_title("Honors & Awards")
            pdf.bullet_points(ai_data.achievements)

        if ai_data.other_information:
            pdf.section_title("Additional Details")
            pdf.section_body(ai_data.other_information)

        # 3. Encode PDF as base64
        pdf_bytes = pdf.output(dest='S').encode('latin-1')
        pdf_b64 = base64.b64encode(pdf_bytes).decode('utf-8')

        return ResumeResponse(
            success=True,
            data=ResumeResponseData(
                profile_name=ai_data.profile_name,
                summary=ai_data.summary,
                skills=ai_data.skills,
                projects=ai_data.projects,
                experience=ai_data.experience,
                education=ai_data.education,
                other_information=ai_data.other_information,
                achievements=ai_data.achievements,
            ),
            pdf_base64=pdf_b64,
        )

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        return ResumeResponse(success=False, error=str(e))

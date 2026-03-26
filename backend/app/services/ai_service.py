"""
AI Service — Core LLM logic.
This is the EXACT same logic from LangChain_model.py.
Only change: removed Streamlit decorators (@st.cache_data) and imports.
"""
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from pydantic import BaseModel, Field
from typing import List
from tenacity import retry, stop_after_attempt, wait_fixed
import logging

from app.core.config import get_all_gemini_keys

logger = logging.getLogger(__name__)

def execute_with_key_rotation(operation_callable):
    """
    Executes a callable that takes an API key. 
    Sequentially rotates through available GEMINI keys if ResourceExhausted or Rate Limits occur.
    """
    keys = get_all_gemini_keys()
    last_exception = None
    
    for key in keys:
        try:
            return operation_callable(key)
        except Exception as e:
            error_msg = str(e).lower()
            if "429" in error_msg or "resourceexhausted" in error_msg or "quota" in error_msg:
                logger.warning(f"API Key ...{key[-4:]} hit rate limit. Rotating to next key...")
                last_exception = e
                continue
            else:
                # If the error is structural (e.g., bad parsed output schema), raise immediately.
                raise e
                
    logger.error("CRITICAL: All Gemini API keys have been exhausted or rate-limited.")
    raise Exception(f"All API keys exhausted. Last encountered error: {last_exception}")


# ─── Structured Output Schemas (unchanged) ───────────────────────────────────

class ChatInputValidation(BaseModel):
    profile_name: str = Field(..., description="The full name of the user.")
    summary: str = Field(..., description="A polished, professional summary (max 3-4 lines).")
    skills: List[str] = Field(..., description="List of top 8-10 technical skills.")
    projects: List[str] = Field(..., description="List of projects, rewritten in 'Action-Metric-Result' format.")
    experience: List[str] = Field(..., description="List of job roles, rewritten professionally with action verbs.")
    education: str = Field(..., description="Formatted educational background.")
    other_information: str = Field(..., description="Formatted additional info (Languages, Hobbies).")
    achievements: List[str] = Field(..., description="List of formatted achievements.")


class ATSAnalysis(BaseModel):
    ats_score: int = Field(..., description="A score out of 100 based on the match between Resume and Job Description.")
    recommended_role: str = Field(..., description="The best matching job title (e.g., 'AI Engineer', 'Data Scientist','Generative AI','Machine Learning Engineer').")
    missing_keywords: List[str] = Field(..., description="List of technical skills or keywords present in the JD but missing in the Resume.")
    placement_readiness: str = Field(..., description="A verdict: 'High', 'Medium', or 'Low' readiness for the job.")
    is_hirable: bool = Field(..., description="True if the candidate is job-ready (Readiness is High or Medium), False if Low.")
    salary_estimation: str = Field(..., description="Estimated salary range in 'LPA' format (e.g., '12-15 LPA').")
    improvement_tips: List[str] = Field(..., description="3 specific, actionable tips to improve the resume for this role.")


# ─── Resume Generation (unchanged logic) ─────────────────────────────────────

def generate_resume_data(name, summary, skills, projects, exp, edu, other, awards, job_desc):
    def _op(api_key):
        model = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite", 
            temperature=0.6, 
            google_api_key=api_key
        )
        Structured_model = model.with_structured_output(ChatInputValidation)

        template = """
        ### SYSTEM ROLE: Elite Resume Architect (FAANG Specialist)
        You are rewriting a resume for a candidate targeting a high-level tech role. 
        The user has provided **RAW, UNDERSTATED notes**. Your job is to **reverse-engineer** their work and describe it using **High-Level Engineering Terminology**.

        ### TARGET JOB DESCRIPTION:
        "{job_desc}"

        ### 🛡️ THE "NO-FLUFF" PROTOCOL:
        1. **Quantify Everything:** Never write a sentence without a number. If the user doesn't give a number, **ESTIMATE** a realistic engineering metric based on the tech stack (e.g., "Reduced latency by 40%", "Processed 10k+ requests", "99.9% uptime").
        2. **Strong Openers:** Ban basic verbs like "Made", "Used", "Worked on". REPLACE with: *Architected, Orchestrated, Engineered, Deployed, Optimized, Spearheaded.*
        3. **Tech-First Tone:** Do not sound like a student. Sound like a Senior Developer. Use words like "Scalability," "Latency," "Throughput," "CI/CD," "Microservices."

        ### 📝 INSTRUCTIONS BY SECTION (STRICT):

        **1. SUMMARY (The Hook):**
        - Create a powerful 3-sentence narrative.
        - Sentence 1: "Results-oriented [Role] with experience in [Top Skills]."
        - Sentence 2: "Specialized in [Specific Domain from JD]..."
        - Sentence 3: "Proven track record of building [Key Project Type]..."
        
        **2. PROJECTS (The Core):**
        - For EVERY project listed, you must generate **multi-faceted bullet points** covering:
          * **Architecture:** What did they build and how? (e.g., "Built a RESTful API using FastAPI...")
          * **Optimization:** How did they make it fast? (e.g., "Implemented Redis caching to reduce database load by...")
          * **Impact:** What was the result? (e.g., "Enabled seamless PDF parsing for 500+ users.")
        - *CRITICAL:* If the user's input is short (e.g., "Made a resume builder"), you must **EXPAND** it into a full technical breakdown.

        **3. WORK EXPERIENCE:**
        - Transform daily tasks into **Achievements**. 
        - Format: "Action -> Context -> Result".
        - Example: "Automated manual data entry workflows using Python scripts, saving 15 hours of engineering time per week."

        **4. SKILLS:**
        - Group them logically if possible (e.g., "Languages: Python, C++ | Frameworks: Streamlit, LangChain").

        ### 📥 RAW USER INPUTS:
        - Name: {profile_name}
        - Draft Summary: {summary}
        - Skills: {skills}
        - Projects: {projects}
        - Experience: {experience}
        - Education: {education}
        - Awards: {achievements}
        - Other: {other_information}
        """

        prompt = PromptTemplate(
            template=template,
            input_variables=["profile_name", "summary", "skills", "projects", "experience", "education", "achievements", "other_information", "job_desc"],
        )

        chain = prompt | Structured_model
        
        return chain.invoke({
            "profile_name": name,
            "summary": summary,
            "skills": skills,
            "projects": projects,
            "experience": exp,
            "education": edu,
            "achievements": awards,
            "other_information": other,
            "job_desc": job_desc
        })

    return execute_with_key_rotation(_op)


# ─── ATS Analysis (unchanged logic) ──────────────────────────────────────────

def analyze_resume_with_ai(resume_text, job_description):
    def _op(api_key):
        model = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash", 
            temperature=0.6, 
            google_api_key=api_key
        )
        ATS_Structured_model = model.with_structured_output(ATSAnalysis)

        template = """
        ### ROLE: Senior Technical Recruiter (India Market Specialist)
        You are evaluating a candidate's resume against a specific Job Description (JD). 

        ### JOB DESCRIPTION:
        "{job_desc}"
        
        ### CANDIDATE RESUME:
        "{resume_text}"
        
        ### 🚨 CRITICAL DOMAIN CHECK (Perform this FIRST):
        1. Identify the **Primary Domain** of the JD (e.g., "Food Tech", "AI/ML", "Sales").
        2. Identify the **Primary Domain** of the Resume.
        3. **IF THE DOMAINS DO NOT MATCH (e.g., Food Tech vs AI/ML):**
           - **IMMEDIATE SCORE:** 0-10%.
           - **STOP ANALYSIS.**
           - **Verdict:** False.
           - **Reason:** "Critical Domain Mismatch."

        ### SCORING RULES (Only if Domains Match):
        1. **JD Match:** - Core Skills Missing? Max Score = 60%.
           - Perfect Match? Score > 85%.
        
        2. **Salary Estimation (India Market):**
           - Fresher (0-1 yr): 3-9 LPA
           - Junior (1-3 yrs): 6-11 LPA
           - Mid (3-5 yrs): 10-18 LPA
           - Senior (5+ yrs): 16-30+ LPA
           
        3. **Hirable Verdict:** True only if Score > 75% AND Experience fits.

        ### OUTPUT FORMAT (JSON):
        {{
            "JD_Match": "10%",
            "MissingKeywords": ["Domain Mismatch: Candidate is in Food Tech, JD is for AI/ML"],
            "ProfileSummary": "Candidate background is in Food Technology...",
            "EstimatedSalary": "N/A",
            "Is_Hirable": false
        }}
        """
        prompt = PromptTemplate(
            template=template,
            input_variables=["resume_text", "job_desc"],
        )

        chain = prompt | ATS_Structured_model

        return chain.invoke({
            "resume_text": resume_text, 
            "job_desc": job_description
        })

    return execute_with_key_rotation(_op)


# ─── Chat Response (LangGraph Router) ─────────────────────────────────────────
from app.services.agent_service import agent_app

@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def get_chat_response(user_query, chat_history):
    def _op(api_key):
        # Translate internal JSON histories into rigid LangChain object states
        formatted_messages = []
        for msg in chat_history:
            if msg.get("role") == "user":
                formatted_messages.append(HumanMessage(content=msg.get("content", "")))
            elif msg.get("role") == "model" or msg.get("role") == "assistant":
                formatted_messages.append(AIMessage(content=msg.get("content", "")))
                
        # Deposit the current user question directly at the end
        formatted_messages.append(HumanMessage(content=user_query))
        
        # Instantiate the AgentState Dict mathematically matching the workflow blueprint
        initial_state = {
            "messages": formatted_messages,
            "next_action": "chat", # Default placeholder state
            "api_key": api_key     # Rotation-handled safe API token
        }
        
        # Atomically execute the entire multithreaded LangGraph Flow!
        result_state = agent_app.invoke(initial_state)
        
        # Because we define `Sequence[BaseMessage], operator.add`, node synthesized answers 
        # are inherently pushed to the back. We return exactly the last generated frame.
        final_message = result_state["messages"][-1].content
        return final_message

    return execute_with_key_rotation(_op)

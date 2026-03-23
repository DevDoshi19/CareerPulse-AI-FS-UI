"""
Career Chat API routes.
Wraps get_chat_response() from the original LangChain_model.py.
"""
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage, AIMessage

from app.models.schemas import ChatRequest, ChatResponse
from app.services.ai_service import get_chat_response

router = APIRouter(prefix="/career", tags=["Career Chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Send a message to the AI Career Coach.
    Returns the full response (non-streaming).
    """
    try:
        # Convert chat history from request format to LangChain messages
        langchain_history = []
        for msg in request.chat_history:
            if msg.role == "human":
                langchain_history.append(HumanMessage(content=msg.content))
            elif msg.role == "ai":
                langchain_history.append(AIMessage(content=msg.content))

        response = get_chat_response(request.query, langchain_history)

        return ChatResponse(success=True, response=response)

    except Exception as e:
        return ChatResponse(success=False, error=str(e))


@router.post("/chat/stream")
async def chat_with_ai_stream(request: ChatRequest):
    """
    Send a message to the AI Career Coach with streaming response.
    Returns words one-by-one for a typewriter feel (matches original Streamlit behavior).
    """
    try:
        langchain_history = []
        for msg in request.chat_history:
            if msg.role == "human":
                langchain_history.append(HumanMessage(content=msg.content))
            elif msg.role == "ai":
                langchain_history.append(AIMessage(content=msg.content))

        response = get_chat_response(request.query, langchain_history)

        async def generate():
            for word in response.split(" "):
                yield word + " "

        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        return ChatResponse(success=False, error=str(e))

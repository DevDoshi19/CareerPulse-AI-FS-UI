"""
Career Chat API routes.
Wraps get_chat_response() from the original LangChain_model.py.
"""
import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage, AIMessage

from app.models.schemas import ChatRequest, ChatResponse
from app.services.ai_service import get_chat_response
from app.services.agent_service import agent_app
from app.core.config import get_all_gemini_keys

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
    Send a message to the AI Agent Router.
    Yields dynamic event chunks combining Tool executions and LLM generation.
    """
    try:
        langchain_history = []
        for msg in request.chat_history:
            if msg.role == "human":
                langchain_history.append(HumanMessage(content=msg.content))
            elif msg.role in ["ai", "model", "assistant"]:
                langchain_history.append(AIMessage(content=msg.content))

        langchain_history.append(HumanMessage(content=request.query))

        keys = get_all_gemini_keys()
        initial_state = {
            "messages": langchain_history,
            "next_action": "chat",
            "api_key": keys[0]  # Inject primary key for streaming scope
        }

        async def generate():
            try:
                # Capture the asynchronous event stream directly from LangGraph nodes
                async for event in agent_app.astream_events(initial_state, version="v1"):
                    kind = event["event"]
                    
                    if kind == "on_tool_start":
                        # Stream action notifications seamlessly to the frontend UI
                        tool_name = event["name"]
                        if tool_name == "web_search_tool":
                            yield "\\n\\n*[🌐 Searching the web...]*\\n\\n"
                        elif tool_name == "rag_tool":
                            yield "\\n\\n*[📄 Scanning document database...]*\\n\\n"

                    elif kind == "on_chat_model_stream":
                        # Safely yield generated strings ONLY passing out of the synthesis nodes
                        node_name = event.get("metadata", {}).get("langgraph_node", "")
                        if node_name in ["web_search", "rag", "chat"]:
                            content = event["data"]["chunk"].content
                            if isinstance(content, str) and content:
                                yield content
                            
            except Exception as e:
                yield f"\\n\\n*[Error occurred during generation: {str(e)}]*"

        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        return ChatResponse(success=False, error=str(e))


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Extracts text from PDF/TXT, chunks it, embeds it, and syncs directly into the Pinecone database.
    """
    try:
        text = ""
        if file.filename.endswith(".pdf"):
            from PyPDF2 import PdfReader
            pdf = PdfReader(file.file)
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\\n"
        elif file.filename.endswith(".txt"):
            text = (await file.read()).decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported.")

        if not text.strip():
            raise HTTPException(status_code=400, detail="Document could not be parsed or contains no actionable text.")

        from langchain_text_splitters import RecursiveCharacterTextSplitter
        splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
        chunks = splitter.create_documents([text])
        
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        from langchain_pinecone import PineconeVectorStore
        
        api_key = get_all_gemini_keys()[0]
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
        index_name = os.environ.get("PINECONE_INDEX", "careerforge-index")
        
        PineconeVectorStore.from_documents(chunks, embeddings, index_name=index_name)
        
        return {"success": True, "message": f"Successfully indexed {len(chunks)} fragments into Pinecone RAG."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import operator
import logging
from typing import Annotated, Sequence, TypedDict, Literal
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# --- 1. Define State Framework ---
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_action: str
    api_key: str

# --- 2. Define Integrated Tools ---
@tool
def web_search_tool(query: str) -> str:
    """Searches the web for latest information using DuckDuckGo."""
    try:
        search = DuckDuckGoSearchRun()
        return search.run(query)
    except Exception as e:
        logger.error(f"DuckDuckGo search failed: {e}")
        return "Web search failed. Proceed using internal knowledge."

@tool
def rag_tool(query: str, api_key: str) -> str:
    """Retrieves context from uploaded files via Pinecone."""
    try:
        from langchain_pinecone import PineconeVectorStore
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        import os

        index_name = os.environ.get("PINECONE_INDEX", "careerforge-index")
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001", 
            google_api_key=api_key
        )
        
        vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)
        docs = vectorstore.similarity_search(query, k=3)
        
        if not docs:
            return "No relevant documents found in the database. Please inform the user to upload a file first."
            
        context = "\n\n".join([d.page_content for d in docs])
        return context
    except Exception as e:
        logger.error(f"Pinecone RAG failed: {e}")
        return f"Could not retrieve from Pinecone: {str(e)}"


# --- 3. Decision Router Engine ---
class RouterOutput(BaseModel):
    decision: Literal["web_search", "rag", "chat"] = Field(
        ..., 
        description="The tool to exclusively route to based on query classification."
    )

def decision_node(state: AgentState):
    query = state["messages"][-1].content
    api_key = state["api_key"]
    
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite", 
        temperature=0, 
        google_api_key=api_key
    )
    
    prompt_str = f"""
    Given the most recent user query, return exactly ONE string indicating the action to take.
    - 'web_search': if the query relies on the latest news, current events, immediate real-time stats, or live corporate data out of your default knowledge base.
    - 'rag': if the query specifically asks about uploaded resume context, job descriptions, or user-provided files.
    - 'chat': for general career advice, formatting questions, interview tips, coding problems, or standard conversational requests.
    
    Query: {query}
    """
    
    try:
        response = model.with_structured_output(RouterOutput).invoke(prompt_str)
        action = response.decision
    except Exception as e:
        logger.warning(f"Router failed to parse decision securely, defaulting to standard chat: {e}")
        action = "chat"
        
    return {"next_action": action}


# --- 4. Synthesis / Execution Nodes ---
def web_search_node(state: AgentState):
    query = state["messages"][-1].content
    tool_result = web_search_tool.invoke({"query": query})
    
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite", 
        temperature=0.6, 
        google_api_key=state["api_key"]
    )
    
    synthesis_prompt = f"""
    You are an expert Career Coach named 'CareerForge AI'.
    The user asked: "{query}"
    
    Use the following freshly fetched web search data to provide a highly accurate, professional, and directly helpful response.
    
    WEB DATA: 
    {tool_result}
    
    Synthesize the information eloquently. Be concise and precise.
    """
    response = model.invoke(synthesis_prompt)
    return {"messages": [response]}


def rag_node(state: AgentState):
    query = state["messages"][-1].content
    tool_result = rag_tool.invoke({"query": query, "api_key": state["api_key"]})
    
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite", 
        temperature=0.6, 
        google_api_key=state["api_key"]
    )
    
    synthesis_prompt = f"""
    You are an expert Career Coach named 'CareerForge AI'.
    The user asked: "{query}"
    
    Use the following context retrieved from their secure documents (Pinecone):
    {tool_result}
    
    Provide an accurate and professional answer relying strictly on this context if possible.
    """
    response = model.invoke(synthesis_prompt)
    return {"messages": [response]}


def chat_node(state: AgentState):
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite", 
        temperature=0.6, 
        google_api_key=state["api_key"]
    )
    
    system_prompt = HumanMessage(content="""
        You are an expert Career Coach and Tech Interviewer named 'CareerForge AI'.
        
        YOUR GOALS:
        1. Help users with interview preparation (Mock questions, STAR method tips).
        2. Explain complex tech concepts (Python, AI, DSA) simply.
        3. Provide roadmap advice for students.
        4. Be encouraging, professional, and concise.
        
        If the user asks about something unrelated to careers/tech (like cooking or movies), 
        politely steer them back to career topics.
    """)
    
    # Prepend the system prompt instruction to the conversation history dynamically
    messages_to_send = [system_prompt] + list(state["messages"])
    response = model.invoke(messages_to_send)
    return {"messages": [response]}


# --- 5. State Machine Construction (App Flow) ---
workflow = StateGraph(AgentState)

workflow.add_node("router", decision_node)
workflow.add_node("web_search", web_search_node)
workflow.add_node("rag", rag_node)
workflow.add_node("chat", chat_node)

# Map dynamic router to specific tool nodes
workflow.set_entry_point("router")
workflow.add_conditional_edges("router", lambda state: state["next_action"], {
    "web_search": "web_search",
    "rag": "rag",
    "chat": "chat"
})

workflow.add_edge("web_search", END)
workflow.add_edge("rag", END)
workflow.add_edge("chat", END)

# Export the executable agent app
agent_app = workflow.compile()

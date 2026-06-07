from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from services.ai_service import chat_with_ai
from routers.auth import get_current_user
from models.user import User

router = APIRouter()

TRAVEL_SYSTEM_PROMPT = """You are Voyager AI, an expert AI travel assistant built into the Voyager AI super app.
You help users plan trips, find destinations, book hotels & flights, manage budgets, and provide local travel tips.
Be concise, friendly, and practical. Always provide actionable advice.
If asked about bookings, mention the user can book directly through the app's Flights, Hotels, or Transport modules.
"""

class ChatMessage(BaseModel):
    role: str   # user | assistant
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    trip_context: Optional[dict] = None

class ChatResponse(BaseModel):
    reply: str
    suggestions: Optional[List[str]] = None

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, current_user: User = Depends(get_current_user)):
    system = TRAVEL_SYSTEM_PROMPT
    if req.trip_context:
        system += f"\n\nCurrent trip context: {req.trip_context}"
    msgs = [{"role": m.role, "content": m.content} for m in req.messages]
    reply = await chat_with_ai(msgs, system)
    suggestions = _quick_suggestions(req.messages[-1].content if req.messages else "")
    return ChatResponse(reply=reply, suggestions=suggestions)

@router.post("/voice")
async def voice_chat(audio_text: str, current_user: User = Depends(get_current_user)):
    """Process transcribed voice input."""
    msgs = [{"role": "user", "content": audio_text}]
    reply = await chat_with_ai(msgs, TRAVEL_SYSTEM_PROMPT)
    return {"reply": reply, "input": audio_text}

@router.get("/suggestions")
async def get_suggestions(destination: Optional[str] = None):
    base = [
        "Plan a 5-day trip to Paris",
        "Best budget hotels in Bali",
        "What to pack for a beach vacation",
        "Top restaurants in Tokyo",
        "Visa requirements for Maldives",
    ]
    if destination:
        return {"suggestions": [
            f"Best time to visit {destination}",
            f"Top 10 attractions in {destination}",
            f"Budget for {destination} trip",
            f"Local food to try in {destination}",
            f"Safety tips for {destination}",
        ]}
    return {"suggestions": base}

def _quick_suggestions(last_message: str) -> List[str]:
    text = last_message.lower()
    if any(w in text for w in ["hotel", "stay", "accommodation"]):
        return ["Show me budget options", "Show me luxury options", "Compare prices"]
    if any(w in text for w in ["flight", "fly", "airline"]):
        return ["Search flights", "Track my flight", "Compare airlines"]
    if any(w in text for w in ["food", "eat", "restaurant"]):
        return ["Local cuisine", "Vegetarian options", "Street food guide"]
    return ["Tell me more", "Show nearby attractions", "What's the weather?"]

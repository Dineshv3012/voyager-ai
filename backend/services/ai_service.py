"""
AI Service – uses Google Gemini (free tier) with fallback to mock data.
Set GEMINI_API_KEY in .env to enable live AI responses.
"""
import os, json, httpx
from typing import Optional, List

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROQ_API_KEY   = os.getenv("GROQ_API_KEY", "")

# ── Itinerary Generation ──────────────────────────────────────────────────────
async def generate_itinerary_ai(
    destination: str,
    origin: Optional[str],
    start_date: Optional[str],
    end_date: Optional[str],
    budget: Optional[float],
    currency: str,
    interests: List[str],
    travelers: int,
    travel_style: str,
) -> list:
    prompt = f"""
You are an expert AI travel planner. Create a detailed day-by-day itinerary.

Destination: {destination}
Origin: {origin or 'Not specified'}
Dates: {start_date} to {end_date}
Budget: {budget} {currency} for {travelers} traveler(s)
Style: {travel_style}
Interests: {', '.join(interests) if interests else 'general sightseeing'}

Return ONLY a JSON array like:
[
  {{
    "day": 1,
    "date": "2025-01-01",
    "theme": "Arrival & Exploration",
    "activities": [
      {{
        "time": "09:00",
        "title": "Activity name",
        "place": "Location name",
        "category": "sightseeing",
        "duration_mins": 90,
        "cost_estimate": 20,
        "tips": "Helpful tip",
        "lat": 0.0,
        "lng": 0.0
      }}
    ],
    "accommodation": "Hotel name",
    "meals": {{"breakfast": "Place", "lunch": "Place", "dinner": "Place"}},
    "daily_budget": 150
  }}
]

No markdown, no explanation – pure JSON only.
"""
    # Try Gemini first
    if GEMINI_API_KEY:
        try:
            itinerary = await _call_gemini(prompt)
            if itinerary:
                return itinerary
        except Exception:
            pass

    # Try Groq (Llama) as fallback
    if GROQ_API_KEY:
        try:
            itinerary = await _call_groq(prompt)
            if itinerary:
                return itinerary
        except Exception:
            pass

    # Mock fallback
    return _mock_itinerary(destination, start_date, end_date)

async def _call_gemini(prompt: str) -> Optional[list]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, json=payload)
        r.raise_for_status()
        text = r.json()["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text.strip().lstrip("```json").rstrip("```").strip())

async def _call_groq(prompt: str) -> Optional[list]:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
    }
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, json=payload, headers=headers)
        r.raise_for_status()
        text = r.json()["choices"][0]["message"]["content"]
        return json.loads(text.strip().lstrip("```json").rstrip("```").strip())

def _mock_itinerary(destination: str, start_date, end_date) -> list:
    from datetime import date, timedelta
    try:
        s = date.fromisoformat(str(start_date)) if start_date else date.today()
        e = date.fromisoformat(str(end_date)) if end_date else s + timedelta(days=2)
    except Exception:
        s = date.today(); e = s + timedelta(days=2)

    days = (e - s).days + 1
    result = []
    for i in range(days):
        d = s + timedelta(days=i)
        result.append({
            "day": i + 1,
            "date": str(d),
            "theme": ["Arrival & City Centre", "Culture & History", "Local Life & Departure"][min(i, 2)],
            "activities": [
                {"time": "09:00", "title": f"Morning at {destination} Landmark", "place": f"{destination} Museum",
                 "category": "sightseeing", "duration_mins": 120, "cost_estimate": 15, "tips": "Book tickets online.", "lat": 0.0, "lng": 0.0},
                {"time": "12:30", "title": "Local Lunch", "place": "City Food Market",
                 "category": "food", "duration_mins": 60, "cost_estimate": 20, "tips": "Try local specialties.", "lat": 0.0, "lng": 0.0},
                {"time": "14:30", "title": "Afternoon Tour", "place": f"{destination} Old Town",
                 "category": "sightseeing", "duration_mins": 180, "cost_estimate": 0, "tips": "Wear comfortable shoes.", "lat": 0.0, "lng": 0.0},
                {"time": "19:00", "title": "Dinner & Sunset", "place": "Rooftop Restaurant",
                 "category": "food", "duration_mins": 90, "cost_estimate": 40, "tips": "Reserve in advance.", "lat": 0.0, "lng": 0.0},
            ],
            "accommodation": f"{destination} Central Hotel",
            "meals": {"breakfast": "Hotel buffet", "lunch": "City Food Market", "dinner": "Rooftop Restaurant"},
            "daily_budget": 200,
        })
    return result

# ── Chatbot ───────────────────────────────────────────────────────────────────
async def chat_with_ai(messages: list, system_prompt: str = "") -> str:
    prompt_text = system_prompt + "\n\n"
    for m in messages:
        role = "User" if m["role"] == "user" else "Assistant"
        prompt_text += f"{role}: {m['content']}\n"
    prompt_text += "Assistant:"

    if GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            payload = {"contents": [{"parts": [{"text": prompt_text}]}]}
            async with httpx.AsyncClient(timeout=20) as client:
                r = await client.post(url, json=payload)
                r.raise_for_status()
                return r.json()["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            pass

    if GROQ_API_KEY:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
            msgs = [{"role": "system", "content": system_prompt}] + messages if system_prompt else messages
            payload = {"model": "llama3-8b-8192", "messages": msgs, "temperature": 0.7}
            async with httpx.AsyncClient(timeout=20) as client:
                r = await client.post(url, json=payload, headers=headers)
                r.raise_for_status()
                return r.json()["choices"][0]["message"]["content"]
        except Exception:
            pass

    return "I'm your Voyager AI travel assistant. Ask me anything about your trip, destinations, bookings, or travel tips!"

# ── Translation ───────────────────────────────────────────────────────────────
async def translate_text(text: str, target_lang: str, source_lang: str = "auto") -> dict:
    prompt = f"Translate the following text from {source_lang} to {target_lang}. Return only the translated text, nothing else.\n\nText: {text}"
    translated = await chat_with_ai([{"role": "user", "content": prompt}])
    return {"original": text, "translated": translated, "source_lang": source_lang, "target_lang": target_lang}

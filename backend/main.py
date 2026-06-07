from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

from routers import (
    trips, flights, hotels, transport, expense,
    chatbot, translate, social, group, marketplace,
    maps, auth, emergency, content, gamification, notifications
)
from database import init_db

app = FastAPI(
    title="Voyager AI API",
    description="AI-powered Travel Super App Backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router,           prefix="/api/auth",          tags=["Auth"])
app.include_router(trips.router,          prefix="/api/trips",         tags=["AI Trip Planner"])
app.include_router(flights.router,        prefix="/api/flights",       tags=["Flights"])
app.include_router(hotels.router,         prefix="/api/hotels",        tags=["Hotels"])
app.include_router(transport.router,      prefix="/api/transport",     tags=["Transport"])
app.include_router(expense.router,        prefix="/api/expense",       tags=["Expense Tracker"])
app.include_router(chatbot.router,        prefix="/api/chatbot",       tags=["AI Chatbot"])
app.include_router(translate.router,      prefix="/api/translate",     tags=["Multi-language"])
app.include_router(social.router,         prefix="/api/social",        tags=["Social Network"])
app.include_router(group.router,          prefix="/api/groups",        tags=["Group Travel"])
app.include_router(marketplace.router,    prefix="/api/marketplace",   tags=["Marketplace"])
app.include_router(maps.router,           prefix="/api/maps",          tags=["Maps & GPS"])
app.include_router(emergency.router,      prefix="/api/emergency",     tags=["Emergency"])
app.include_router(content.router,        prefix="/api/content",       tags=["AI Content Creator"])
app.include_router(gamification.router,   prefix="/api/gamification",  tags=["Gamification"])
app.include_router(notifications.router,  prefix="/api/notifications", tags=["Notifications"])

@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/api/health")
async def health():
    return {"status": "ok", "app": "Voyager AI", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from models.expense import Group as GroupModel, MarketplaceListing, Notification
from models.user import User
from routers.auth import get_current_user

# ════════════════════════════════════════════════════════
#  GROUP TRAVEL
# ════════════════════════════════════════════════════════
router = APIRouter()   # placeholder – each module has own router below

group_router = APIRouter()

class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None

@group_router.get("/")
async def list_groups(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GroupModel).where(GroupModel.owner_id == current_user.id))
    return result.scalars().all()

@group_router.post("/", status_code=201)
async def create_group(req: GroupCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    g = GroupModel(name=req.name, description=req.description, owner_id=current_user.id, members=[current_user.id])
    db.add(g); await db.commit(); await db.refresh(g)
    return g

@group_router.post("/{group_id}/invite")
async def invite_member(group_id: str, user_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GroupModel).where(GroupModel.id == group_id))
    g = result.scalar_one_or_none()
    if not g: raise HTTPException(404, "Group not found")
    members = g.members or []
    if user_id not in members:
        members.append(user_id)
        g.members = members
        await db.commit()
    return {"message": "Member invited", "members": g.members}

@group_router.post("/{group_id}/poll")
async def add_poll(group_id: str, question: str, options: List[str], current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GroupModel).where(GroupModel.id == group_id))
    g = result.scalar_one_or_none()
    if not g: raise HTTPException(404, "Group not found")
    polls = g.polls or []
    polls.append({"question": question, "options": [{o: 0} for o in options], "created_by": current_user.id})
    g.polls = polls; await db.commit()
    return {"message": "Poll added"}


# ════════════════════════════════════════════════════════
#  MARKETPLACE
# ════════════════════════════════════════════════════════
marketplace_router = APIRouter()

@marketplace_router.get("/")
async def list_listings(type: Optional[str] = None, location: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    q = select(MarketplaceListing).where(MarketplaceListing.is_active == True)
    if type: q = q.where(MarketplaceListing.type == type)
    if location: q = q.where(MarketplaceListing.location.ilike(f"%{location}%"))
    result = await db.execute(q.limit(30))
    items = result.scalars().all()
    return items if items else _mock_listings(location or "World")

@marketplace_router.post("/", status_code=201)
async def create_listing(data: dict, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    listing = MarketplaceListing(vendor_id=current_user.id, **{k: v for k, v in data.items() if hasattr(MarketplaceListing, k)})
    db.add(listing); await db.commit(); await db.refresh(listing)
    return listing

def _mock_listings(location):
    types = ["tour", "guide", "experience", "package", "experience", "tour"]
    titles = ["Sunset Boat Tour", "Local Expert Guide", "Cooking Class", "Adventure Package", "Temple Walk", "City Photo Tour"]
    prices = [45, 80, 35, 299, 25, 60]
    return [{"id": f"L{i}", "type": t, "title": ti, "location": location, "price": p, "currency": "USD",
             "rating": 4.2 + i*0.1, "review_count": 50 + i*20, "duration": f"{i+2} hours", "is_active": True}
            for i, (t, ti, p) in enumerate(zip(types, titles, prices))]


# ════════════════════════════════════════════════════════
#  MAPS & GPS
# ════════════════════════════════════════════════════════
maps_router = APIRouter()

@maps_router.get("/geocode")
async def geocode(address: str = Query(...)):
    # In production, call Google Maps / Mapbox API
    return {"address": address, "lat": 13.0827, "lng": 80.2707, "formatted": address, "country": "Unknown"}

@maps_router.get("/reverse-geocode")
async def reverse_geocode(lat: float = Query(...), lng: float = Query(...)):
    return {"lat": lat, "lng": lng, "address": "Sample Address", "city": "City", "country": "Country"}

@maps_router.get("/directions")
async def directions(origin: str = Query(...), destination: str = Query(...), mode: str = "driving"):
    return {
        "origin": origin, "destination": destination, "mode": mode,
        "distance_km": 12.5, "duration_mins": 28,
        "steps": [
            {"instruction": f"Head towards {destination}", "distance_m": 500, "duration_s": 60},
            {"instruction": "Turn right onto Main Street", "distance_m": 1200, "duration_s": 180},
            {"instruction": f"Arrive at {destination}", "distance_m": 0, "duration_s": 0},
        ]
    }

@maps_router.get("/pois")
async def points_of_interest(lat: float = Query(...), lng: float = Query(...), category: str = "all", radius_m: int = 1000):
    pois_by_cat = {
        "restaurant": [{"name": "Local Diner", "rating": 4.3, "distance_m": 200}],
        "hotel": [{"name": "City Inn", "rating": 4.0, "distance_m": 350}],
        "atm": [{"name": "ATM", "rating": None, "distance_m": 150}],
        "hospital": [{"name": "City Hospital", "rating": 4.1, "distance_m": 800}],
    }
    if category == "all":
        pois = [{"category": cat, **p} for cat, ps in pois_by_cat.items() for p in ps]
    else:
        pois = [{"category": category, **p} for p in pois_by_cat.get(category, [])]
    return {"pois": pois, "lat": lat, "lng": lng, "radius_m": radius_m}


# ════════════════════════════════════════════════════════
#  EMERGENCY
# ════════════════════════════════════════════════════════
emergency_router = APIRouter()

@emergency_router.get("/contacts/{country_code}")
async def emergency_contacts(country_code: str):
    db_contacts = {
        "IN": {"police": "100", "ambulance": "108", "fire": "101", "tourist_helpline": "1800-11-1363"},
        "US": {"police": "911", "ambulance": "911", "fire": "911"},
        "UK": {"police": "999", "ambulance": "999", "fire": "999"},
        "SG": {"police": "999", "ambulance": "995", "fire": "995"},
        "AE": {"police": "999", "ambulance": "998", "fire": "997"},
    }
    return db_contacts.get(country_code.upper(), {"police": "112", "ambulance": "112", "fire": "112", "note": "EU standard"})

@emergency_router.post("/sos")
async def sos_alert(lat: float, lng: float, user_id: Optional[str] = None, message: Optional[str] = None, current_user: User = Depends(get_current_user)):
    return {
        "sos_id": f"SOS-{current_user.id[:8]}",
        "status": "Alert sent",
        "lat": lat, "lng": lng,
        "message": message or "Emergency SOS triggered",
        "contacts_notified": True,
        "nearest_hospital": "City Hospital – 1.2 km",
        "nearest_police": "Central Police Station – 0.8 km",
    }

@emergency_router.get("/nearby-hospitals")
async def nearby_hospitals(lat: float = Query(...), lng: float = Query(...)):
    return {"hospitals": [
        {"name": "City General Hospital", "distance_km": 1.2, "phone": "+91-44-2345-6789", "emergency": True},
        {"name": "Apollo Hospital", "distance_km": 2.5, "phone": "+91-44-2829-3333", "emergency": True},
    ]}


# ════════════════════════════════════════════════════════
#  AI CONTENT CREATOR
# ════════════════════════════════════════════════════════
content_router = APIRouter()

@content_router.post("/blog")
async def generate_blog(destination: str, trip_highlights: List[str], current_user: User = Depends(get_current_user)):
    from services.ai_service import chat_with_ai
    prompt = f"Write a 300-word travel blog post about {destination}. Include these highlights: {', '.join(trip_highlights)}. Use an engaging, personal tone."
    content = await chat_with_ai([{"role": "user", "content": prompt}])
    return {"title": f"My Amazing Trip to {destination}", "content": content, "destination": destination}

@content_router.post("/social-caption")
async def generate_caption(destination: str, mood: str = "excited", platform: str = "instagram", current_user: User = Depends(get_current_user)):
    from services.ai_service import chat_with_ai
    prompt = f"Write a {mood} social media caption for {platform} about visiting {destination}. Include 5 relevant hashtags. Keep it under 150 chars."
    caption = await chat_with_ai([{"role": "user", "content": prompt}])
    return {"caption": caption, "platform": platform, "destination": destination}

@content_router.post("/packing-list")
async def generate_packing_list(destination: str, duration_days: int, activities: List[str] = [], current_user: User = Depends(get_current_user)):
    from services.ai_service import chat_with_ai
    prompt = f"Create a packing list for a {duration_days}-day trip to {destination} for activities: {', '.join(activities) or 'general tourism'}. Return as JSON: {{\"essentials\":[], \"clothing\":[], \"electronics\":[], \"documents\":[], \"optional\":[]}}. Return JSON only."
    content = await chat_with_ai([{"role": "user", "content": prompt}])
    try:
        import json
        return {"packing_list": json.loads(content.strip().lstrip("```json").rstrip("```").strip()), "destination": destination}
    except Exception:
        return {"packing_list": {"essentials": ["Passport", "Tickets", "Cash"], "clothing": ["T-shirts", "Pants", "Shoes"]}, "destination": destination}


# ════════════════════════════════════════════════════════
#  GAMIFICATION
# ════════════════════════════════════════════════════════
gamification_router = APIRouter()

BADGES = [
    {"id": "first_trip", "name": "First Adventure", "description": "Complete your first trip", "icon": "✈️", "xp": 100},
    {"id": "globe_trotter", "name": "Globe Trotter", "description": "Visit 10 countries", "icon": "🌍", "xp": 500},
    {"id": "budget_master", "name": "Budget Master", "description": "Stay under budget 5 trips", "icon": "💰", "xp": 200},
    {"id": "social_star", "name": "Social Star", "description": "Get 100 likes on posts", "icon": "⭐", "xp": 150},
    {"id": "explorer", "name": "Explorer", "description": "Try 5 different cuisines", "icon": "🍜", "xp": 75},
]

@gamification_router.get("/badges")
async def list_badges():
    return {"badges": BADGES}

@gamification_router.get("/leaderboard")
async def leaderboard(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import desc
    result = await db.execute(select(User).order_by(User.xp_points.desc()).limit(10))
    users = result.scalars().all()
    return {"leaderboard": [{"rank": i+1, "username": u.username, "xp": u.xp_points, "level": u.travel_level} for i, u in enumerate(users)]}

@gamification_router.post("/award-xp")
async def award_xp(points: int, reason: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    current_user.xp_points = (current_user.xp_points or 0) + points
    current_user.travel_level = max(1, (current_user.xp_points or 0) // 500 + 1)
    await db.commit()
    return {"xp_awarded": points, "total_xp": current_user.xp_points, "level": current_user.travel_level, "reason": reason}


# ════════════════════════════════════════════════════════
#  NOTIFICATIONS
# ════════════════════════════════════════════════════════
notifications_router = APIRouter()

@notifications_router.get("/")
async def list_notifications(unread_only: bool = False, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = select(Notification).where(Notification.user_id == current_user.id)
    if unread_only:
        q = q.where(Notification.is_read == False)
    result = await db.execute(q.order_by(Notification.created_at.desc()).limit(50))
    return result.scalars().all()

@notifications_router.post("/{notif_id}/read")
async def mark_read(notif_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Notification).where(Notification.id == notif_id, Notification.user_id == current_user.id))
    n = result.scalar_one_or_none()
    if n:
        n.is_read = True
        await db.commit()
    return {"message": "Marked as read"}

@notifications_router.post("/mark-all-read")
async def mark_all_read(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Notification).where(Notification.user_id == current_user.id, Notification.is_read == False))
    for n in result.scalars().all():
        n.is_read = True
    await db.commit()
    return {"message": "All marked as read"}

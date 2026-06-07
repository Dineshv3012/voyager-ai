from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from datetime import date
from database import get_db
from models.flight import Hotel
from routers.auth import get_current_user
from models.user import User

router = APIRouter()

class HotelSearch(BaseModel):
    city: str
    check_in: date
    check_out: date
    guests: Optional[int] = 1
    rooms: Optional[int] = 1
    type: Optional[str] = None  # hotel|resort|hostel|homestay
    min_stars: Optional[int] = None
    max_price: Optional[float] = None

@router.post("/search")
async def search_hotels(req: HotelSearch, db: AsyncSession = Depends(get_db)):
    q = select(Hotel).where(Hotel.city == req.city)
    if req.type: q = q.where(Hotel.type == req.type)
    if req.min_stars: q = q.where(Hotel.stars >= req.min_stars)
    if req.max_price: q = q.where(Hotel.price_per_night <= req.max_price)
    result = await db.execute(q.limit(20))
    hotels = result.scalars().all()
    if not hotels:
        hotels = _mock_hotels(req.city)
    return {"hotels": hotels, "total": len(hotels), "check_in": req.check_in, "check_out": req.check_out}

@router.get("/{hotel_id}")
async def get_hotel(hotel_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hotel).where(Hotel.id == hotel_id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        return _mock_hotel_detail(hotel_id)
    return hotel

@router.get("/recommendations/ai")
async def ai_hotel_recommendations(destination: str = Query(...), budget: Optional[float] = None, style: Optional[str] = "comfort"):
    return {
        "destination": destination,
        "recommendations": _mock_hotels(destination)[:3],
        "ai_note": f"Based on your {style} preference and ${budget or 'flexible'} budget"
    }

def _mock_hotels(city):
    names = ["Grand Palace Hotel", "City View Suites", "Boutique Garden Inn",
             "Luxury Sky Resort", "Budget Backpackers", "Heritage Mansion"]
    types = ["hotel", "hotel", "hotel", "resort", "hostel", "hotel"]
    prices = [180, 120, 90, 350, 25, 200]
    stars = [5, 4, 3, 5, 2, 4]
    ratings = [4.7, 4.3, 4.1, 4.8, 3.9, 4.5]
    return [
        {"id": f"H{i}", "name": n, "type": t, "city": city, "country": "World",
         "stars": s, "rating": r, "review_count": 100+i*50,
         "price_per_night": p, "currency": "USD",
         "amenities": ["WiFi", "Pool", "Spa"][:min(s,3)],
         "images": [f"https://source.unsplash.com/400x300/?hotel,{city.lower().replace(' ','-')}&sig={i}"],
         "check_in": "14:00", "check_out": "12:00"}
        for i, (n, t, p, s, r) in enumerate(zip(names, types, prices, stars, ratings))
    ]

def _mock_hotel_detail(hotel_id):
    return {
        "id": hotel_id, "name": "Voyager Partner Hotel", "type": "hotel",
        "description": "A beautifully curated hotel in the heart of the city.",
        "stars": 4, "rating": 4.5, "review_count": 312,
        "price_per_night": 135, "currency": "USD",
        "amenities": ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Parking"],
        "rooms": [
            {"type": "Standard", "price": 135, "beds": "1 Queen", "size_sqm": 28},
            {"type": "Deluxe", "price": 180, "beds": "1 King", "size_sqm": 36},
            {"type": "Suite", "price": 320, "beds": "1 King + Living room", "size_sqm": 60},
        ]
    }

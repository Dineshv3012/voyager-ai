from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from database import get_db
from models.trip import Trip, Booking
from models.user import User
from routers.auth import get_current_user
from services.ai_service import generate_itinerary_ai

router = APIRouter()

# ── Schemas ──
class TripCreate(BaseModel):
    title: str
    destination: str
    origin: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = 0.0
    currency: Optional[str] = "USD"
    description: Optional[str] = None
    is_public: Optional[bool] = False

class AITripRequest(BaseModel):
    destination: str
    origin: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None
    currency: Optional[str] = "USD"
    interests: Optional[List[str]] = []
    travelers: Optional[int] = 1
    travel_style: Optional[str] = "balanced"   # budget|balanced|luxury

class TripOut(BaseModel):
    id: str
    title: str
    destination: str
    origin: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    budget: float
    currency: str
    status: str
    itinerary: list
    ai_generated: bool
    is_public: bool
    tags: list
    created_at: datetime

    class Config:
        from_attributes = True

# ── Routes ──
@router.post("/generate", response_model=dict)
async def generate_trip(req: AITripRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Generate an AI-powered trip itinerary."""
    itinerary = await generate_itinerary_ai(
        destination=req.destination,
        origin=req.origin,
        start_date=str(req.start_date) if req.start_date else None,
        end_date=str(req.end_date) if req.end_date else None,
        budget=req.budget,
        currency=req.currency,
        interests=req.interests,
        travelers=req.travelers,
        travel_style=req.travel_style,
    )
    days = (req.end_date - req.start_date).days + 1 if req.start_date and req.end_date else 3
    trip = Trip(
        user_id=current_user.id,
        title=f"AI Trip to {req.destination}",
        destination=req.destination,
        origin=req.origin,
        start_date=req.start_date,
        end_date=req.end_date,
        budget=req.budget or 0.0,
        currency=req.currency,
        ai_generated=True,
        itinerary=itinerary,
        tags=req.interests,
    )
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return {"trip_id": trip.id, "itinerary": itinerary, "message": "Trip generated successfully"}

@router.get("/", response_model=List[TripOut])
async def list_trips(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.user_id == current_user.id).order_by(Trip.created_at.desc()))
    return result.scalars().all()

@router.post("/", response_model=TripOut, status_code=201)
async def create_trip(req: TripCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    trip = Trip(user_id=current_user.id, **req.dict())
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return trip

@router.get("/{trip_id}", response_model=TripOut)
async def get_trip(trip_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(404, "Trip not found")
    return trip

@router.put("/{trip_id}")
async def update_trip(trip_id: str, updates: dict, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(404, "Trip not found")
    allowed = {"title","description","budget","currency","status","is_public","itinerary","tags","cover_image"}
    for k, v in updates.items():
        if k in allowed:
            setattr(trip, k, v)
    await db.commit()
    return {"message": "Trip updated"}

@router.delete("/{trip_id}")
async def delete_trip(trip_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(404, "Trip not found")
    await db.execute(delete(Trip).where(Trip.id == trip_id))
    await db.commit()
    return {"message": "Trip deleted"}

@router.get("/public/explore")
async def explore_trips(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.is_public == True).limit(20))
    return result.scalars().all()

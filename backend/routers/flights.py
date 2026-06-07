from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from database import get_db
from models.flight import Flight
from routers.auth import get_current_user
from models.user import User

router = APIRouter()

class FlightSearch(BaseModel):
    origin: str
    destination: str
    departure_date: date
    return_date: Optional[date] = None
    passengers: Optional[int] = 1
    cabin_class: Optional[str] = "economy"

@router.post("/search")
async def search_flights(req: FlightSearch, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Flight).where(
        Flight.origin == req.origin,
        Flight.destination == req.destination,
    ).limit(20))
    flights = result.scalars().all()
    if not flights:
        # Return mock data when no real data exists
        flights = _mock_flights(req.origin, req.destination, req.departure_date, req.cabin_class)
    return {"flights": flights, "total": len(flights)}

@router.get("/track/{flight_number}")
async def track_flight(flight_number: str):
    return {
        "flight_number": flight_number,
        "status": "On Time",
        "departure": {"airport": "DEL", "time": "10:30", "terminal": "3", "gate": "B12"},
        "arrival": {"airport": "BOM", "time": "12:45", "terminal": "2", "gate": "C5"},
        "aircraft": "Airbus A320",
        "delay_minutes": 0,
    }

@router.get("/airports/search")
async def search_airports(q: str = Query(..., min_length=2)):
    airports = [
        {"code": "DEL", "name": "Indira Gandhi International", "city": "New Delhi", "country": "India"},
        {"code": "BOM", "name": "Chhatrapati Shivaji Maharaj", "city": "Mumbai", "country": "India"},
        {"code": "MAA", "name": "Chennai International", "city": "Chennai", "country": "India"},
        {"code": "BLR", "name": "Kempegowda International", "city": "Bengaluru", "country": "India"},
        {"code": "DXB", "name": "Dubai International", "city": "Dubai", "country": "UAE"},
        {"code": "LHR", "name": "Heathrow", "city": "London", "country": "UK"},
        {"code": "JFK", "name": "John F. Kennedy International", "city": "New York", "country": "USA"},
        {"code": "SIN", "name": "Changi Airport", "city": "Singapore", "country": "Singapore"},
        {"code": "NRT", "name": "Narita International", "city": "Tokyo", "country": "Japan"},
        {"code": "CDG", "name": "Charles de Gaulle", "city": "Paris", "country": "France"},
    ]
    q_lower = q.lower()
    return [a for a in airports if q_lower in a["code"].lower() or q_lower in a["city"].lower() or q_lower in a["name"].lower()]

def _mock_flights(origin, destination, dep_date, cabin_class):
    return [
        {"id": f"FL{i}", "airline": airline, "flight_number": f"{code}{100+i}",
         "origin": origin, "destination": destination,
         "departure_time": f"{dep_date}T{6+i*2:02d}:00:00",
         "arrival_time": f"{dep_date}T{8+i*2:02d}:30:00",
         "duration_mins": 150 + i*10, "stops": stops,
         "cabin_class": cabin_class, "price": price, "currency": "USD",
         "seats_available": 20 - i*3, "amenities": ["WiFi", "Meal"]}
        for i, (airline, code, stops, price) in enumerate([
            ("IndiGo", "6E", 0, 89), ("Air India", "AI", 0, 110),
            ("SpiceJet", "SG", 1, 72), ("Vistara", "UK", 0, 145),
        ])
    ]

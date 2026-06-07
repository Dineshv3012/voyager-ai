from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter()

class TransportSearch(BaseModel):
    origin: str
    destination: str
    travel_date: date
    type: Optional[str] = None  # train|bus|taxi|car_rental|bike|metro|ferry
    passengers: Optional[int] = 1

@router.post("/search")
async def search_transport(req: TransportSearch):
    types = [req.type] if req.type else ["train", "bus", "taxi", "car_rental"]
    results = []
    for t in types:
        results.extend(_mock_transport(req.origin, req.destination, str(req.travel_date), t))
    return {"transports": results, "total": len(results)}

@router.get("/metro/{city}")
async def metro_info(city: str):
    metro_data = {
        "chennai": {"lines": ["Blue Line", "Green Line"], "fare_range": "10-60 INR", "hours": "5:00–23:00"},
        "mumbai": {"lines": ["Aqua Line", "Yellow Line", "Red Line"], "fare_range": "10-80 INR", "hours": "5:30–23:30"},
        "delhi": {"lines": ["Red", "Yellow", "Blue", "Green", "Violet", "Pink"], "fare_range": "10-60 INR", "hours": "5:00–23:00"},
    }
    return metro_data.get(city.lower(), {"lines": ["Central Line"], "fare_range": "1-5 USD", "hours": "6:00–22:00"})

@router.get("/nearby-services")
async def nearby_services(lat: float = Query(...), lng: float = Query(...), type: str = Query(...)):
    return {
        "type": type,
        "services": [
            {"id": f"S{i}", "name": f"{type.title()} Station {i+1}", "distance_m": 200*i+300,
             "lat": lat + 0.001*i, "lng": lng + 0.001*i, "open_now": True}
            for i in range(5)
        ]
    }

def _mock_transport(origin, destination, travel_date, t):
    configs = {
        "train":      [("Indian Railways", 18, 35), ("Shatabdi Express", 12, 65), ("Rajdhani", 16, 90)],
        "bus":        [("State Bus", 8, 12), ("Volvo AC", 7, 22), ("Sleeper Bus", 10, 18)],
        "taxi":       [("Ola", 2, 25), ("Uber", 1, 30), ("Rapido", 1, 18)],
        "car_rental": [("Zoomcar", None, 45), ("Drivezy", None, 38), ("Myles", None, 50)],
        "ferry":      [("Sea Link", 2, 15)],
    }
    items = configs.get(t, [("Local", 5, 20)])
    return [
        {"id": f"{t[:2].upper()}{i}", "type": t, "provider": provider,
         "origin": origin, "destination": destination,
         "departure_time": f"{travel_date}T{6+i*3:02d}:00:00",
         "duration_hours": duration, "price": price, "currency": "USD",
         "seats_available": 20 - i*5}
        for i, (provider, duration, price) in enumerate(items)
    ]

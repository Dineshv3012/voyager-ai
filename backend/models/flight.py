from sqlalchemy import Column, String, DateTime, Integer, Float, Text, ForeignKey, JSON, Boolean
from datetime import datetime
import uuid
from database import Base

def gen_id(): return str(uuid.uuid4())

class Flight(Base):
    __tablename__ = "flights"
    id              = Column(String, primary_key=True, default=gen_id)
    airline         = Column(String)
    flight_number   = Column(String)
    origin          = Column(String)
    destination     = Column(String)
    departure_time  = Column(DateTime)
    arrival_time    = Column(DateTime)
    duration_mins   = Column(Integer)
    stops           = Column(Integer, default=0)
    cabin_class     = Column(String, default="economy")
    price           = Column(Float)
    currency        = Column(String, default="USD")
    seats_available = Column(Integer)
    amenities       = Column(JSON, default=list)
    airline_logo    = Column(String)
    created_at      = Column(DateTime, default=datetime.utcnow)

class Hotel(Base):
    __tablename__ = "hotels"
    id              = Column(String, primary_key=True, default=gen_id)
    name            = Column(String, nullable=False)
    type            = Column(String, default="hotel")   # hotel|resort|hostel|homestay
    description     = Column(Text)
    city            = Column(String)
    country         = Column(String)
    address         = Column(String)
    latitude        = Column(Float)
    longitude       = Column(Float)
    stars           = Column(Integer)
    rating          = Column(Float)
    review_count    = Column(Integer, default=0)
    price_per_night = Column(Float)
    currency        = Column(String, default="USD")
    amenities       = Column(JSON, default=list)
    images          = Column(JSON, default=list)
    rooms           = Column(JSON, default=list)
    check_in        = Column(String, default="14:00")
    check_out       = Column(String, default="12:00")
    created_at      = Column(DateTime, default=datetime.utcnow)

class Transport(Base):
    __tablename__ = "transports"
    id              = Column(String, primary_key=True, default=gen_id)
    type            = Column(String)   # train|bus|taxi|car_rental|bike|metro|ferry
    provider        = Column(String)
    origin          = Column(String)
    destination     = Column(String)
    departure_time  = Column(DateTime)
    arrival_time    = Column(DateTime)
    price           = Column(Float)
    currency        = Column(String, default="USD")
    seats_available = Column(Integer)
    amenities       = Column(JSON, default=list)
    created_at      = Column(DateTime, default=datetime.utcnow)

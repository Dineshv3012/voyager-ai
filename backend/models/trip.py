from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, Text, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

def gen_id(): return str(uuid.uuid4())

class Trip(Base):
    __tablename__ = "trips"
    id            = Column(String, primary_key=True, default=gen_id)
    user_id       = Column(String, ForeignKey("users.id"), nullable=False)
    title         = Column(String, nullable=False)
    description   = Column(Text)
    destination   = Column(String, nullable=False)
    origin        = Column(String)
    start_date    = Column(Date)
    end_date      = Column(Date)
    budget        = Column(Float, default=0.0)
    currency      = Column(String, default="USD")
    status        = Column(String, default="planning")  # planning|active|completed|cancelled
    cover_image   = Column(String)
    is_public     = Column(Boolean, default=False)
    ai_generated  = Column(Boolean, default=False)
    itinerary     = Column(JSON, default=list)   # [{day, activities:[{time,title,place,notes}]}]
    tags          = Column(JSON, default=list)
    group_id      = Column(String, ForeignKey("groups.id"), nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user          = relationship("User", back_populates="trips")
    expenses      = relationship("Expense", back_populates="trip", cascade="all, delete")
    bookings      = relationship("Booking", back_populates="trip", cascade="all, delete")

class Booking(Base):
    __tablename__ = "bookings"
    id            = Column(String, primary_key=True, default=gen_id)
    trip_id       = Column(String, ForeignKey("trips.id"), nullable=False)
    type          = Column(String)   # flight|hotel|transport|tour
    reference     = Column(String)
    provider      = Column(String)
    details       = Column(JSON, default=dict)
    price         = Column(Float)
    currency      = Column(String, default="USD")
    status        = Column(String, default="confirmed")
    booked_at     = Column(DateTime, default=datetime.utcnow)

    trip          = relationship("Trip", back_populates="bookings")

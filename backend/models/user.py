from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

def gen_id():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id            = Column(String, primary_key=True, default=gen_id)
    email         = Column(String, unique=True, nullable=False, index=True)
    username      = Column(String, unique=True, nullable=False)
    full_name     = Column(String)
    hashed_password = Column(String, nullable=False)
    avatar_url    = Column(String)
    bio           = Column(Text)
    nationality   = Column(String)
    preferred_language = Column(String, default="en")
    preferred_currency = Column(String, default="USD")
    is_active     = Column(Boolean, default=True)
    is_verified   = Column(Boolean, default=False)
    role          = Column(String, default="traveler")   # traveler | vendor | admin
    travel_level  = Column(Integer, default=1)
    xp_points     = Column(Integer, default=0)
    badges        = Column(JSON, default=list)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    trips         = relationship("Trip", back_populates="user", cascade="all, delete")
    expenses      = relationship("Expense", back_populates="user", cascade="all, delete")
    posts         = relationship("SocialPost", back_populates="user", cascade="all, delete")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete")

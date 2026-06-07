from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

def gen_id(): return str(uuid.uuid4())

# ── EXPENSE ──────────────────────────────────────────────────────────────────
class Expense(Base):
    __tablename__ = "expenses"
    id          = Column(String, primary_key=True, default=gen_id)
    user_id     = Column(String, ForeignKey("users.id"), nullable=False)
    trip_id     = Column(String, ForeignKey("trips.id"), nullable=True)
    category    = Column(String)   # food|transport|accommodation|activity|shopping|other
    title       = Column(String, nullable=False)
    amount      = Column(Float, nullable=False)
    currency    = Column(String, default="USD")
    usd_amount  = Column(Float)
    receipt_url = Column(String)
    notes       = Column(Text)
    date        = Column(DateTime, default=datetime.utcnow)
    created_at  = Column(DateTime, default=datetime.utcnow)

    user        = relationship("User", back_populates="expenses")
    trip        = relationship("Trip", back_populates="expenses")

# ── SOCIAL ────────────────────────────────────────────────────────────────────
class SocialPost(Base):
    __tablename__ = "social_posts"
    id          = Column(String, primary_key=True, default=gen_id)
    user_id     = Column(String, ForeignKey("users.id"), nullable=False)
    type        = Column(String, default="post")   # post|story|reel|blog
    caption     = Column(Text)
    media_urls  = Column(JSON, default=list)
    location    = Column(String)
    tags        = Column(JSON, default=list)
    likes       = Column(Integer, default=0)
    comments    = Column(JSON, default=list)
    is_public   = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

    user        = relationship("User", back_populates="posts")

# ── GROUP ─────────────────────────────────────────────────────────────────────
class Group(Base):
    __tablename__ = "groups"
    id          = Column(String, primary_key=True, default=gen_id)
    name        = Column(String, nullable=False)
    description = Column(Text)
    cover_image = Column(String)
    owner_id    = Column(String, ForeignKey("users.id"))
    members     = Column(JSON, default=list)   # [user_ids]
    shared_itinerary = Column(JSON, default=dict)
    polls       = Column(JSON, default=list)
    expenses    = Column(JSON, default=list)
    chat_messages = Column(JSON, default=list)
    created_at  = Column(DateTime, default=datetime.utcnow)

# ── MARKETPLACE ───────────────────────────────────────────────────────────────
class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"
    id          = Column(String, primary_key=True, default=gen_id)
    vendor_id   = Column(String, ForeignKey("users.id"))
    type        = Column(String)   # tour|guide|experience|package|hotel|transport
    title       = Column(String, nullable=False)
    description = Column(Text)
    location    = Column(String)
    price       = Column(Float)
    currency    = Column(String, default="USD")
    duration    = Column(String)
    max_people  = Column(Integer)
    images      = Column(JSON, default=list)
    rating      = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    availability = Column(JSON, default=list)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

# ── NOTIFICATION ──────────────────────────────────────────────────────────────
class Notification(Base):
    __tablename__ = "notifications"
    id          = Column(String, primary_key=True, default=gen_id)
    user_id     = Column(String, ForeignKey("users.id"), nullable=False)
    type        = Column(String)   # trip|booking|social|system|emergency
    title       = Column(String, nullable=False)
    message     = Column(Text)
    data        = Column(JSON, default=dict)
    is_read     = Column(Boolean, default=False)
    created_at  = Column(DateTime, default=datetime.utcnow)

    user        = relationship("User", back_populates="notifications")

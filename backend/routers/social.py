from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from models.expense import SocialPost
from models.user import User
from routers.auth import get_current_user

router = APIRouter()

class PostCreate(BaseModel):
    type: str = "post"
    caption: Optional[str] = None
    media_urls: Optional[List[str]] = []
    location: Optional[str] = None
    tags: Optional[List[str]] = []

@router.get("/feed")
async def feed(limit: int = 20, offset: int = 0, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SocialPost).where(SocialPost.is_public == True)
        .order_by(SocialPost.created_at.desc()).limit(limit).offset(offset)
    )
    posts = result.scalars().all()
    if not posts:
        posts = _mock_feed()
    return {"posts": posts, "has_more": len(posts) == limit}

@router.post("/posts", status_code=201)
async def create_post(req: PostCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    post = SocialPost(user_id=current_user.id, **req.dict())
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post

@router.post("/posts/{post_id}/like")
async def like_post(post_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SocialPost).where(SocialPost.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(404, "Post not found")
    post.likes = (post.likes or 0) + 1
    await db.commit()
    return {"likes": post.likes}

@router.delete("/posts/{post_id}")
async def delete_post(post_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SocialPost).where(SocialPost.id == post_id, SocialPost.user_id == current_user.id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(404, "Post not found")
    await db.delete(post)
    await db.commit()
    return {"message": "Deleted"}

def _mock_feed():
    destinations = ["Bali", "Paris", "Tokyo", "Santorini", "New York", "Maldives"]
    return [
        {"id": f"P{i}", "type": "post", "user_id": f"U{i}",
         "caption": f"Amazing time in {d}! 🌍 #travel #wanderlust #{d.lower()}",
         "media_urls": [f"https://source.unsplash.com/400x400/?{d.lower()}&sig={i}"],
         "location": d, "tags": ["travel", d.lower()],
         "likes": 100 + i*23, "is_public": True,
         "created_at": "2025-01-01T10:00:00"}
        for i, d in enumerate(destinations)
    ]

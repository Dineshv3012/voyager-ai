from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import get_db
from models.expense import Expense
from models.user import User
from routers.auth import get_current_user

router = APIRouter()

EXCHANGE_RATES = {
    "USD": 1.0, "INR": 83.5, "EUR": 0.92, "GBP": 0.79,
    "JPY": 149.5, "AUD": 1.54, "SGD": 1.35, "AED": 3.67, "THB": 35.2,
}

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    currency: str = "USD"
    category: str = "other"
    trip_id: Optional[str] = None
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    date: Optional[datetime] = None

@router.get("/")
async def list_expenses(trip_id: Optional[str] = None, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = select(Expense).where(Expense.user_id == current_user.id)
    if trip_id:
        q = q.where(Expense.trip_id == trip_id)
    result = await db.execute(q.order_by(Expense.date.desc()).limit(100))
    return result.scalars().all()

@router.post("/", status_code=201)
async def add_expense(req: ExpenseCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rate = EXCHANGE_RATES.get(req.currency.upper(), 1.0)
    usd_amount = req.amount / rate
    expense = Expense(
        user_id=current_user.id,
        trip_id=req.trip_id,
        title=req.title,
        amount=req.amount,
        currency=req.currency.upper(),
        usd_amount=usd_amount,
        category=req.category,
        notes=req.notes,
        receipt_url=req.receipt_url,
        date=req.date or datetime.utcnow(),
    )
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    return expense

@router.delete("/{expense_id}")
async def delete_expense(expense_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Expense).where(Expense.id == expense_id, Expense.user_id == current_user.id))
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(404, "Expense not found")
    await db.delete(exp)
    await db.commit()
    return {"message": "Deleted"}

@router.get("/summary")
async def expense_summary(trip_id: Optional[str] = None, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = select(Expense).where(Expense.user_id == current_user.id)
    if trip_id:
        q = q.where(Expense.trip_id == trip_id)
    result = await db.execute(q)
    expenses = result.scalars().all()
    total_usd = sum(e.usd_amount or 0 for e in expenses)
    by_category = {}
    for e in expenses:
        by_category[e.category] = by_category.get(e.category, 0) + (e.usd_amount or 0)
    return {
        "total_usd": round(total_usd, 2),
        "by_category": {k: round(v, 2) for k, v in by_category.items()},
        "expense_count": len(expenses),
        "currencies_used": list(set(e.currency for e in expenses)),
    }

@router.get("/convert")
async def convert_currency(amount: float, from_currency: str, to_currency: str):
    from_rate = EXCHANGE_RATES.get(from_currency.upper(), 1.0)
    to_rate   = EXCHANGE_RATES.get(to_currency.upper(), 1.0)
    converted = (amount / from_rate) * to_rate
    return {
        "amount": amount, "from": from_currency.upper(),
        "to": to_currency.upper(), "converted": round(converted, 2),
        "rate": round(to_rate / from_rate, 6)
    }

@router.get("/currencies")
async def list_currencies():
    return {"currencies": list(EXCHANGE_RATES.keys())}

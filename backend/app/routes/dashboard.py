from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.database import get_db
from app.models.client import Client
from app.models.packages import TravelPackage
from app.models.booking import Booking
from app.schemas.dashboard import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Count queries — each runs a single SQL COUNT(*)
    total_bookings = db.query(Booking).count()
    total_clients  = db.query(Client).count()
    total_packages = db.query(TravelPackage).count()

    # SUM of all booking amounts — returns None if no bookings yet
    total_revenue = db.query(
        func.sum(Booking.total_amount)
    ).scalar() or 0.0

    # Last 5 bookings with client and package info
    recent_bookings = db.query(Booking).options(
        joinedload(Booking.client),
        joinedload(Booking.package)
    ).order_by(Booking.created_at.desc()).limit(5).all()

    return {
        "total_bookings":  total_bookings,
        "total_clients":   total_clients,
        "total_packages":  total_packages,
        "total_revenue":   float(total_revenue),
        "recent_bookings": recent_bookings
    }
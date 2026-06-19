from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database import get_db
from app.models.booking import Booking
from app.models.packages import TravelPackage
from app.schemas.report import ReportData

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/", response_model=ReportData)
def get_report_data(db: Session = Depends(get_db)):

    # 1. Monthly revenue — last 6 months
    six_months_ago = datetime.now() - timedelta(days=180)

    monthly_data = db.query(
        func.to_char(Booking.travel_date, 'Mon YYYY').label('month'),
        func.sum(Booking.total_amount).label('revenue'),
        func.count(Booking.id).label('bookings')
    ).filter(
        Booking.travel_date >= six_months_ago
    ).group_by(
        func.to_char(Booking.travel_date, 'Mon YYYY'),
        func.date_trunc('month', Booking.travel_date)
    ).order_by(
        func.date_trunc('month', Booking.travel_date)
    ).all()

    # 2. Bookings by status
    status_data = db.query(
        Booking.status,
        func.count(Booking.id).label('count')
    ).group_by(Booking.status).all()

    # 3. Local vs International bookings
    type_data = db.query(
        TravelPackage.type,
        func.count(Booking.id).label('count'),
        func.sum(Booking.total_amount).label('revenue')
    ).join(
        Booking, Booking.package_id == TravelPackage.id
    ).group_by(TravelPackage.type).all()

    # 4. Top 5 packages by booking count
    top_packages = db.query(
        TravelPackage.name,
        func.count(Booking.id).label('bookings'),
        func.sum(Booking.total_amount).label('revenue')
    ).join(
        Booking, Booking.package_id == TravelPackage.id
    ).group_by(
        TravelPackage.name
    ).order_by(
        func.count(Booking.id).desc()
    ).limit(5).all()

    return {
        "monthly_revenue": [
            {
                "month":    r.month,
                "revenue":  float(r.revenue or 0),
                "bookings": r.bookings
            }
            for r in monthly_data
        ],
        "status_breakdown": [
            {
                "status": r.status,
                "count":  r.count
            }
            for r in status_data
        ],
        "type_breakdown": [
            {
                "type":    r.type,
                "count":   r.count,
                "revenue": float(r.revenue or 0)
            }
            for r in type_data
        ],
        "top_packages": [
            {
                "name":     r.name,
                "bookings": r.bookings,
                "revenue":  float(r.revenue or 0)
            }
            for r in top_packages
        ]
    }
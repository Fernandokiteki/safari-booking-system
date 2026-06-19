from pydantic import BaseModel
from app.schemas.booking import BookingResponse
from typing import List

class DashboardStats(BaseModel):
    total_bookings:  int
    total_clients:   int
    total_packages:  int
    total_revenue:   float
    recent_bookings: List[BookingResponse]

    class Config:
        from_attributes = True
from sqlalchemy import Column, Integer, String, Boolean, Numeric, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class TravelPackage(Base):
    __tablename__ = "travel_packages"

    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String(150), nullable=False)
    destination  = Column(String(150), nullable=False)
    type         = Column(String(20),  nullable=False)  # 'local' or 'international'
    duration_days= Column(Integer,     nullable=False)
    price_kes    = Column(Numeric(10, 2), nullable=False)  # 10 digits, 2 decimal places
    is_available = Column(Boolean, default=True, nullable=False)
    description  = Column(Text, nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
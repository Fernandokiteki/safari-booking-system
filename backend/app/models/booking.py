from sqlalchemy import Column, Integer, String, Numeric, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id            = Column(Integer, primary_key=True, index=True)
    client_id     = Column(Integer, ForeignKey("clients.id"),         nullable=False)
    package_id    = Column(Integer, ForeignKey("travel_packages.id"), nullable=False)
    status        = Column(String(20), default="pending",             nullable=False)
    travel_date   = Column(Date,                                       nullable=False)
    num_travelers = Column(Integer, default=1,                         nullable=False)
    total_amount  = Column(Numeric(12, 2),                             nullable=False)
    notes         = Column(Text, nullable=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships — lets us access booking.client.full_name directly
    client  = relationship("Client",        backref="bookings")
    package = relationship("TravelPackage", backref="bookings")
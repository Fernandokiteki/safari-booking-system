from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Client(Base):
    # This is the actual table name in PostgreSQL
    __tablename__ = "clients"

    id          = Column(Integer, primary_key=True, index=True)
    full_name   = Column(String(100), nullable=False)
    email       = Column(String(100), unique=True, nullable=False, index=True)
    phone       = Column(String(20), nullable=False)
    nationality = Column(String(60), nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
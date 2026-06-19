from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.booking import Booking
from app.models.client import Client
from app.models.packages import TravelPackage
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# GET /bookings — all bookings with client and package data
@router.get("/", response_model=List[BookingResponse])
def get_all_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).options(
        joinedload(Booking.client),   # fetch client in same query
        joinedload(Booking.package)   # fetch package in same query
    ).order_by(Booking.created_at.desc()).all()

# GET /bookings/1 — single booking
@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).options(
        joinedload(Booking.client),
        joinedload(Booking.package)
    ).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

# POST /bookings — create booking
@router.post("/", response_model=BookingResponse, status_code=201)
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    # Verify client exists
    client = db.query(Client).filter(Client.id == data.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Verify package exists AND is available — checked in one query
    package = db.query(TravelPackage).filter(
        TravelPackage.id == data.package_id,
        TravelPackage.is_available == True    # ✅ SQL expression used as filter
    ).first()
    if not package:
        raise HTTPException(
            status_code=400,
            detail="Package not found or is not available for booking"
        )

    booking = Booking(**data.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return db.query(Booking).options(
        joinedload(Booking.client),
        joinedload(Booking.package)
    ).filter(Booking.id == booking.id).first()

# PUT /bookings/1 — update booking
@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(booking_id: int, data: BookingUpdate, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(booking, field, value)

    db.commit()
    return db.query(Booking).options(
        joinedload(Booking.client),
        joinedload(Booking.package)
    ).filter(Booking.id == booking_id).first()

# DELETE /bookings/1
@router.delete("/{booking_id}", status_code=204)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
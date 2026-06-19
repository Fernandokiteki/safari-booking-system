from pydantic import BaseModel, field_validator
from datetime import date, datetime
from typing import Optional

# Nested schemas — used inside BookingResponse
class ClientBrief(BaseModel):
    id:        int
    full_name: str
    class Config:
        from_attributes = True

class PackageBrief(BaseModel):
    id:          int
    name:        str
    destination: str
    class Config:
        from_attributes = True

# What we accept when CREATING a booking
class BookingCreate(BaseModel):
    client_id:     int
    package_id:    int
    travel_date:   date
    num_travelers: int   = 1
    total_amount:  float
    notes:         Optional[str] = None

    @field_validator('num_travelers')
    @classmethod
    def travelers_must_be_positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError('num_travelers must be at least 1')
        return v

    @field_validator('travel_date')
    @classmethod
    def date_must_be_future(cls, v: date) -> date:
        if v < date.today():
            raise ValueError('travel_date must be today or in the future')
        return v

# What we accept when UPDATING a booking
class BookingUpdate(BaseModel):
    status:        Optional[str]   = None
    travel_date:   Optional[date]  = None
    num_travelers: Optional[int]   = None
    total_amount:  Optional[float] = None
    notes:         Optional[str]   = None

# What we RETURN — includes nested client and package info
class BookingResponse(BaseModel):
    id:            int
    client_id:     int
    package_id:    int
    status:        str
    travel_date:   date
    num_travelers: int
    total_amount:  float
    notes:         Optional[str]
    created_at:    datetime
    client:        ClientBrief    # ← nested object from relationship
    package:       PackageBrief   # ← nested object from relationship

    class Config:
        from_attributes = True
from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional

# Used when CREATING a package
class PackageCreate(BaseModel):
    name:          str
    destination:   str
    type:          str
    duration_days: int
    price_kes:     float
    is_available:  bool = True
    description:   Optional[str] = None

    # Validate that type is only 'local' or 'international'
    @field_validator('type')
    @classmethod
    def type_must_be_valid(cls, v: str) -> str:
        if v not in ('local', 'international'):
            raise ValueError("type must be 'local' or 'international'")
        return v

    @field_validator('duration_days')
    @classmethod
    def duration_must_be_positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError('duration_days must be at least 1')
        return v

    @field_validator('price_kes')
    @classmethod
    def price_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError('price_kes must be greater than 0')
        return v

# Used when UPDATING a package — all fields are optional
# This is the PATCH pattern: only send what you want to change
class PackageUpdate(BaseModel):
    name:          Optional[str]   = None
    destination:   Optional[str]   = None
    type:          Optional[str]   = None
    duration_days: Optional[int]   = None
    price_kes:     Optional[float] = None
    is_available:  Optional[bool]  = None
    description:   Optional[str]   = None

# Used when RETURNING a package to the frontend
class PackageResponse(BaseModel):
    id:            int
    name:          str
    destination:   str
    type:          str
    duration_days: int
    price_kes:     float
    is_available:  bool
    description:   Optional[str]
    created_at:    datetime

    class Config:
        from_attributes = True
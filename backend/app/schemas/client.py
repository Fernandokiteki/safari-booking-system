from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# What we ACCEPT when creating a client (input)
class ClientCreate(BaseModel):
    full_name: str
    email: EmailStr      # Pydantic validates this is a real email format
    phone: str
    nationality: str

# What we RETURN when reading a client (output - includes id and created_at)
class ClientResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    nationality: str
    created_at: datetime

    class Config:
        from_attributes = True  # allows converting SQLAlchemy model → Pydantic schema
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientResponse
from typing import List

router = APIRouter(
    prefix="/clients",   # all routes here start with /clients
    tags=["Clients"]     # groups them in the API docs
)

# GET /clients — fetch all clients
@router.get("/", response_model=List[ClientResponse])
def get_all_clients(db: Session = Depends(get_db)):
    clients = db.query(Client).all()
    return clients

# GET /clients/1 — fetch one client by id
@router.get("/{client_id}", response_model=ClientResponse)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

# POST /clients — create a new client
@router.post("/", response_model=ClientResponse, status_code=201)
def create_client(data: ClientCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(Client).filter(Client.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_client = Client(**data.model_dump())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client

# DELETE /clients/1 — delete a client
@router.delete("/{client_id}", status_code=204)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
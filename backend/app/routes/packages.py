from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.packages import TravelPackage
from app.schemas.package import PackageCreate, PackageUpdate, PackageResponse

router = APIRouter(
    prefix="/packages",
    tags=["Packages"]
)

# GET /packages — all packages
@router.get("/", response_model=List[PackageResponse])
def get_all_packages(db: Session = Depends(get_db)):
    return db.query(TravelPackage).all()

# GET /packages/1 — single package
@router.get("/{package_id}", response_model=PackageResponse)
def get_package(package_id: int, db: Session = Depends(get_db)):
    package = db.query(TravelPackage).filter(TravelPackage.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package

# POST /packages — create package
@router.post("/", response_model=PackageResponse, status_code=201)
def create_package(data: PackageCreate, db: Session = Depends(get_db)):
    package = TravelPackage(**data.model_dump())
    db.add(package)
    db.commit()
    db.refresh(package)
    return package

# PUT /packages/1 — update package
@router.put("/{package_id}", response_model=PackageResponse)
def update_package(package_id: int, data: PackageUpdate, db: Session = Depends(get_db)):
    package = db.query(TravelPackage).filter(TravelPackage.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    # Only update fields that were actually sent (not None)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(package, field, value)

    db.commit()
    db.refresh(package)
    return package

# DELETE /packages/1 — delete package
@router.delete("/{package_id}", status_code=204)
def delete_package(package_id: int, db: Session = Depends(get_db)):
    package = db.query(TravelPackage).filter(TravelPackage.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    db.delete(package)
    db.commit()
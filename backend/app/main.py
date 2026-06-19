from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import clients, packages, bookings, dashboard, reports, auth


# Create all database tables automatically from our models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Safari Booking System API",
    description="Backend API for Safari Travels Kenya",
    version="1.0.0"
)

# CORS — allows our React frontend (localhost:5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173",],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Register the clients routes
app.include_router(auth.router,      prefix="/api/v1") 
app.include_router(clients.router, prefix="/api/v1")
app.include_router(packages.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(reports.router,   prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Safari Booking API is running", "status": "ok"}




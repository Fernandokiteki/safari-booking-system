from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load variables from .env file
load_dotenv()

# Read the database URL from the environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set. "
        "Please check your .env file."
    )

# Create the database engine (the connection pool)
engine = create_engine(DATABASE_URL)

# Each request to our API gets its own database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All our models will inherit from this Base class
Base = declarative_base()

# Dependency — FastAPI will call this to get a DB session per request
def get_db():
    db = SessionLocal()
    try:
        yield db       # give the session to the route handler
    finally:
        db.close()     # always close it when done, even if an error occurs
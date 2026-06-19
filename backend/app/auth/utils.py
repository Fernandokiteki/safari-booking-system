import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY         = os.getenv("SECRET_KEY", "fallback-secret-change-in-production")
ALGORITHM          = "HS256"
TOKEN_EXPIRE_HOURS = 8

def hash_password(password: str) -> str:
    # encode converts string → bytes, bcrypt works on bytes
    password_bytes = password.encode('utf-8')
    salt           = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    plain_bytes  = plain.encode('utf-8')
    hashed_bytes = hashed.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

def create_access_token(user_id: int, email: str) -> str:
    payload = {
        "sub": email,
        "id":  user_id,
        "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return {}
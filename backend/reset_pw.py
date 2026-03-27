import bcrypt
from db import SessionLocal
from models import User

def reset():
    db = SessionLocal()
    user = db.query(User).filter(User.username == "admin").first()
    
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(b"pnb_password_2026", salt).decode('utf-8')
    
    if user:
        user.password = hashed_pw
        print("[RESET] Updated existing admin password.")
    else:
        db.add(User(
            username="admin",
            password=hashed_pw,
            role="admin",
            email="admin@pnb.bank.in"
        ))
        print("[RESET] Created new admin user.")
    
    db.commit()
    db.close()
    print("[RESET] Password is now: pnb_password_2026")

if __name__ == "__main__":
    reset()

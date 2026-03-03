import models
from database import SessionLocal
import auth

def reset_admin():
    db = SessionLocal()
    admin = db.query(models.User).filter_by(username="admin").first()
    if not admin:
        print("创建 admin 用户...")
        admin = models.User(
            username="admin",
            hashed_password=auth.get_password_hash("admin123"),
            role=models.UserRole.ADMIN,
            display_name="超级管理员"
        )
        db.add(admin)
        db.commit()
    print("Admin 就绪。")
    db.close()

if __name__ == "__main__":
    reset_admin()

import os
import shutil
from sqlalchemy.orm import Session
from database import SessionLocal
import models

def sync_local_scripts():
    db = SessionLocal()
    b_dir = os.path.dirname(os.path.abspath(__file__))
    bash_dir = os.path.join(b_dir, "..", "bash")
    upload_dir = os.path.join(b_dir, "uploads")
    
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    admin = db.query(models.User).filter_by(username="admin").first()
    if not admin:
        print("Admin user not found, run reset_admin.py first.")
        return

    if os.path.exists(bash_dir):
        files = os.listdir(bash_dir)
        for f in files:
            if f.endswith('.ps1'):
                src = os.path.join(bash_dir, f)
                dst = os.path.join(upload_dir, f)
                shutil.copy2(src, dst)
                
                existing = db.query(models.Script).filter_by(title=f).first()
                if not existing:
                    new_s = models.Script(
                        title=f,
                        description=f"本地物理目录同步脚本: {f}",
                        version="1.0.0",
                        category="其他",
                        file_path=f"uploads/{f}",
                        status=models.ScriptStatus.APPROVED,
                        author_id=admin.id
                    )
                    db.add(new_s)
        db.commit()
    print("同步完成。")
    db.close()

if __name__ == "__main__":
    sync_local_scripts()

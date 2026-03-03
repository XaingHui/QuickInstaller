from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routers import scripts, users, admin
import models
from auth import get_password_hash
import os
import shutil

# 移除顶层 create_all，由 main 块或迁移工具控制
# Base.metadata.create_all(bind=engine)

def run_migrations():
    from alembic.config import Config
    from alembic import command
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

def init_db():
    db = SessionLocal()
    try:
        if not db.query(models.User).filter_by(username="admin").first():
            admin_user = models.User(
                username="admin", 
                display_name="超级管理员",
                hashed_password=get_password_hash("admin123"),
                role=models.UserRole.ADMIN
            )
            db.add(admin_user)
            db.commit()
            
        # 自动关联扫描 teammates 的 bash/ 目录并作为已审核脚本入库
        target_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'bash')
        upload_dir = "uploads"
        
        if os.path.exists(target_dir):
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
                
            for filename in os.listdir(target_dir):
                if filename.endswith(".ps1") or filename.endswith(".sh"):
                    source_path = os.path.join(target_dir, filename)
                    dest_path = os.path.join(upload_dir, filename)
                    
                    # 避免重复插入
                    script_title = filename.replace(".ps1", "").replace(".sh", "").replace("_", " ").title()
                    existing = db.query(models.Script).filter_by(title=script_title).first()
                    
                    if not existing:
                        # 拷贝文件到 uploads 目录被前端下载
                        shutil.copy2(source_path, dest_path)

                        # 分类预测
                        cat = "其他"
                        low_name = filename.lower()
                        if "claude" in low_name or "claw" in low_name:
                            cat = "AI工具"
                        elif "python" in low_name or "anaconda" in low_name:
                            cat = "Python相关"
                        
                        # 强行设为 APPROVED 状态
                        new_script = models.Script(
                            title=script_title,
                            description=f"Auto-imported script created by teammates from bash/{filename}",
                            version="1.0.0",
                            category=cat,
                            file_path=dest_path,
                            author_id=1,
                            status=models.ScriptStatus.APPROVED
                        )
                        db.add(new_script)
            db.commit()
            
    finally:
        db.close()

app = FastAPI(
    title="QuickInstaller App Store API",
    description="Backend API for managing script reviews and downloads",
    version="1.0.0"
)

# 允许跨域，方便前端 VITE 调试和生产访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册各个模块路由
app.include_router(scripts.router, prefix="/api/scripts", tags=["scripts"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to QuickInstaller API"}

if __name__ == "__main__":
    # 自动运行 Alembic 数据库迁移 (生产级同步方式)
    try:
        print("正在检查数据库迁移...")
        run_migrations()
    except Exception as e:
        print(f"Alembic 自动迁移失败 (可能是连接问题)，尝试基础初始化: {e}")
        Base.metadata.create_all(bind=engine)
        
    init_db()
    
    import uvicorn
    # 使用 reload=True 方便本地开发，生产环境可关闭
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

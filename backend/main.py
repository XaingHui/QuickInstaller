from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import scripts, users, admin

# 创建所有数据库表
Base.metadata.create_all(bind=engine)

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

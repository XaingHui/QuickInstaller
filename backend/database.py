from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./quickinstaller.db"

# connect_args={"check_same_thread": False} 是 SQLite 特有的
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 数据库依赖，供路由请求时使用
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
import datetime
from database import Base

class ScriptStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # 一个用户可以上传多个脚本
    scripts = relationship("Script", back_populates="author")

class Script(Base):
    __tablename__ = "scripts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    version = Column(String, default="1.0.0")
    icon_url = Column(String, nullable=True)     # 在首页展示用的图标
    file_path = Column(String, nullable=False)   # 脚本存放位置
    status = Column(Enum(ScriptStatus), default=ScriptStatus.PENDING)
    downloads = Column(Integer, default=0)       # 统计下载量
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="scripts")

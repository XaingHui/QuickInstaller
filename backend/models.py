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
    DEVELOPER = "developer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    avatar_url = Column(String, nullable=True)   # 用户头像
    display_name = Column(String, nullable=True) # 昵称
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    scripts = relationship("Script", back_populates="author")

class Script(Base):
    __tablename__ = "scripts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    version = Column(String, default="1.0.0")
    category = Column(String, default="其他") # 新增：项目分类 (AI工具, Python库等)
    icon_url = Column(String, nullable=True)
    file_path = Column(String, nullable=False)
    readme_path = Column(String, nullable=True) # 新增：README 说明文档路径
    status = Column(Enum(ScriptStatus), default=ScriptStatus.PENDING)
    downloads = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="scripts")

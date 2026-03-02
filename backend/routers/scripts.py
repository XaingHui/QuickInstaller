from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import os
import shutil

from database import get_db
import models

router = APIRouter()
UPLOAD_DIR = "uploads"

# 确保上传目录存在
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/")
def get_scripts(db: Session = Depends(get_db)):
    # 仅展示已通过审核的脚本
    scripts = db.query(models.Script).filter(models.Script.status == models.ScriptStatus.APPROVED).all()
    return scripts

@router.get("/{script_id}")
def get_script_detail(script_id: int, db: Session = Depends(get_db)):
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    return script

@router.post("/upload")
def upload_script(title: str, description: str, version: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 实际上这里应该有 User 鉴权获取当前用户，方便演示暂时假定 author_id=1
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    new_script = models.Script(
        title=title,
        description=description,
        version=version,
        file_path=file_location,
        author_id=1  # 未来: 接入真正鉴权系统
    )
    db.add(new_script)
    db.commit()
    db.refresh(new_script)
    return {"message": "Script uploaded successfully. Waiting for review.", "script_id": new_script.id}

@router.get("/download/{script_id}")
def download_script(script_id: int, db: Session = Depends(get_db)):
    from fastapi.responses import FileResponse
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    
    if not script or not os.path.exists(script.file_path):
        raise HTTPException(status_code=404, detail="Script not found")
        
    # 下载量统计
    script.downloads += 1
    db.commit()
    
    return FileResponse(path=script.file_path, filename=os.path.basename(script.file_path))

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import models


from backend.database import get_db

router = APIRouter()
UPLOAD_DIR = "uploads"

# 确保上传目录存在
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/")
def get_scripts(db: Session = Depends(database.get_db)):
    # 仅展示已通过审核的脚本
    scripts = db.query(models.Script).filter(models.Script.status == models.ScriptStatus.APPROVED).all()
    return scripts

@router.get("/{script_id}")
def get_script_detail(script_id: int, db: Session = Depends(database.get_db)):
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    return script

@router.post("/upload")
def upload_script(
    title: str = Form(...), 
    description: str = Form(""), 
    version: str = Form("1.0.0"), 
    category: str = Form("其他"),
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    new_script = models.Script(
        title=title,
        description=description,
        version=version,
        category=category,
        file_path=file_location,
        author_id=current_user.id  
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

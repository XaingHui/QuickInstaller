from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


import models
import database

import auth

router = APIRouter()

# 获取等待审核的脚本
@router.get("/pending")
def get_pending_scripts(db: Session = Depends(database.get_db), current_admin: models.User = Depends(auth.get_current_admin)):
    # 未来: 增加鉴权依赖，仅 Admin 可访问
    pending_scripts = db.query(models.Script).filter(models.Script.status == models.ScriptStatus.PENDING).all()
    return pending_scripts

# 审核通过
@router.post("/{script_id}/approve")
def approve_script(script_id: int, db: Session = Depends(database.get_db), current_admin: models.User = Depends(auth.get_current_admin)):
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
        
    script.status = models.ScriptStatus.APPROVED
    db.commit()
    return {"message": "Script approved"}

# 审核驳回
@router.post("/{script_id}/reject")
def reject_script(script_id: int, db: Session = Depends(database.get_db), current_admin: models.User = Depends(auth.get_current_admin)):
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
        
    script.status = models.ScriptStatus.REJECTED
    db.commit()
    return {"message": "Script rejected"}

# 删除脚本（同时清除物理文件）
@router.delete("/{script_id}")
def delete_script(script_id: int, db: Session = Depends(database.get_db), current_admin: models.User = Depends(auth.get_current_admin)):
    import os
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    
    # 删除物理文件
    if script.file_path and os.path.exists(script.file_path):
        os.remove(script.file_path)
    
    db.delete(script)
    db.commit()
    return {"message": "Script deleted"}

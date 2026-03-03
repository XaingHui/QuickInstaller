from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import database
import models
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
def approve_script(script_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
        
    script.status = models.ScriptStatus.APPROVED
    db.commit()
    return {"message": "Script approved"}

# 审核驳回
@router.post("/{script_id}/reject")
def reject_script(script_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
        
    script.status = models.ScriptStatus.REJECTED
    db.commit()
    return {"message": "Script rejected"}

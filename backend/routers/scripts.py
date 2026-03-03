from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List
import os
import shutil

import models
import auth
import database

import chardet

router = APIRouter()
UPLOAD_DIR = "uploads"

# 确保上传目录存在
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def _process_and_fix_ps1_encoding(file_path: str):
    """
    自动检测 .ps1 脚本编码，将其转换为 UTF-8 with BOM，
    并注入环境自适应头，解决乱码问题。
    """
    if not file_path.endswith(".ps1"):
        return

    # 1. 检测原始编码
    with open(file_path, "rb") as f:
        raw_data = f.read()
    
    detector = chardet.detect(raw_data)
    encoding = detector['encoding'] or 'utf-8'
    
    # 2. 读取并清理旧的自适应头（防止重复注入）
    try:
        content = raw_data.decode(encoding)
    except Exception:
        content = raw_data.decode('latin-1') # 兜底方案

    adaptive_header = (
        "# 设置控制台输出编码为 UTF-8，解决中文乱码\n"
        "if ($PSVersionTable.PSVersion.Major -ge 5) {\n"
        "    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n"
        "}\n"
    )

    # 如果已经有类似的头，不重复添加
    if "# 设置控制台输出编码" not in content:
        content = adaptive_header + content

    # 3. 以 UTF-8 with BOM 格式强制写回 (utf-8-sig)
    with open(file_path, "w", encoding="utf-8-sig") as f:
        f.write(content)
    print(f"-> 脚本编码已自动净化 & 加固: {file_path}")

from pydantic import BaseModel
from typing import Optional

class ScriptUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    category: Optional[str] = None

@router.put("/{script_id}")
def update_script(
    script_id: int,
    update_data: ScriptUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="脚本不存在")

    is_admin = current_user.role == models.UserRole.ADMIN
    is_owner = script.author_id == current_user.id

    if not is_admin and not is_owner:
        raise HTTPException(status_code=403, detail="权限不足：只能修改自己的脚本")

    # 更新字段
    if update_data.title is not None:
        script.title = update_data.title
    if update_data.description is not None:
        script.description = update_data.description
    if update_data.version is not None:
        script.version = update_data.version
    if update_data.category is not None:
        script.category = update_data.category

    # 权限逻辑：开发者编辑后需重新审核，管理员编辑保持上线
    if not is_admin:
        script.status = models.ScriptStatus.PENDING

    db.commit()
    db.refresh(script)
    return {"message": "修改成功", "needs_review": not is_admin}

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
    readme: Optional[UploadFile] = File(None), # 可选的 README
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # 保存主脚本
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # 编码净化
    _process_and_fix_ps1_encoding(file_location)

    # 保存 README (如果存在)
    readme_location = None
    if readme:
        readme_name = f"readme_{file.filename}.md"
        readme_location = f"{UPLOAD_DIR}/{readme_name}"
        with open(readme_location, "wb+") as readme_obj:
            shutil.copyfileobj(readme.file, readme_obj)

    new_script = models.Script(
        title=title,
        description=description,
        version=version,
        category=category,
        file_path=file_location,
        readme_path=readme_location,
        author_id=current_user.id  
    )
    db.add(new_script)
    db.commit()
    db.refresh(new_script)
    return {"message": "Script uploaded successfully.", "script_id": new_script.id}

@router.get("/{script_id}/preview")
def get_script_preview(script_id: int, db: Session = Depends(database.get_db)):
    """获取脚本前 200 行内容用于预览"""
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script or not os.path.exists(script.file_path):
        raise HTTPException(status_code=404, detail="脚本不存在")
    
    try:
        with open(script.file_path, "r", encoding="utf-8-sig") as f:
            lines = []
            for i in range(200):
                line = f.readline()
                if not line: break
                lines.append(line)
            return {"content": "".join(lines), "is_truncated": i == 199}
    except Exception as e:
        return {"content": f"无法读取预览内容: {str(e)}", "is_truncated": False}

@router.get("/{script_id}/readme")
def get_script_readme(script_id: int, db: Session = Depends(database.get_db)):
    """获取 README 内容"""
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    if not script or not script.readme_path or not os.path.exists(script.readme_path):
        return {"content": ""}
    
    try:
        with open(script.readme_path, "r", encoding="utf-8") as f:
            return {"content": f.read()}
    except Exception as e:
        return {"content": f"无法读取 README: {str(e)}"}

@router.get("/download/{script_id}")
def download_script(script_id: int, db: Session = Depends(database.get_db)):
    from fastapi.responses import FileResponse
    script = db.query(models.Script).filter(models.Script.id == script_id).first()
    
    if not script or not os.path.exists(script.file_path):
        raise HTTPException(status_code=404, detail="Script not found")
        
    script.downloads += 1
    db.commit()
    
    return FileResponse(path=script.file_path, filename=os.path.basename(script.file_path))

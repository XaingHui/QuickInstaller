from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
def read_users_me():
    # 临时占位，之后可以接 JWT
    return {"username": "test_user", "role": "admin"}

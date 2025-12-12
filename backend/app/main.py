from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers.auth_router import router as auth_router
from app.routers.teacher_router import router as teacher
from fastapi.responses import JSONResponse
from app.services.auth_service import AuthError
from app.core.logging import setup_logging

setup_logging()

app = FastAPI()

@app.exception_handler(AuthError)
async def auth_error_handler(request, exc: AuthError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(teacher)
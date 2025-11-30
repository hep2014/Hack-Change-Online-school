import os, sys
print("=== DEBUG START ===")
print("cwd:", os.getcwd())
print("sys.path:", sys.path)
print("file:", __file__)
print("=== DEBUG END ===")
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers.auth_router import router as auth_router
from app.routers.teacher import router as teacher

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # временно
    allow_credentials=True,
    allow_methods=["*"],  # прям обязательно
    allow_headers=["*"],  # тоже
)
app.include_router(auth_router)
app.include_router(teacher)
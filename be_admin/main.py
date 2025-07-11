from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize any resources needed at startup
    print("🚀 App is starting up...")
    
    yield  # App continues running

app = FastAPI(lifespan=lifespan)

# ✅ Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

# ✅ Routers
app.include_router(auth.router, prefix="/auth")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
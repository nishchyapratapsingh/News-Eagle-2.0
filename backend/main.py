from fastapi import FastAPI
from routes import predict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Fake News Detection API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Fake News Detection API"}

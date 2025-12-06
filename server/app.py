from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api import auth_router, dashboard_router, quiz_router

app = FastAPI(
    title="CognitoMD API",
    swagger_ui_init_oauth={
        "clientId": None,
        "clientSecret": None,
    },
    debug=True,
)
origins = ["http://localhost:3000", "http://localhost:3001", "*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, tags=["Authentication"])
app.include_router(dashboard_router.router, tags=['Dashboard'])
app.include_router(quiz_router.router, tags=["Quiz"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the CognitoMD API"}

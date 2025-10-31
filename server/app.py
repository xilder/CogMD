from api import auth_router, quiz_router
from fastapi import FastAPI

app = FastAPI(
    title="CognitoMD API",
    swagger_ui_init_oauth={
        "clientId": None,
        "clientSecret": None,
    },
    debug=True,
)

app.include_router(auth_router.router, tags=["Authentication"])
# app.include_router(dashboard_router.router, prefix="/dashboard", tags=)
app.include_router(quiz_router.router, tags=["Quiz"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the CognitoMD API"}

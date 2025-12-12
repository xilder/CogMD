import logging.config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from dotenv import load_dotenv
from server.api import auth_router, dashboard_router, quiz_router
import os

load_dotenv()

# logging.config.fileConfig("./server/logging.ini", disable_existing_loggers=False)
# logger = logging.getLogger("app") 

app = FastAPI(
    title="CognitoMD API",
    swagger_ui_init_oauth={
        "clientId": None,
        "clientSecret": None,
    },
    debug=True,
)
origins = ["http://localhost:3000", os.environ.get("ORIGIN_URL", "")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.middleware("http")
# async def log_requests(request, call_next):
#     logger.info(f"REQUEST {request.method} {request.url}")
#     try:
#         response = await call_next(request)
#         logger.info(f"RESPONSE {response.status_code} for {request.url}")
#         return response
#     except Exception as e:
#         logger.exception(f"Unhandled error: {e}")
#         raise

app.include_router(auth_router.router, tags=["Authentication"])
app.include_router(dashboard_router.router, tags=['Dashboard'])
app.include_router(quiz_router.router, tags=["Quiz"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the CognitoMD API"}

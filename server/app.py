import logging
import logging.config
import os

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api import auth_router, dashboard_router, quiz_router, telegram_router
from server.db.db import get_supabase_client
from server.models.schemas import ContactUsFormat

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
app.include_router(dashboard_router.router, tags=["Dashboard"])
app.include_router(quiz_router.router, tags=["Quiz"])
app.include_router(telegram_router.router, tags=["Telegram"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the CognitoMD API"}


@app.post("/contact-us")
async def contact_us(
    contact_data: ContactUsFormat, supabase=Depends(get_supabase_client)
):
    """Endpoint to handle 'Contact Us' form submissions."""
    try:
        # Insert the contact data into the 'contact_messages' table
        await supabase.table("contact_messages").insert(
                {
                    "full_name": contact_data.full_name,
                    "email": contact_data.email,
                    "message": contact_data.message,
                }
            ).execute()

        return None
    except Exception as e:
        logging.exception(f"Unhandled error in contact_us endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later.",
        )

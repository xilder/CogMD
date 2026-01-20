import logging
import logging.config
import os
import uuid
from typing import Annotated

import httpx
import requests
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from supabase import AsyncClient

from server.api import (
    auth_router,
    dashboard_router,
    quiz_router,
    telegram_router,
)
from server.db.db import get_supabase_client
from server.models.schemas import ContactUsFormat, QuestionForImageParams

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
origins = [os.environ.get("ORIGIN_URL", "")]
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


@app.get("/get-image")
async def get_image(
    supabase: Annotated[AsyncClient, Depends(get_supabase_client)],
    question_for_image_params: QuestionForImageParams | None = None,
):
    # 1. Construct URL
    origin = os.environ.get("ORIGIN_URL", "localhost:3000")
    image_url = f'{origin}/api/og'

    try:
        # 2. Get Data from Supabase
        rpc_params = {
            "p_tag_id": question_for_image_params.tag_id if question_for_image_params else None,
            "p_question_id": question_for_image_params.question_id if question_for_image_params else None,
        }
        
        response = await supabase.rpc("get_question_for_image", rpc_params).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Could not retrieve session result.")
            
        data = response.data[0]
        
        # 3. Prepare Params
        # Ensure your Next.js API handles these keys specifically
        params = {
            "question_text": data.get("question_text", ""),
            "id": str(data.get("id", "")),
            "a": data["options"][0]["option_text"],
            "b": data["options"][1]["option_text"],
            "c": data["options"][2]["option_text"],
            "d": data["options"][3]["option_text"],
            "e": data["options"][4]["option_text"],
            "specialty": ",".join(data["specialty"]) if data["specialty"] else "",
            "difficulty": data["difficulty"],
            }

        download_filename = f"{data.get('id', 'image')}.png" 
        image_bytes = await fetch_og_image_async(image_url, params)

        return Response(
            content=image_bytes,
            media_type="image/png", 
            headers={
                "Content-Disposition": f'attachment; filename="{download_filename}"'
            },
        )

    except httpx.HTTPStatusError as e:
        print(e)
        raise HTTPException(status_code=502, detail=f"Failed to generate image from upstream: ({str(e)})")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


async def fetch_og_image_async(url: str, params: dict) -> bytes:
    """
    Fetches image bytes asynchronously without blocking the server.
    """
    async with httpx.AsyncClient() as client:        
        response = await client.get(url, params=params, timeout=10.0)
        
        response.raise_for_status()
        
        return response.content
# app/services/srs_service.py
from datetime import datetime, timedelta, timezone
from typing import Any


def calculate_srs(
    quality: str, repetitions: int, ease_factor: float, interval: int
) -> dict[str, Any]:
    """
    A simplified placeholder for the SM-2 algorithm.
    'quality' can be 'forgot', 'good', 'easy'.
    """
    if quality == "forgot":
        repetitions = 0
        interval = 1
        ease_factor = max(1.3, ease_factor - 0.2)
    else:
        repetitions += 1
        if repetitions == 1:
            interval = 1
        elif repetitions == 2:
            interval = 6
        else:
            interval = round(interval * ease_factor)

        if quality == "easy":
            ease_factor += 0.15

    # Clamp ease_factor
    ease_factor = max(1.3, ease_factor)

    next_review_at = datetime.now(timezone.utc) + timedelta(days=interval)

    return {
        "repetitions": repetitions,
        "ease_factor": ease_factor,
        "current_interval": interval,
        "next_review_at": next_review_at.isoformat(),
        "last_reviewed_at": datetime.now(timezone.utc).isoformat(),
        "status": "learning",
    }

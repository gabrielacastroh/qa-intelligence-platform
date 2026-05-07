from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.playwright.test_runner import run_test

router = APIRouter()


class TestRequest(BaseModel):
    url: str


def _playwright_browser_missing_message(message: str) -> bool:
    normalized_message = message.lower()
    return (
        "executable doesn't exist" in normalized_message
        or "playwright install" in normalized_message
        or "browserType.launch" in normalized_message and "executable" in normalized_message
    )


@router.post("/run-test")
async def execute_test(request: TestRequest):
    try:
        return await run_test(request.url)
    except Exception as exc:
        message = str(exc)
        if _playwright_browser_missing_message(message):
            raise HTTPException(
                status_code=503,
                detail=(
                    "Playwright: faltan los binarios del navegador. "
                    "En la carpeta backend ejecuta: playwright install chromium"
                ),
            ) from exc
        raise HTTPException(status_code=500, detail=message) from exc

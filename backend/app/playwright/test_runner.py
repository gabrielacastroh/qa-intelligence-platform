from playwright.async_api import async_playwright
import uuid
from pathlib import Path
import time
from app.ai.groq_service import generate_technical_review

BACKEND_ROOT = Path(__file__).resolve().parents[2]
SCREENSHOTS_DIR = BACKEND_ROOT / "screenshots"


async def run_test(url: str):
    screenshot_name = f"{uuid.uuid4()}.png"

    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    screenshot_path = SCREENSHOTS_DIR / screenshot_name
    rel_path = f"screenshots/{screenshot_name}"

    console_logs = []
    start_time = time.time()

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)

        try:
            page = await browser.new_page()

            page.on(
                "console",
                lambda msg: console_logs.append(
                    {"type": msg.type, "message": msg.text}
                ),
            )

            response = await page.goto(
                url,
                wait_until="networkidle",
                timeout=30000,
            )

            status_code = response.status if response else 500

            title = await page.title()

            await page.add_script_tag(
                url="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js",
            )
            accessibility_results = await page.evaluate("""
                async () => {
                    return await axe.run();
                }
                """)
            violations = []

            for violation in accessibility_results["violations"]:
                violations.append({
                    "id": violation["id"],
                    "impact": violation.get("impact"),
                    "description": violation["description"],
                    "help": violation["help"],
                    "nodes_affected": len(violation["nodes"]),
                })

            await page.screenshot(
                path=str(screenshot_path),
                full_page=True,
            )

            load_time = round(time.time() - start_time, 2)

            technical_review = await generate_technical_review({
                "status_code": status_code,
                "load_time": load_time,
                "console_logs_count": len(console_logs),
                "accessibility_issues": len(violations),
                "critical_accessibility_issues": [
                    violation["id"] for violation in violations
                ],
            })

            return {
                "success": True,
                "status_code": status_code,
                "title": title,
                "url": url,
                "load_time": load_time,
                "screenshot": rel_path,
                "console_logs": console_logs,
                "accessibility_violations": violations,
                "technical_review": technical_review,
            }

        except Exception as exc:
            return {
                "success": False,
                "error": str(exc),
                "url": url,
                "console_logs": console_logs,
            }

        finally:
            await browser.close()

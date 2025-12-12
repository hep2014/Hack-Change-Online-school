import httpx
import os
from pathlib import Path
from dotenv import load_dotenv
BASE_DIR = Path(__file__).resolve().parents[3]
ENV_PATH = BASE_DIR / ".env"
load_dotenv(ENV_PATH)
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

async def send_telegram_message(username: str, message: str):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            url,
            data={
                "chat_id": int(username),
                "text": message,
                "parse_mode": "HTML"
            }
        )

    if resp.status_code != 200:
        raise RuntimeError(f"Telegram API error: {resp.text}")

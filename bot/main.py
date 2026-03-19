import asyncio
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
import aiohttp
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    BOT_TOKEN: str = "YOUR_BOT_TOKEN_HERE" # User has to replace it
    API_URL: str = "http://localhost:8000"

settings = Settings()
bot = Bot(token=settings.BOT_TOKEN)
dp = Dispatcher()

# Simple user mapping (Telegram ID to System User ID)
# For production, this should read from DB.
USER_MAPPING = {
    # 123456789: "u1"
}

@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    await message.answer(f"Assalomu alaykum! Aqlli Nazorat tizimi botiga xush kelibsiz.\nSizning Telegram ID: {message.from_user.id}")

async def send_notification(user_id: str, text: str):
    """
    Called by backend to send message to user via bot.
    """
    # Inverse map to get Telegeram ID by user_id
    tg_id = None
    for tid, uid in USER_MAPPING.items():
        if uid == user_id:
            tg_id = tid
            break
            
    if tg_id:
        try:
            await bot.send_message(tg_id, text, parse_mode="Markdown")
        except Exception as e:
            print(f"Failed to send to {tg_id}: {e}")
    else:
        print(f"User {user_id} not connected to Telegram. Message: {text}")

async def poll_notifications():
    """Simulates a background worker polling for notifications from backend"""
    while True:
        await asyncio.sleep(5)
        # Note: In real app, consider using WebHooks, Redis PubSub or RabbitMQ for triggers.
        # This is a stub for the architecture.
        pass

async def main():
    print("Aqlli Nazorat Bot ishga tushdi...")
    asyncio.create_task(poll_notifications())
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

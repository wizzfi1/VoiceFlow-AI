import aiohttp
import asyncio
import json
import os

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
if not ASSEMBLYAI_API_KEY:
    raise RuntimeError("❌ ASSEMBLYAI_API_KEY is not set in environment variables")

async def handle_stream(websocket):
    url = "wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000"
    headers = {"Authorization": ASSEMBLYAI_API_KEY}

    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(url, headers=headers) as stream:
            async def send_audio():
                while True:
                    msg = await websocket.receive_bytes()
                    await stream.send_bytes(msg)

            async def receive_transcript():
                async for msg in stream:
                    if msg.type == aiohttp.WSMsgType.TEXT:
                        data = json.loads(msg.data)
                        if data.get("text"):
                            await websocket.send_text(data["text"])

            await asyncio.gather(send_audio(), receive_transcript())

import requests
import os.path
import json
from dotenv import load_dotenv

# BASE_DIR 설정
BASE_DIR = os.path.dirname(os.path.dirname(os.path.relpath("./")))
dotenv_path = os.path.join(BASE_DIR, '.env')

# .env 파일 로드
load_dotenv(dotenv_path)

# 환경 변수 가져오기
YOUR_CLIENT_ID = os.getenv("YOUR_CLIENT_ID")
YOUR_CLIENT_SECRET = os.getenv("YOUR_CLIENT_SECRET")


import asyncio
import json
import logging
import os
import tempfile
import time
from io import DEFAULT_BUFFER_SIZE

import vito_stt_client_pb2 as pb
import websockets
from pydub import AudioSegment
from requests import Session

API_BASE = "https://openapi.vito.ai"

BYTES_PER_SAMPLE = 2
CHUNK = 1024
FORMAT = pyaudio.paInt16 
CHANNELS = 1 # Only supports 1-Channel Input 
RATE = 8000
ENCODING = pb.DecoderConfig.AudioEncoding.LINEAR16

class MicrophoneStream:
    def __init__(self, rate, chunk_size):
        self.rate = rate
        self.chunk_size = chunk_size

    def __enter__(self):
        import pyaudio
        self.pyaudio = pyaudio.PyAudio()
        self.stream = self.pyaudio.open(format=pyaudio.paInt16,
                                        channels=1,
                                        rate=self.rate,
                                        input=True,
                                        frames_per_buffer=self.chunk_size)
        return self

    def __exit__(self, type, value, traceback):
        self.stream.stop_stream()
        self.stream.close()
        self.pyaudio.terminate()

    def generator(self):
        while True:
            data = self.stream.read(self.chunk_size, exception_on_overflow=False)
            yield data

class RTZROpenAPIClient:
    def __init__(self, client_id, client_secret):
        self._logger = logging.getLogger(__name__)
        self.client_id = client_id
        self.client_secret = client_secret
        self._sess = Session()
        self._token = None

    @property
    def token(self):
        if self._token is None or self._token["expire_at"] < time.time():
            resp = self._sess.post(
                API_BASE + "/v1/authenticate",
                data={"client_id": self.client_id, "client_secret": self.client_secret},
            )
            resp.raise_for_status()
            self._token = resp.json()
        return self._token["access_token"]

    async def streaming_transcribe(self, config=None):
        if config is None:
            config = dict(
                sample_rate="8000",
                encoding="LINEAR16",
                use_itn="true",
                use_disfluency_filter="false",
                use_profanity_filter="false",
            )

        STREAMING_ENDPOINT = "wss://{}/v1/transcribe:streaming?{}".format(
            API_BASE.split("://")[1], "&".join(map("=".join, config.items()))
        )
        conn_kwargs = dict(extra_headers={"Authorization": "bearer " + self.token})

        async def streamer(websocket):
            with MicrophoneStream(SAMPLE_RATE, DEFAULT_BUFFER_SIZE) as stream:
                for chunk in stream.generator():
                    await websocket.send(chunk)
                await websocket.send("EOS")

        async def transcriber(websocket):
            async for msg in websocket:
                msg = json.loads(msg)
                print(msg)
                if msg["final"]:
                    print("Final ended with " + msg["alternatives"][0]["text"])

        async with websockets.connect(STREAMING_ENDPOINT, **conn_kwargs) as websocket:
            await asyncio.gather(
                streamer(websocket),
                transcriber(websocket),
            )

if __name__ == "__main__":
    CLIENT_ID = f'{YOUR_CLIENT_ID}'
    CLIENT_SECRET = f'{YOUR_CLIENT_SECRET}'

    client = RTZROpenAPIClient(CLIENT_ID, CLIENT_SECRET)
    asyncio.run(client.streaming_transcribe())


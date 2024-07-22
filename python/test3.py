import subprocess
import grpc
import vito_stt_client_pb2 as pb
import vito_stt_client_pb2_grpc as pb_grpc
import asyncio

TOKEN = 'your_token_here'

async def audio_stream_generator():
    # FFmpeg 명령어를 사용하여 오디오 스트림을 캡처합니다.
    command = [
        'ffmpeg',
        '-f', 'alsa',              # 입력 형식 (Linux의 경우)
        '-i', 'default',           # 입력 장치 (기본 장치 사용)
        '-f', 'wav',               # 출력 형식
        '-'
    ]
    
    # FFmpeg 프로세스를 시작합니다.
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # FFmpeg의 오류 로그를 읽어 출력합니다.
    stderr = process.stderr.read().decode('utf-8')
    if stderr:
        print("FFmpeg Error:", stderr)
    
    try:
        while True:
            chunk = process.stdout.read(1024)  # 1024 바이트씩 읽기
            if not chunk:
                break
            yield pb.DecoderRequest(audio_content=chunk)
    finally:
        process.terminate()

async def transcribe_streaming_grpc():
    base = "grpc-openapi.vito.ai:443"
    # Create the gRPC channel
    channel = grpc.aio.secure_channel(base, grpc.ssl_channel_credentials())
    
    try:
        stub = pb_grpc.OnlineDecoderStub(channel)
        metadata = (('authorization', 'Bearer ' + TOKEN),)
        
        req_iter = audio_stream_generator()
        resp_iter = stub.Decode(req_iter, metadata=metadata)
        
        async for resp in resp_iter:
            for res in resp.results:
                if res.is_final:
                    print("Final Result:", res.alternatives[0].text)
    finally:
        await channel.close()  # Ensure the channel is closed when done

async def start_transcribe():
    print("Start transcribing...")
    await transcribe_streaming_grpc()

if __name__ == "__main__":
    asyncio.run(start_transcribe())

import whisper
import datetime
import subprocess
import torch
from pyannote.audio import Audio
from pyannote.audio.pipelines.speaker_verification import PretrainedSpeakerEmbedding
from pyannote.core import Segment
import wave
import contextlib
from sklearn.cluster import AgglomerativeClustering
import numpy as np
from concurrent.futures import ThreadPoolExecutor

# 설정
num_speakers = 2
language = 'English'
model_size = 'medium'
model_name = model_size
if language == 'English' and model_size != 'large':
    model_name += '.en'

# 오디오 파일 경로 (이미 WAV 파일로 가정)
path = './2_1409G2A5_1410G2A5_T1_2D02T0054C000096_005231.wav'

mono_path = 'audio_mono.wav'
subprocess.call(['ffmpeg', '-i', path, '-ac', '1', mono_path, '-y'])
path = mono_path

# Whisper 모델 로드
model = whisper.load_model(model_size)
result = model.transcribe(path)

segments = result["segments"]

# 오디오 파일 길이 계산
with contextlib.closing(wave.open(path, 'r')) as f:
    frames = f.getnframes()
    rate = f.getframerate()
    duration = frames / float(rate)

audio = Audio()

# 임베딩 모델 로드
embedding_model = PretrainedSpeakerEmbedding(
    "speechbrain/spkrec-ecapa-voxceleb",
    device=torch.device("cuda" if torch.cuda.is_available() else "cpu")
)

# 세그먼트 임베딩 생성 함수
def segment_embedding(segment):
    start = segment["start"]
    end = min(duration, segment["end"])
    clip = Segment(start, end)
    waveform, sample_rate = audio.crop(path, clip)
    return embedding_model(waveform[None])

# 병렬 처리로 임베딩 생성
embeddings = np.zeros(shape=(len(segments), 192))

def process_segment(i, segment):
    return i, segment_embedding(segment)

with ThreadPoolExecutor() as executor:
    results = list(executor.map(lambda x: process_segment(*x), enumerate(segments)))

for i, embedding in results:
    embeddings[i] = embedding

embeddings = np.nan_to_num(embeddings)

# 클러스터링 수행
clustering = AgglomerativeClustering(num_speakers).fit(embeddings)
labels = clustering.labels_
for i in range(len(segments)):
    segments[i]["speaker"] = 'SPEAKER' + str(labels[i] + 1)

# 시간 형식 변환 함수
def time(secs):
    return datetime.timedelta(seconds=round(secs))

# 텍스트 파일에 결과 저장
with open("transcript.txt", "w") as f:
    for i, segment in enumerate(segments):
        if i == 0 or segments[i - 1]["speaker"] != segment["speaker"]:
            f.write("\n" + segment["speaker"] + ' ' + str(time(segment["start"])) + '\n')
        f.write(segment["text"][1:] + ' ')
    f.close()

print(open('transcript.txt', 'r').read())

from fastapi import FastAPI, HTTPException, Request, status, File, UploadFile, Form
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing_extensions import Annotated
import sys
import requests
import librosa
import librosa.display
from sklearn.preprocessing import LabelEncoder
from keras.models import load_model
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
import shutil
from pydub import AudioSegment
from io import DEFAULT_BUFFER_SIZE
from starlette.requests import Request
from database import db_conn
from models import CycleData, Realtime_log, User_info, Notice_board, Push_alert
from dotenv import load_dotenv
import csv
from io import BytesIO, StringIO
import base64
from pydantic import BaseModel
from sqlalchemy import create_engine, select, desc
from datetime import datetime, timedelta
import json
from typing import Optional
from urllib.parse import unquote_plus
from google.oauth2 import service_account
from google.auth.transport.requests import Request as GoogleAuthRequest

# BASE_DIR 설정
BASE_DIR = os.path.dirname(os.path.dirname(os.path.relpath("./")))
dotenv_path = os.path.join(BASE_DIR, '.env')

# .env 파일 로드
load_dotenv(dotenv_path)

# 환경 변수 가져오기
HOSTNAME = os.getenv("Mysql_Hostname")
PORT = os.getenv("Mysql_Port")
USERNAME = os.getenv("Mysql_Username")
PASSWORD = os.getenv("Mysql_Password")
YOUR_CLIENT_ID = os.getenv("YOUR_CLIENT_ID")
YOUR_CLIENT_SECRET = os.getenv("YOUR_CLIENT_SECRET")
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
FASTAPI = os.getenv("FASTAPI")
FCM_API_URL = os.getenv("FCM_API_URL")

app = FastAPI()

db = db_conn()
session = db.sessionmaker()


def extract_feature(file_name):
    print("Starting feature extraction for:", file_name)  
    audio_data, sample_rate = librosa.load(file_name, sr=None, res_type='kaiser_fast')

    mfccs = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=40)
    mfccsscaled = np.mean(mfccs.T, axis=0)
    print("Feature extraction successful")  
    return np.array([mfccsscaled])

#CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


################################################api start#################################################

@app.get('/')
async def test():
    result = 'Hello World'
    return result


@app.post('/cycle/record-analyze')
async def cycle_recordAnalyze(request: Request, file: UploadFile = UploadFile(...)):
    model = load_model('src/urban_sound_model.h5')
    metadata = pd.read_csv('src/UrbanSound8K.csv')
    le = LabelEncoder()
    le.fit(metadata['class'])

    try:
        form_data = await request.form()
        timestamp = form_data['timestamp']
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        print(timestamp) 
        
        print(type(file))
        file_name = f'{file.filename}'
        print(file_name)
        with open(f'{file_name}', "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        test_feature = extract_feature(file_name)
        print(test_feature)
        
        y, sr = librosa.load(file_name)
        S = np.abs(librosa.stft(y))
        dB = librosa.amplitude_to_db(S, ref=1e-05)
        dBm = str(int(np.mean(dB)))
        print(dBm, 'dB')
        
        # 업로드 완료 후 임시 파일 삭제
        os.remove(f'{file_name}')

        if test_feature is not None:
            predicted_proba_vector = model.predict(test_feature)
            predicted_class_index = np.argmax(predicted_proba_vector)
            predicted_class_label = le.inverse_transform([predicted_class_index])[0]
            
            print(f"The predicted class for {file.filename} is: {predicted_class_label}")
        else:
            print("Failed to extract features from the file.")
        
        decibel = dBm
        await cycle_makeTsv(predicted_class_label, timestamp, decibel)
        
        return {"STATUS": 200, "RESULT": {"analyze_result": predicted_class_label, "time" : timestamp, "decibel" : decibel, "MESSAGE" : "All result is successfully analyze"}}
        
    except Exception as e:
        print(f"Error during model prediction: {e}")
        return {"STATUS": 400, "RESULT": {"MESSAGE": "Error"}}

@app.post('/cycle/make-tsv')
async def cycle_makeTsv(predicted_class_label: str, timestamp: str, decibel: int):
    try:
        output = StringIO()
        tw = csv.writer(output, delimiter='\t')
        tw.writerow(['label', 'time', 'decibel'])
        tw.writerow([predicted_class_label, timestamp, decibel])
        tsv_data = output.getvalue()
        output.close()
        
        file_uuid = timestamp
        user_uuid = 'user'
        
        await cycle_dataInsert(file_uuid=file_uuid, user_uuid=user_uuid, tsv_data=tsv_data)
        
        return {"STATUS": 200, "RESULT": {"MESSAGE" : "Successfully Save"}}
    except Exception as e:
        return {"STATUS": 400, "RESULT": {"MESSAGE": "Error"}}

@app.post('/cycle/data-insert')
async def cycle_dataInsert(file_uuid: str, user_uuid: str, tsv_data: str):
    tsv_data = tsv_data.encode('utf-8')
    
    insert = CycleData(file_uuid=file_uuid, user_uuid=user_uuid, tsv=tsv_data)
    session.add(insert)
    session.commit()
    result = session.query(CycleData).all()
    
    #await cycle_drawGraph(file_uuid=file_uuid)
    return {"STATUS": 200, "RESULT": {"data" : result}}


@app.get('/cycle/draw-graph')
async def cycle_drawGraph():
    try:
        file_uuid = session.query(CycleData).order_by(desc(CycleData.file_uuid)).first()
        print(file_uuid.file_uuid)
        file_uuid = file_uuid.file_uuid
        tsv_data = session.query(CycleData.tsv).filter(CycleData.file_uuid == file_uuid).first()[0]
        tsv_str = tsv_data.decode('utf-8')
        
        # TSV 데이터 파싱
        labels = []
        decibels = []
        with StringIO(tsv_str) as tsv_file:
            tsv_reader = csv.reader(tsv_file, delimiter='\t')
            next(tsv_reader)  # Header skip
            for row in tsv_reader:
                label, _, decibel = row
                labels.append(label)
                decibels.append(int(decibel))
        
        # 그래프 그리기
        plt.figure()
        plt.scatter(decibels, labels)
        plt.xlabel('Decibel')
        plt.ylabel('Label')
        plt.title('My room')

        # 이미지를 Base64로 변환하여 반환
        img_buf = BytesIO()
        plt.savefig(img_buf, format='png')
        img_buf.seek(0)
        img_base64 = base64.b64encode(img_buf.getvalue()).decode('utf-8')
        
        plt.close()  # 그래프 종료
        
        return img_base64
    
    except Exception as e:
        print(f"Error during graph drawing: {e}")
        raise HTTPException(status_code=500, detail="Error during graph drawing")

    
from sqlalchemy import func
@app.post('/cycle/draw-day-graph')
async def cycle_draw_day_graph(request: Request):
    data = await request.json()
    startdate = data.get('startdate')
    enddate = data.get('enddate')
    try:
        #start_datetime = datetime.strptime(startdate, '%Y%m%d')
        #end_datetime = datetime.strptime(enddate, '%Y%m%d') + timedelta(days=1)  # enddate를 포함하도록 하루 추가
        labels = []
        decibels = []
        
        file_uuids = session.query(CycleData.file_uuid).filter(
            func.substr(CycleData.file_uuid, 1, 8).between(startdate, enddate)
        ).all()

        if not file_uuids:
            return {"status": 200, "message": "No data"}
        
        for file_uuid in file_uuids:
            tsv_data = session.query(CycleData.tsv).filter(CycleData.file_uuid == file_uuid[0]).first()

            if tsv_data:
                tsv_str = tsv_data[0].decode('utf-8')

                with StringIO(tsv_str) as tsv_file:
                    tsv_reader = csv.reader(tsv_file, delimiter='\t')
                    next(tsv_reader)  # Header skip
                    for row in tsv_reader:
                        label, _, decibel = row
                        labels.append(label)
                        decibels.append(int(decibel))
                        
        plt.figure()
        plt.scatter(decibels, labels)
        plt.xlabel('Decibel')
        plt.ylabel('Label')
        plt.title('My room')

        img_buf = BytesIO()
        plt.savefig(img_buf, format='png')
        img_buf.seek(0)
        img_base64 = base64.b64encode(img_buf.getvalue()).decode('utf-8')

        plt.close()  

        return {"status": 200, "message": "Graph drawn successfully", "image": img_base64}

    except Exception as e:
        print(f"Error during graph drawing: {e}")
        raise HTTPException(status_code=500, detail="Error during graph drawing")
    

@app.get('/cycle/delete')
async def cycle_delete(file_uuid=None):
    if file_uuid is None:
        return "file_uuid is None"
    else:
        result = session.query(CycleData).filter(CycleData.file_uuid==file_uuid).delete()
        session.commit()
        result = session.query(CycleData).all()
        return result

@app.get('/cycle/delete-all')
async def cycle_deleteAll():
    result = session.query(CycleData).delete()
    session.commit()
    result = session.query(CycleData).all()
    return result



##################################################################


class NoticeCreate(BaseModel):
    title: str
    content: str
    file: Optional[str] = None

class NoticeUpdate(BaseModel):
    title: str
    content: str
    file: Optional[str] = None

class NoticeItem(BaseModel):
    no: int
    title: str
    content: str | None
    date: datetime
    file: str | None

    class Config:
        orm_mode = True

from typing import List

@app.get("/noticeList", response_model=List[NoticeItem])
async def get_notice_list():
    try:
        query = session.query(Notice_board).all()
        return query
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/noticeFirst")
async def get_notice_first():
    query = session.query(Notice_board.title).order_by(desc(Notice_board.no)).first()
    return {"title": query[0]}

@app.get("/noticeContent/{notice_no}", response_model=NoticeItem)
async def get_notice_content(notice_no: int):
    try:
        query = session.query(Notice_board).filter(Notice_board.no == notice_no).first()
        
        if query is None:
            raise HTTPException(status_code=404, detail="공지사항을 찾을 수 없습니다")
            
        return query
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/noticeInsert")
async def save_notice_data(notice: NoticeCreate):
    insert = Notice_board(title=notice.title, content=notice.content, file=notice.file)
    session.add(insert)
    session.commit()
    session.refresh(insert)
    result = {"notice_no": insert.no}
    return result

@app.put("/noticeUpdate/{notice_no}")
async def update_notice_data(notice_no: int, notice: NoticeUpdate):
    update = session.query(Notice_board).filter(Notice_board.no == notice_no).first()
    update.title = notice.title
    update.content = notice.content
    update.file = notice.file
    session.commit()
    result = session.query(Notice_board).all()
    return result

@app.delete("/noticeDelete/{notice_no}")
async def delete_notice_data(notice_no: int):
    delete = session.query(Notice_board).filter(Notice_board.no == notice_no).first()
    session.delete(delete)
    session.commit()
    result = session.query(Notice_board).all()
    return result


class RealtimeInsert(BaseModel):
    timemap: str
    label: str
    decibel: int

@app.post("/realtimeInsert")
async def save_realtime_data(realtime: RealtimeInsert):
    print("realtime: ", realtime.timemap, realtime.label, realtime.decibel)
    insert = Realtime_log(timemap=realtime.timemap, label=realtime.label, decibel=realtime.decibel)
    session.add(insert)
    session.commit()
    session.refresh(insert)
    return insert

@app.get("/getNoiseDataAll")
async def get_noise_data():
    query = session.query(Realtime_log).all()
    return query

@app.get("/getNoiseDataWeek")
async def get_noise_data_week():
    try:
        enddate = datetime.now()
        startdate = enddate - timedelta(days=7)

        query = session.query(Realtime_log).filter(
            func.substr(Realtime_log.timemap, 22, 19).between(
                startdate.strftime("%Y-%m-%d-%H:%M:%S"),
                enddate.strftime("%Y-%m-%d-%H:%M:%S")
            )
        ).all()

        return query

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/getNoiseDataOneDay")
async def get_noise_data_one_day():
    try:
        enddate = datetime.now()
        startdate = enddate - timedelta(days=1)

        query = session.query(Realtime_log).filter(
            func.substr(Realtime_log.timemap, 22, 19).between(
                startdate.strftime("%Y-%m-%d-%H:%M:%S"),
                enddate.strftime("%Y-%m-%d-%H:%M:%S")
            )
        ).all()

        return query

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.delete("/userDelete")
async def delete_user_data(id: str, role: str):
    decoded_id = unquote_plus(id)
    decoded_role = unquote_plus(role)
    delete = session.query(User_info).filter((User_info.email == decoded_id) & (User_info.role == decoded_role)).first()
    session.delete(delete)
    session.commit()
    result = session.query(User_info).all()
    return result

class UserUpdate(BaseModel):
    id: str
    name: str
    img: str
    role: str

@app.put("/userUpdate")
async def update_user_data(user_data: UserUpdate):
    try:
        decoded_id = unquote_plus(user_data.id)
        decoded_role = unquote_plus(user_data.role)
        update = session.query(User_info).filter((User_info.email == decoded_id)&(User_info.role == decoded_role)).first()
        if not update:
            raise HTTPException(status_code=404, detail="User not found")

        update.name = user_data.name
        update.user_avatar = user_data.img

        session.commit()
        session.refresh(update)
        return {"message": "User updated successfully", "user": update}

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()

######################################################################


from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from requests import Session
from starlette.websockets import WebSocketDisconnect
import vito_stt_client_pb2 as pb
import vito_stt_client_pb2_grpc as pb_grpc
import grpc
from typing import AsyncIterator  
import wave   
import struct
import io
from aiohttp import FormData
import joblib
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

API_BASE = "https://openapi.vito.ai"

SAMPLE_RATE = 16000
ENCODING = pb.DecoderConfig.AudioEncoding.LINEAR16
BYTES_PER_SAMPLE = 2

resp = requests.post(
    'https://openapi.vito.ai/v1/authenticate',
    data={'client_id': f'{YOUR_CLIENT_ID}',
          'client_secret': f'{YOUR_CLIENT_SECRET}'}
)
resp.raise_for_status()
            
TOKEN = str(resp.json().get('access_token'))


# 오디오 데이터 증강 함수 정의
def noise(data):
    noise_amp = 0.035 * np.random.uniform() * np.amax(data)
    data = data + noise_amp * np.random.normal(size=data.shape[0])
    return data

def stretch(data, rate):
    return librosa.effects.time_stretch(y=data, rate=rate)

def pitch(data, sampling_rate, pitch_factor):
    return librosa.effects.pitch_shift(data, sr=sampling_rate, n_steps=pitch_factor)

# 오디오 특성 추출 함수 정의
def extract_features(data, sample_rate):
    result = np.array([])
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
    result = np.hstack((result, zcr))
    stft = np.abs(librosa.stft(data))
    chroma_stft = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)
    result = np.hstack((result, chroma_stft))
    mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sample_rate).T, axis=0)
    result = np.hstack((result, mfcc))
    rms = np.mean(librosa.feature.rms(y=data).T, axis=0)
    result = np.hstack((result, rms))
    mel = np.mean(librosa.feature.melspectrogram(y=data, sr=sample_rate).T, axis=0)
    result = np.hstack((result, mel))
    return result

# 오디오 파일로부터 특성 추출 함수 정의
def get_features(path):
    data, sample_rate = librosa.load(path, duration=2.5, offset=0.0)
    res1 = extract_features(data, sample_rate)
    result = np.array(res1)
    noise_data = noise(data)
    res2 = extract_features(noise_data, sample_rate)
    result = np.concatenate((result, res2), axis=0)
    new_data = stretch(data, 0.7)
    data_stretch_pitch = pitch(new_data, sample_rate, 0.8)
    res3 = extract_features(data_stretch_pitch, sample_rate)
    result = np.concatenate((result, res3), axis=0)
    return result
    
# 문장 임베딩 클래스 정의
class TextEmbedding:
    def __init__(self, model_name):
        self.model_name = model_name

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        if 'sentence' in X.columns:
            embedding_model = SentenceTransformer(self.model_name)
            embedding_vec = embedding_model.encode(X['sentence'])
            X_val = np.concatenate((X.drop(['sentence'], axis=1), embedding_vec), axis=1)
        else:
            embedding_vec = self.embedding_model.encode(X)
            X_val = embedding_vec
        return X_val
    
pre_trained_model_path = 'src/jhgan_newko-sroberta-sts.h5'
pre_trained_model = load_model(pre_trained_model_path)
scaler = joblib.load('src/scaler.pkl')



audio_chunks = []
last_offset = 0 
async def audio_stream_generator(websocket: WebSocket) -> AsyncIterator[pb.DecoderRequest]:
    global audio_chunks
    
    config = pb.DecoderConfig(sample_rate=SAMPLE_RATE, use_itn=True)
    yield pb.DecoderRequest(streaming_config=config)
    
    try:
        async for chunk in websocket.iter_bytes():
            audio_chunks.extend(chunk)
            #print("pb", pb.DecoderRequest(audio_content=chunk))
            yield pb.DecoderRequest(audio_content=chunk)
    except WebSocketDisconnect:
        pass
    

async def transcribe_streaming_grpc(websocket: WebSocket):
    global audio_chunks
    
    base = "grpc-openapi.vito.ai:443"
    async with grpc.aio.secure_channel(base, credentials=grpc.ssl_channel_credentials()) as channel:
        stub = pb_grpc.OnlineDecoderStub(channel)
        metadata = (('authorization', 'Bearer ' + TOKEN),)

        # Create the request iterator
        req_iter = audio_stream_generator(websocket)
        # Call the gRPC method with the request iterator and metadata
        async for resp in stub.Decode(req_iter, metadata=metadata):
            for res in resp.results:
                if res.is_final:
                    text = res.alternatives[0].text
                    print(text)
                    if(text != ''):
                        start_time = res.alternatives[0].words[0].start_at
                        end_time = res.alternatives[0].words[-1].start_at + res.alternatives[0].words[-1].duration

                        start_offset = int(start_time * (SAMPLE_RATE / 1000))
                        end_offset = int(end_time * (SAMPLE_RATE / 1000))
                        
                        text_result = await text_emotion(text)
                    
                        if audio_chunks:
                            audio_data = audio_chunks[start_offset:end_offset]
                            byte_data = struct.pack('<' + 'h'*len(audio_data), *audio_data)

                            # WAV 파일 생성
                            wav_buffer = io.BytesIO()
                            with wave.open(wav_buffer, 'wb') as wav_file:
                                # 채널 수 설정 (모노)
                                wav_file.setnchannels(1)
                                # 샘플 폭 설정 (2바이트)
                                wav_file.setsampwidth(2)
                                # 프레임 레이트 설정 (예: 44100Hz)
                                wav_file.setframerate(16000)
                                # 데이터 쓰기
                                wav_file.writeframes(byte_data)

                            print("WAV 파일이 생성되었습니다: output.wav")
                            wav_buffer.seek(0)
                            
                            if(text_result != '중립'):
                                audio_features = get_features(wav_buffer)
                                X_audio = [audio_features]
                                audio_features_df = pd.DataFrame(X_audio)

                                text_data = pd.DataFrame({'sentence': [text]})
                                final_df = pd.concat([audio_features_df, text_data], axis=1)

                                txt_embed = TextEmbedding(model_name='jhgan/ko-sroberta-sts')
                                X = txt_embed.transform(final_df)

                                X = scaler.transform(X)
                                X = np.expand_dims(X, axis=2)

                                predictions = pre_trained_model.predict(X)
                                predicted_labels = np.argmax(predictions, axis=1)
                                predicted_labels = predicted_labels[0]
                                
                                if(predicted_labels == 2):
                                    predicted_labels = 1
                                elif(predicted_labels == 4):
                                    predicted_labels = 6

                                predicted_emotions = ['angry', 'anxious', 'embarrassed', 'happy', 'hurt', 'neutrality', 'sad']
                                predicted_emotion = predicted_emotions[predicted_labels]
                                
                                
                                print(f"Predicted emotion: {predicted_emotion}")
                            else:
                                predicted_emotion = 'neutrality'
                            audio_chunks = audio_chunks[end_offset:]
                            
                            message = json.dumps({
                            'text': text,
                            "emotion": predicted_emotion
                            })
                            await websocket.send_text(message)
    
                                                

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    
    await websocket.accept()
    
    try:
        await transcribe_streaming_grpc(websocket)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
 

@app.post("/textemotion")
async def text_emotion(text):
    model_name = "nlp04/korean_sentiment_analysis_dataset3_best"
    tokenizer = AutoTokenizer.from_pretrained(model_name, token=HUGGINGFACE_TOKEN)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, token=HUGGINGFACE_TOKEN)
    
    bertClassifier = pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer,
        device="cpu", 
        top_k=None
    )
    
    result = bertClassifier(text)[0]
    first_label = result[0]['label']
    print(first_label)
    return first_label
    


######################################################################



@app.post("/emotion")
async def predict_emotion(file: UploadFile = File(...), text: str = Form(...)):
    file_content = await file.read()
    print(file.filename)  # 파일 이름 출력
    print(text)
    
    audio_features = get_features(file_content)
    X_audio = [audio_features]
    audio_features_df = pd.DataFrame(X_audio)

    text_data = pd.DataFrame({'sentence': [text]})
    final_df = pd.concat([audio_features_df, text_data], axis=1)

    txt_embed = TextEmbedding(model_name='jhgan/ko-sroberta-sts')
    X = txt_embed.transform(final_df)

    X = scaler.transform(X)
    X = np.expand_dims(X, axis=2)

    predictions = pre_trained_model.predict(X)
    predicted_labels = np.argmax(predictions, axis=1)
    predicted_labels = predicted_labels[0]

    predicted_emotions = ['angry', 'anxious', 'embarrassed', 'happy', 'hurt', 'neutrality', 'sad']
    predicted_emotion = predicted_emotions[predicted_labels]

    print(f"Predicted emotion: {predicted_emotion}")
    #return {"predicted_emotion": predicted_emotion}
    


########################################################################


# def send_push_notification(access_token, token):
#     url = 'https://fcm.googleapis.com/v1/projects/soundproject-26e1d/messages:send'
#     headers = {
#         'Authorization': f'Bearer {access_token}',
#         'Content-Type': 'application/json',
#     }
#     payload = {
#         "message": {
#             "notification": {
#                 "title": "Test중",
#                 "body": "Test"
#             },
#             "token": token
#         }
#     }

#     response = requests.post(url, headers=headers, data=json.dumps(payload))
#     print("Response:", response.json())  # 응답을 로그로 확인합니

# # 예시 토큰
# access_token = get_access_token()
# token = "e-jg0Ky5C5FOFXKZcDcQgk:APA91bH0Pnz3VoV6x_HNk62V59A2ZAsieA5B3_724QJfymrmWyHI7L9829A_ibYH5g0fGRFNtP53kbEpmzbAgd3TtqJeWMBG5zC-_oXKK9WVei9lxMVAR-4_C88lJ2W6s-J1nbm6Hdrv"
# #token = "dH_fM1x6mXv6rvPEnIDs4C:APA91bHefz8Dmg4671QmlGgVqx6QddwAXt9ZTtzlncumuB8I_aV8gjNja5PVbK-jqXTb7CqtUz9TzT_aw_0vHOwYgvDt8ssjyEwbseyeQSqBuaX4FM1U16eNvSk8ts3Nen4RX2cP2zVz"
# send_push_notification(access_token, token)
    

# 서비스 계정 JSON 파일 경로
SERVICE_ACCOUNT_FILE = 'src/soundproject-26e1d-firebase-adminsdk-ntoea-046129bd6b.json'

def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    credentials.refresh(GoogleAuthRequest())
    return credentials.token

class Token(BaseModel):
    token: str

@app.post("/saveToken")
async def save_token(token: Token):
    token = token.token
    
class TokenInsert(BaseModel):
    uuid: str
    fcmToken: str
    permission: str = "yes" 

@app.post("/insertToken")
async def insert_token(tokenInsert: TokenInsert):
    device_tokens = tokenInsert.fcmToken
    if not device_tokens:
        raise HTTPException(status_code=400, detail="No tokens available")

    token = device_tokens
    print(tokenInsert.uuid)
    
    # 사용자 UUID로 기존 데이터를 조회
    existing_entry = session.query(Push_alert).filter(Push_alert.uuid == tokenInsert.uuid).first()
    existing_token = session.query(Push_alert).filter(Push_alert.token == token).first()

    if existing_entry:
        if existing_token:
            return {"message": "User already exists with the same token", "data": existing_token}
        if existing_entry.token != token:
            new_entry = Push_alert(uuid=tokenInsert.uuid, token=token, permission=tokenInsert.permission)
            session.add(new_entry)
            session.commit()
            session.refresh(new_entry)
            return {"message": "New user created and token inserted successfully", "data": new_entry}
        return {"message": "User already exists with the same token", "data": existing_entry}
    else:
        if existing_token: 
            return {"message": "User already exists with the same token", "data": existing_token}
        new_entry = Push_alert(uuid=tokenInsert.uuid, token=token, permission=tokenInsert.permission)
        session.add(new_entry)
        session.commit()
        session.refresh(new_entry)
        return {"message": "New user created and token inserted successfully", "data": new_entry}


class PushNotification(BaseModel):
    tokens: list[str]
    title: str
    body: str

@app.post("/sendPushNotification")
async def send_push_notification(notification: PushNotification):
    access_token = get_access_token()
    
    url = 'https://fcm.googleapis.com/v1/projects/soundproject-26e1d/messages:send'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }

    failed_tokens = []
    
    tokens = session.query(Push_alert.token).all()
    
    if not tokens:
        raise HTTPException(status_code=404, detail="No tokens found in the database")

    tokens = [token[0] for token in tokens]
    
    #tokens = ["dH_fM1x6mXv6rvPEnIDs4C:APA91bHefz8Dmg4671QmlGgVqx6QddwAXt9ZTtzlncumuB8I_aV8gjNja5PVbK-jqXTb7CqtUz9TzT_aw_0vHOwYgvDt8ssjyEwbseyeQSqBuaX4FM1U16eNvSk8ts3Nen4RX2cP2zVz", "e-jg0Ky5C5FOFXKZcDcQgk:APA91bH0Pnz3VoV6x_HNk62V59A2ZAsieA5B3_724QJfymrmWyHI7L9829A_ibYH5g0fGRFNtP53kbEpmzbAgd3TtqJeWMBG5zC-_oXKK9WVei9lxMVAR-4_C88lJ2W6s-J1nbm6Hdrv"]
    for token in tokens:
        print(token)
        message = {
            "message": {
                "token": token,
                "notification": {
                    "title": notification.title,
                    "body": notification.body
                }
            }
        }

        response = requests.post(url, headers=headers, json=message)
        
        try:
            response_data = response.json()
            print("response_data:", response_data)
        except ValueError as e:
            raise HTTPException(status_code=response.status_code, detail=f"Invalid JSON response: {response.text}")
        
        if response.status_code != 200:
            failed_tokens.append(token)
    
    if failed_tokens:
        raise HTTPException(status_code=400, detail=f"Failed to send notification to tokens: {failed_tokens}")
    
    return {"message": "Push notifications sent successfully"}
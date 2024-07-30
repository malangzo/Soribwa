from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

# 로컬 모델 경로
local_model_path = "./korean_sentiment_analysis_dataset3_best"

# 모델과 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained(local_model_path)
model = AutoModelForSequenceClassification.from_pretrained(local_model_path, from_pt=True)

# 분류 파이프라인 생성
classifier = pipeline(
    "text-classification",
    model=model,
    tokenizer=tokenizer,
    device="cpu"
)

# 예제 사용법
result = classifier("이 영화 정말 재미있어요!")
print(result)

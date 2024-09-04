# 🔉 소리봐 : 중증 청각장애인을 위한 소리 및 감정 분석 AI 서비스

<br>
<div align="center">
<img src="https://github.com/user-attachments/assets/555e2894-e51f-4952-98ee-c47e4dfa27d7">
<br>
</div>
<br>

## 프로젝트 소개

- 고도 청각장애인을 위한 소음 측정 및 위험도 분석과 대화 감정 분석을 주 기능으로 한 웹 앱
- 소음 측정 및 위험도 분석 - 소음을 측정하여 어떠한 소음인지 나타내어 주고 위험도에 따라 푸시 알림
- 대화 감정 분석 - 음성을 실시간으로 STT 하는 동시에 어조를 통한 감정을 예측하여 출력

<br>

## 주요 기능 페이지

 - 실시간 소음 분석 페이지
<br><br><span align="center"><img src="https://github.com/user-attachments/assets/1ae02b5b-8543-47a1-b799-d5e0718bdbb6"></span>
 - 소음 지도 페이지
<br><br><span align="center"><img src="https://github.com/user-attachments/assets/6ecb1bbc-4aa7-4708-beab-94d82f915495"></span>
 - 대화 STT 및 감정 분석 페이지
<br><br><span align="center"><img src="https://github.com/user-attachments/assets/b59faba0-d0a3-44d3-ac1c-56d82a301e5d"></span>

<br>

## 메인 및 기타 페이지

 - 메인 페이지
<br><br><span align="center"><img src="https://github.com/user-attachments/assets/e3250e3c-ef9a-4f40-b1e8-a4dcfba04796"></span>
 - 로그인 및 회원가입 페이지
<br><br><span align="center"><img src="https://github.com/user-attachments/assets/325d8646-7a81-4367-8635-08154fff361d"></span>
 - 공지사항 페이지
<br><br><span align="center"><img src="https://github.com/user-attachments/assets/92407337-3093-4f95-b00c-9d7ffdb69c93"></span>


## 팀원 역할 분담

### 🐱장유정

- **UI**
    - 전체 React 페이지 총괄
    - 소음 지도 페이지
    - 공지사항 페이지
- **기능**
    - 카카오맵 API 사용 기반 소음 지도 기능
    	- GPS 기반 현재 위치 표시 기능
        - 주변 소음 마커 표시 및 설명 추가
        - 주변 소음 기준 영향 범위 표시
    - 공지사항 게시판 기능

<br>

### 🐹오윤주 - 팀장

- **UI**
    - 전체 Figma 작성
    - 메인 페이지 작성
    - 대화 감정 분석 페이지 작성
- **기능**
    - 대화감정 예측 딥러닝 모델 학습
    - PWA 푸시 알림 기능 개발
    - ReturnZero STT API 사용 실시간 STT 통신
<br>
    
### 🐶최재혁

- **UI**
    - 소음분석 페이지 작성
    - 로그인 및 회원가입 페이지 작성
- **기능**
    - 소음분석 딥러닝 모델 학습
    - Mysql DB 구조 설계
    - 로그인 및 회원가입 기능 개발
    - Docker, Kubernetes 환경 구축


<br>

## 기술 스택

<h3 align="left">Frontend</h3>
<div>
	<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
	<img src="https://img.shields.io/badge/javascript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black">
	<img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
	<img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
</div>

<h3 align="left">Backend</h3>
<div>
	<img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54">
	<img src="https://img.shields.io/badge/fastapi-009688?style=for-the-badge&logo=fastapi&logoColor=white">
	<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
</div>

<h3 align="left">DB</h3>
<div>
	<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
</div>

<h3 align="left">DevOps</h3>
<div>
	<img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=Linux&logoColor=white">
	<img src="https://img.shields.io/badge/AWS EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=black">
	<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
	<img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=Kubernetes&logoColor=white">
</div>


<br>

## 개발 기간

- 전체 개발 기간 : 2024.06 ~ 2024.08

<br>


